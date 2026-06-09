<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Role filter
        if ($request->filled('role') && $request->input('role') !== 'All') {
            $roleMap = [
                'Merchant' => 'merchant',
                'Driver' => 'livreur'
            ];
            $roleVal = $roleMap[$request->input('role')] ?? strtolower($request->input('role'));
            $query->where('role', $roleVal);
        } else {
            // Exclude admins from the general partner list unless specifically requested
            $query->whereIn('role', ['merchant', 'livreur']);
        }

        // Status filter
        if ($request->filled('status') && $request->input('status') !== 'All') {
            $status = strtolower($request->input('status'));
            if ($status === 'active' || $status === 'approved') {
                $query->whereNotNull('email_verified_at');
            } elseif ($status === 'verification pending' || $status === 'pending' || $status === 'verification_pending') {
                $query->whereNull('email_verified_at');
            }
        }

        // Region filter (mock logic)
        // Since there is no region column, we'll return all, but we can filter if the search has city names
        
        $users = $query->latest()->paginate(10);

        // Calculate KPIs
        $roleParam = $request->query('role');
        $kpiQuery = User::query();
        if ($roleParam) {
            $kpiQuery->where('role', $roleParam);
        } else {
            $kpiQuery->whereIn('role', ['merchant', 'livreur']);
        }
        $totalPartners = (clone $kpiQuery)->count();
        $activePartners = (clone $kpiQuery)->where('status', '!=', 'suspended')->whereNotNull('email_verified_at')->count();
        $pendingPartners = (clone $kpiQuery)->where('status', '!=', 'suspended')->whereNull('email_verified_at')->count();
        $suspendedPartners = (clone $kpiQuery)->where('status', 'suspended')->count();

        // Map users to UI response format
        $mappedUsers = collect($users->items())->map(function($user) {
            $initials = collect(explode(' ', $user->name))->map(fn($n) => mb_substr($n, 0, 1))->take(2)->join('');
            
            // Assign a consistent region based on user ID
            $regions = ['Casablanca, MA', 'Marrakech, MA', 'Agadir, MA', 'Tangier, MA', 'Rabat, MA'];
            $region = $regions[$user->id % count($regions)];

            return [
                'id' => $user->id,
                'name' => $user->name,
                'subText' => $user->phone ?? $user->email,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => strtoupper($initials),
                'avatarBg' => 'bg-purple-50',
                'avatarColor' => 'text-purple-600',
                'role' => $user->role === 'merchant' ? 'Merchant' : 'Driver',
                'status' => $user->status === 'suspended' ? 'Suspended' : ($user->email_verified_at ? 'Active' : 'Verification Pending'),
                'region' => $region,
                'joinedDate' => $user->created_at->format('M d, Y'),
                'verified' => !is_null($user->email_verified_at),
                'balance' => $user->balance,
                'vehicle_type' => $user->vehicle_type,
                'vehicle_plate' => $user->vehicle_plate,
                'cin' => $user->cin,
            ];
        });

        return response()->json([
            'users' => $mappedUsers,
            'kpis' => [
                'total' => $totalPartners,
                'active' => $activePartners,
                'pending' => $pendingPartners,
                'suspended' => $suspendedPartners
            ],
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:merchant,livreur',
            'phone' => 'nullable|string',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'email_verified_at' => now(), // Default created by admin are auto-verified
        ]);

        return response()->json([
            'message' => 'User Created Successfully.',
            'user' => $user
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => 'required|in:merchant,livreur',
            'phone' => 'nullable|string',
            'password' => 'nullable|string|min:6',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;
        $user->phone = $request->phone;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'User Updated Successfully.',
            'user' => $user
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'User Deleted Successfully.'
        ]);
    }

    public function approve($id)
    {
        $user = User::findOrFail($id);
        $user->email_verified_at = now();
        $user->save();

        return response()->json([
            'message' => 'User Approved Successfully.',
            'user' => $user
        ]);
    }

    public function getStats($id)
    {
        $user = User::findOrFail($id);
        
        $totalOrders = \App\Models\Order::where(function($q) use ($user) {
            if ($user->role === 'merchant') {
                $q->where('merchant_id', $user->id);
            } else {
                $q->where('livreur_id', $user->id);
            }
        })->count();
        
        $pendingOrders = \App\Models\Order::where(function($q) use ($user) {
            if ($user->role === 'merchant') {
                $q->where('merchant_id', $user->id);
            } else {
                $q->where('livreur_id', $user->id);
            }
        })->whereIn('status', ['pending', 'assigned'])->count();

        $inTransitOrders = \App\Models\Order::where(function($q) use ($user) {
            if ($user->role === 'merchant') {
                $q->where('merchant_id', $user->id);
            } else {
                $q->where('livreur_id', $user->id);
            }
        })->where('status', 'in_transit')->count();

        $deliveredOrders = \App\Models\Order::where(function($q) use ($user) {
            if ($user->role === 'merchant') {
                $q->where('merchant_id', $user->id);
            } else {
                $q->where('livreur_id', $user->id);
            }
        })->where('status', 'delivered')->count();

        $cancelledOrders = \App\Models\Order::where(function($q) use ($user) {
            if ($user->role === 'merchant') {
                $q->where('merchant_id', $user->id);
            } else {
                $q->where('livreur_id', $user->id);
            }
        })->where('status', 'canceled')->count();

        $totalSales = \App\Models\Order::where(function($q) use ($user) {
            if ($user->role === 'merchant') {
                $q->where('merchant_id', $user->id);
            } else {
                $q->where('livreur_id', $user->id);
            }
        })->where('status', 'delivered')->sum('amount_cod');

        return response()->json([
            'stats' => [
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'in_transit_orders' => $inTransitOrders,
                'delivered_orders' => $deliveredOrders,
                'cancelled_orders' => $cancelledOrders,
                'total_sales' => $totalSales,
                'wallet_balance' => $user->balance
            ]
        ]);
    }
}
