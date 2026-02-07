<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Transaction;
use App\Models\User;

class TransactionPolicy
{
    /**
     * Check apakah user bisa view transactions
     * Viewer tidak bisa akses halaman transaksi - hanya admin dan operator
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isOperator();
    }

    /**
     * Check apakah user bisa view transaction spesifik
     */
    public function view(User $user, Transaction $transaction): bool
    {
        return $user->hasPermission('view_products');
    }

    /**
     * Check apakah user bisa membuat transaction (operator/admin only)
     */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isOperator();
    }

    /**
     * Check apakah user bisa menghapus transaction (hanya admin)
     */
    public function delete(User $user, Transaction $transaction): bool
    {
        return $user->isAdmin();
    }

    /**
     * Check apakah user bisa restore deleted transaction (hanya admin)
     */
    public function restore(User $user, Transaction $transaction): bool
    {
        return $user->isAdmin();
    }

    /**
     * Check apakah user bisa force delete transaction (hanya admin)
     */
    public function forceDelete(User $user, Transaction $transaction): bool
    {
        return $user->isAdmin();
    }
}
