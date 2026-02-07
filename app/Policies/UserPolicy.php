<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Hanya admin yang bisa view semua user.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Hanya admin yang bisa view user detail.
     */
    public function view(User $user, User $model): bool
    {
        return $user->isAdmin();
    }

    /**
     * Hanya admin yang bisa create user.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Hanya admin yang bisa update user.
     */
    public function update(User $user, User $model): bool
    {
        return $user->isAdmin();
    }

    /**
     * Delete tidak boleh, hanya deactivate saja.
     */
    public function delete(User $user, User $model): bool
    {
        return false;
    }

    /**
     * Toggle status - hanya admin, tapi tidak bisa toggle admin user.
     */
    public function toggleStatus(User $user, User $model): bool
    {
        // Admin user tidak bisa di-toggle statusnya
        if ($model->isAdmin()) {
            return false;
        }

        return $user->isAdmin();
    }
}
