<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class FinanceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return $this->adminIndex($request);
        } elseif ($user->role === 'merchant') {
            return $this->merchantIndex($user);
        } elseif ($user->role === 'livreur') {
            return $this->livreurIndex($user);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }

    private function adminIndex(Request $request)
    {
        $merchants = User::where('role', 'merchant')
            ->select('id', 'name', 'email', 'balance', 'created_at')
            ->get()
            ->map(function($m) {
                return [
                    'id' => $m->id,
                    'name' => $m->name,
                    'email' => $m->email,
                    'balance' => floatval($m->balance),
                    'joined' => $m->created_at->format('Y-m-d')
                ];
            });

        $drivers = User::where('role', 'livreur')
            ->select('id', 'name', 'email', 'balance', 'created_at')
            ->get()
            ->map(function($d) {
                return [
                    'id' => $d->id,
                    'name' => $d->name,
                    'email' => $d->email,
                    'balance' => floatval($d->balance), // Balance tracks held cash for livreurs
                    'joined' => $d->created_at->format('Y-m-d')
                ];
            });

        $transactions = Transaction::with('user')
            ->latest()
            ->take(30)
            ->get()
            ->map(function($t) {
                return [
                    'id' => $t->id,
                    'user_id' => $t->user_id,
                    'user_name' => $t->user->name ?? 'System',
                    'user_role' => $t->user->role ?? 'N/A',
                    'type' => $t->type,
                    'amount' => floatval($t->amount),
                    'description' => $t->description,
                    'date' => $t->created_at->format('M d, Y H:i')
                ];
            });

        $totalHeldByDrivers = User::where('role', 'livreur')->sum('balance');
        $totalMerchantBalance = User::where('role', 'merchant')->sum('balance');
        $totalPayouts = abs(Transaction::where('type', 'payout')->sum('amount'));

        return response()->json([
            'merchants' => $merchants,
            'drivers' => $drivers,
            'transactions' => $transactions,
            'kpis' => [
                'total_held_by_drivers' => floatval($totalHeldByDrivers),
                'total_merchant_balance' => floatval($totalMerchantBalance),
                'total_payouts_made' => floatval($totalPayouts)
            ]
        ]);
    }

    private function merchantIndex(User $merchant)
    {
        $totalCollected = $merchant->ordersAsMerchant()->where('status', 'delivered')->sum('amount_cod');
        $totalPending = $merchant->ordersAsMerchant()->whereIn('status', ['pending', 'in_transit'])->sum('amount_cod');
        $availableBalance = floatval($merchant->balance);

        $transactions = $merchant->transactions()
            ->latest()
            ->take(20)
            ->get()
            ->map(function($t) {
                return [
                    'id' => $t->id,
                    'type' => $t->type,
                    'amount' => floatval($t->amount),
                    'description' => $t->description,
                    'date' => $t->created_at->format('M d, Y H:i')
                ];
            });

        return response()->json([
            'totalCollected' => floatval($totalCollected),
            'totalPending' => floatval($totalPending),
            'availableBalance' => $availableBalance,
            'transactions' => $transactions
        ]);
    }

    private function livreurIndex(User $livreur)
    {
        $balance = floatval($livreur->balance);
        $totalCollected = $livreur->ordersAsLivreur()->where('status', 'delivered')->sum('amount_cod');

        $transactions = $livreur->transactions()
            ->latest()
            ->take(20)
            ->get()
            ->map(function($t) {
                return [
                    'id' => $t->id,
                    'type' => $t->type,
                    'amount' => floatval($t->amount),
                    'description' => $t->description,
                    'date' => $t->created_at->format('M d, Y H:i')
                ];
            });

        return response()->json([
            'balance' => $balance,
            'totalCollected' => floatval($totalCollected),
            'transactions' => $transactions
        ]);
    }

    public function processPayout(Request $request)
    {
        $request->validate([
            'merchantId' => 'required|exists:users,id',
            'payoutAmount' => 'required|numeric|min:1',
        ]);

        $merchant = User::find($request->merchantId);

        if ($merchant->role !== 'merchant') {
            throw ValidationException::withMessages([
                'merchantId' => ['Selected user is not a merchant.'],
            ]);
        }

        if ($request->payoutAmount > $merchant->balance) {
            throw ValidationException::withMessages([
                'payoutAmount' => ['Payout amount cannot exceed merchant balance.'],
            ]);
        }

        DB::transaction(function () use ($merchant, $request) {
            $merchant->transactions()->create([
                'type' => 'payout',
                'amount' => -$request->payoutAmount,
                'description' => 'Admin paid out COD funds.',
            ]);

            $merchant->decrement('balance', $request->payoutAmount);
        });

        return response()->json([
            'message' => 'Payout processed successfully.',
            'balance' => floatval($merchant->fresh()->balance)
        ]);
    }

    public function processCollection(Request $request)
    {
        $request->validate([
            'livreurId' => 'required|exists:users,id',
            'collectionAmount' => 'required|numeric|min:1',
        ]);

        $livreur = User::find($request->livreurId);

        if ($livreur->role !== 'livreur') {
            throw ValidationException::withMessages([
                'livreurId' => ['Selected user is not a driver.'],
            ]);
        }

        if ($request->collectionAmount > $livreur->balance) {
            throw ValidationException::withMessages([
                'collectionAmount' => ['Collection amount cannot exceed driver\'s held cash.'],
            ]);
        }

        DB::transaction(function () use ($livreur, $request) {
            $livreur->transactions()->create([
                'type' => 'admin_collection',
                'amount' => -$request->collectionAmount,
                'description' => 'Admin collected cash from Driver.',
            ]);

            $livreur->decrement('balance', $request->collectionAmount);
        });

        return response()->json([
            'message' => 'Cash collected successfully from Driver.',
            'balance' => floatval($livreur->fresh()->balance)
        ]);
    }

    public function requestWithdrawal(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'amount' => 'required|numeric|min:1',
        ]);

        $amount = floatval($request->amount);

        if ($amount > $user->balance) {
            throw ValidationException::withMessages([
                'amount' => ['Withdrawal amount cannot exceed available balance.'],
            ]);
        }

        $transaction = DB::transaction(function () use ($user, $amount) {
            $user->decrement('balance', $amount);

            return $user->transactions()->create([
                'type' => 'payout',
                'amount' => -$amount,
                'status' => 'pending',
                'description' => 'Merchant requested COD withdrawal.',
            ]);
        });

        return response()->json([
            'message' => 'Withdrawal request submitted successfully.',
            'balance' => floatval($user->fresh()->balance),
            'transaction' => $transaction
        ], 201);
    }
}
