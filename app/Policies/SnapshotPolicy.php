<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\StockSnapshot;
use App\Models\User;

class SnapshotPolicy
{
    /**
     * Check apakah user bisa view snapshots (semua authenticated user)
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view_products');
    }

    /**
     * Check apakah user bisa view snapshot spesifik
     */
    public function view(User $user, StockSnapshot $snapshot): bool
    {
        return $user->hasPermission('view_products');
    }

    /**
     * Check apakah user bisa membuat snapshot (operator/admin only)
     */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isOperator();
    }

    /**
     * Check apakah user bisa menghapus snapshot (hanya admin)
     */
    public function delete(User $user, StockSnapshot $snapshot): bool
    {
        return $user->isAdmin();
    }

    /**
     * Check apakah user bisa restore deleted snapshot (hanya admin)
     */
    public function restore(User $user, StockSnapshot $snapshot): bool
    {
        return $user->isAdmin();
    }

    /**
     * Check apakah user bisa force delete snapshot (hanya admin)
     */
    public function forceDelete(User $user, StockSnapshot $snapshot): bool
    {
        return $user->isAdmin();
    }
}
