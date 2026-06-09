<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class AdminController extends Controller
{
    /**
     * User suspension & activation
     */
    public function suspendUser($id)
    {
        $user = User::findOrFail($id);
        $user->update(['status' => 'suspended']);

        // Log audit
        $this->logAudit('suspend_user', "Suspended user {$user->name} ({$user->email})");

        return response()->json([
            'message' => 'User suspended successfully.',
            'user' => $user
        ]);
    }

    public function activateUser($id)
    {
        $user = User::findOrFail($id);
        $user->update(['status' => 'active']);

        // Log audit
        $this->logAudit('activate_user', "Activated user {$user->name} ({$user->email})");

        return response()->json([
            'message' => 'User activated successfully.',
            'user' => $user
        ]);
    }

    /**
     * Order reassignment & cancellation
     */
    public function reassignOrder(Request $request, $id)
    {
        $request->validate([
            'livreur_id' => 'required|exists:users,id'
        ]);

        $order = Order::findOrFail($id);
        $driver = User::findOrFail($request->livreur_id);

        if ($driver->role !== 'livreur') {
            return response()->json(['error' => 'Selected user is not a driver.'], 400);
        }

        $oldDriverName = $order->livreur ? $order->livreur->name : 'unassigned';
        $order->update([
            'livreur_id' => $driver->id,
            'status' => 'in_transit'
        ]);

        $this->logAudit('reassign_order', "Reassigned order {$order->tracking_number} from {$oldDriverName} to {$driver->name}");

        return response()->json([
            'message' => "Order successfully reassigned to {$driver->name}.",
            'order' => $order->load('livreur')
        ]);
    }

    public function cancelOrder($id)
    {
        $order = Order::findOrFail($id);
        $order->update(['status' => 'canceled']);

        $this->logAudit('cancel_order', "Cancelled order {$order->tracking_number}");

        return response()->json([
            'message' => 'Order cancelled successfully.',
            'order' => $order
        ]);
    }

    public function updateOrderNotes(Request $request, $id)
    {
        $request->validate([
            'notes' => 'nullable|string'
        ]);

        $order = Order::findOrFail($id);
        $order->update(['admin_notes' => $request->input('notes')]);

        $this->logAudit('update_order_notes', "Updated internal notes for order {$order->tracking_number}");

        return response()->json([
            'message' => 'Order notes updated successfully.',
            'order' => $order
        ]);
    }

    /**
     * Financial settlement approvals
     */
    public function getWithdrawals()
    {
        $withdrawals = Transaction::with('user')
            ->where('type', 'payout')
            ->latest()
            ->get()
            ->map(function($w) {
                return [
                    'id' => $w->id,
                    'user_id' => $w->user_id,
                    'user_name' => $w->user->name ?? 'N/A',
                    'user_email' => $w->user->email ?? 'N/A',
                    'user_role' => $w->user->role ?? 'N/A',
                    'amount' => abs(floatval($w->amount)),
                    'status' => $w->status ?? 'pending',
                    'bank_details' => [
                        'bank_name' => $w->user->bank_name ?? 'N/A',
                        'bank_rib' => $w->user->bank_rib ?? 'N/A',
                        'holder_name' => $w->user->bank_holder_name ?? 'N/A',
                    ],
                    'description' => $w->description,
                    'date' => $w->created_at->format('Y-m-d H:i')
                ];
            });

        return response()->json([
            'withdrawals' => $withdrawals
        ]);
    }

    public function approveWithdrawal($id)
    {
        $transaction = Transaction::findOrFail($id);

        if ($transaction->status === 'completed') {
            return response()->json(['error' => 'Withdrawal already completed.'], 400);
        }

        $user = $transaction->user;
        $amount = abs($transaction->amount);

        if ($user->balance < $amount) {
            return response()->json(['error' => 'User does not have sufficient balance for this withdrawal.'], 400);
        }

        DB::transaction(function() use ($transaction, $user, $amount) {
            $transaction->update(['status' => 'completed']);
            $user->decrement('balance', $amount);
        });

        $this->logAudit('approve_withdrawal', "Approved withdrawal of {$amount} MAD for user {$user->name}");

        return response()->json([
            'message' => 'Withdrawal approved successfully.',
            'transaction' => $transaction
        ]);
    }

    public function rejectWithdrawal($id)
    {
        $transaction = Transaction::findOrFail($id);

        if ($transaction->status !== 'pending') {
            return response()->json(['error' => 'Only pending withdrawals can be rejected.'], 400);
        }

        $transaction->update(['status' => 'rejected']);

        $this->logAudit('reject_withdrawal', "Rejected withdrawal of " . abs($transaction->amount) . " MAD for user " . ($transaction->user->name ?? 'N/A'));

        return response()->json([
            'message' => 'Withdrawal rejected successfully.',
            'transaction' => $transaction
        ]);
    }

    /**
     * Complaints / Support tickets
     */
    public function getComplaints()
    {
        $complaints = DB::table('complaints')
            ->leftJoin('users', 'complaints.user_id', '=', 'users.id')
            ->leftJoin('orders', 'complaints.order_id', '=', 'orders.id')
            ->select('complaints.*', 'users.name as user_name', 'users.email as user_email', 'users.role as user_role', 'orders.tracking_number')
            ->latest()
            ->get()
            ->map(function($c) {
                return [
                    'id' => $c->id,
                    'user_id' => $c->user_id,
                    'user_name' => $c->user_name,
                    'user_email' => $c->user_email,
                    'user_role' => $c->user_role,
                    'order_id' => $c->order_id,
                    'tracking_number' => $c->tracking_number ?? 'General Query',
                    'title' => $c->title,
                    'description' => $c->description,
                    'status' => $c->status,
                    'priority' => $c->priority,
                    'assigned_to' => $c->assigned_to,
                    'date' => \Carbon\Carbon::parse($c->created_at)->format('Y-m-d H:i')
                ];
            });

        return response()->json([
            'complaints' => $complaints
        ]);
    }

    public function assignComplaint(Request $request, $id)
    {
        $request->validate(['assigned_to' => 'required|string']);

        DB::table('complaints')->where('id', $id)->update([
            'assigned_to' => $request->assigned_to,
            'status' => 'pending'
        ]);

        return response()->json(['message' => 'Ticket assigned successfully.']);
    }

    public function resolveComplaint(Request $request, $id)
    {
        DB::table('complaints')->where('id', $id)->update([
            'status' => 'resolved'
        ]);

        $this->logAudit('resolve_complaint', "Resolved support ticket ID {$id}");

        return response()->json(['message' => 'Ticket resolved successfully.']);
    }

    public function closeComplaint($id)
    {
        DB::table('complaints')->where('id', $id)->update([
            'status' => 'closed'
        ]);

        return response()->json(['message' => 'Ticket closed successfully.']);
    }

    /**
     * Notification dispatch
     */
    public function sendAnnouncement(Request $request)
    {
        $request->validate([
            'target' => 'required|in:all,merchants,drivers',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $query = User::query();

        if ($request->target === 'merchants') {
            $query->where('role', 'merchant');
        } elseif ($request->target === 'drivers') {
            $query->where('role', 'livreur');
        } else {
            $query->whereIn('role', ['merchant', 'livreur']);
        }

        $users = $query->get();

        foreach ($users as $user) {
            DB::table('notifications')->insert([
                'user_id' => $user->id,
                'title' => $request->title,
                'message' => $request->message,
                'is_read' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->logAudit('send_announcement', "Sent system announcement: '{$request->title}' to target {$request->target}");

        return response()->json([
            'message' => 'Announcement dispatched to ' . $users->count() . ' users.'
        ]);
    }

    /**
     * Audit trail
     */
    public function getAuditLogs()
    {
        $logs = DB::table('audit_logs')
            ->leftJoin('users', 'audit_logs.user_id', '=', 'users.id')
            ->select('audit_logs.*', 'users.name as user_name', 'users.email as user_email')
            ->latest()
            ->get()
            ->map(function($l) {
                return [
                    'id' => $l->id,
                    'user_name' => $l->user_name ?? 'System',
                    'user_email' => $l->user_email ?? 'system@logismaghreb.com',
                    'event' => $l->event,
                    'description' => $l->description,
                    'ip_address' => $l->ip_address ?? '127.0.0.1',
                    'date' => \Carbon\Carbon::parse($l->created_at)->format('Y-m-d H:i')
                ];
            });

        return response()->json([
            'logs' => $logs
        ]);
    }

    /**
     * Integrations Monitoring
     */
    public function getIntegrations()
    {
        $merchants = User::where('role', 'merchant')
            ->select('id', 'name', 'email', 'webhook_url', 'webhook_secret', 'created_at')
            ->get()
            ->map(function($m) {
                return [
                    'id' => $m->id,
                    'name' => $m->name,
                    'email' => $m->email,
                    'webhook_url' => $m->webhook_url ?? 'Not configured',
                    'webhook_secret' => $m->webhook_secret ? '••••••••' : 'None',
                    'status' => $m->webhook_url ? 'active' : 'inactive',
                    'sync_count' => rand(10, 250), // Mock synclog count
                    'last_sync' => now()->subMinutes(rand(5, 120))->format('Y-m-d H:i')
                ];
            });

        return response()->json([
            'integrations' => $merchants
        ]);
    }

    /**
     * Platform Settings
     */
    public function getSettings()
    {
        $settings = DB::table('platform_settings')->pluck('value', 'key');
        return response()->json([
            'settings' => $settings
        ]);
    }

    public function updateSettings(Request $request)
    {
        $settings = $request->input('settings', []);

        foreach ($settings as $key => $value) {
            DB::table('platform_settings')->updateOrInsert(
                ['key' => $key],
                ['value' => $value, 'updated_at' => now()]
            );
        }

        $this->logAudit('update_settings', 'Admin modified system-wide configurations.');

        return response()->json([
            'message' => 'Settings updated successfully.',
            'settings' => DB::table('platform_settings')->pluck('value', 'key')
        ]);
    }

    /**
     * Helper to write to audit log
     */
    private function logAudit($event, $description)
    {
        $user = auth()->user();
        DB::table('audit_logs')->insert([
            'user_id' => $user ? $user->id : null,
            'event' => $event,
            'description' => $description,
            'ip_address' => request()->ip(),
            'created_at' => now(),
        ]);
    }
}
