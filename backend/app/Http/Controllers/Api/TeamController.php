<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class TeamController extends Controller
{
    /**
     * Display a listing of merchant staff members.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Only merchants can manage team staff members
        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $staff = $user->staff()
            ->select('id', 'name', 'email', 'phone', 'sub_role', 'created_at')
            ->latest()
            ->get();

        return response()->json([
            'staff' => $staff
        ]);
    }

    /**
     * Store a newly created staff member.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
            'sub_role' => ['required', Rule::in(['support', 'warehouse', 'finance'])],
        ]);

        $staff = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'merchant', // they share the merchant role context
            'merchant_id' => $user->id,
            'sub_role' => $request->sub_role,
        ]);

        return response()->json([
            'message' => 'Team member added successfully.',
            'staff' => [
                'id' => $staff->id,
                'name' => $staff->name,
                'email' => $staff->email,
                'phone' => $staff->phone,
                'sub_role' => $staff->sub_role,
                'created_at' => $staff->created_at->toDateTimeString(),
            ]
        ], 201);
    }

    /**
     * Update the specified staff member.
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $staff = $user->staff()->find($id);

        if (!$staff) {
            return response()->json(['message' => 'Team member not found.'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($staff->id)],
            'phone' => 'nullable|string|max:20',
            'sub_role' => ['required', Rule::in(['support', 'warehouse', 'finance'])],
            'password' => 'nullable|string|min:8',
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'sub_role' => $request->sub_role,
        ];

        if ($request->password) {
            $data['password'] = Hash::make($request->password);
        }

        $staff->update($data);

        return response()->json([
            'message' => 'Team member updated successfully.',
            'staff' => [
                'id' => $staff->id,
                'name' => $staff->name,
                'email' => $staff->email,
                'phone' => $staff->phone,
                'sub_role' => $staff->sub_role,
            ]
        ]);
    }

    /**
     * Remove the specified staff member.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $staff = $user->staff()->find($id);

        if (!$staff) {
            return response()->json(['message' => 'Team member not found.'], 404);
        }

        $staff->delete();

        return response()->json([
            'message' => 'Team member removed successfully.'
        ]);
    }
}
