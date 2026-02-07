<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    /**
     * Check apakah user bisa view products
     * Viewer tidak bisa akses - hanya admin dan operator
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isOperator();
    }

    /**
     * Check apakah user bisa view product spesifik
     */
    public function view(User $user, Product $product): bool
    {
        return $user->hasPermission('view_products');
    }

    /**
     * Check apakah user bisa membuat product (admin/operator only)
     */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isOperator();
    }

    /**
     * Check apakah user bisa mengupdate product (admin/operator only)
     */
    public function update(User $user, Product $product): bool
    {
        return $user->isAdmin() || $user->isOperator();
    }

    /**
     * Check apakah user bisa menghapus product (hanya admin)
     */
    public function delete(User $user, Product $product): bool
    {
        return $user->isAdmin();
    }

    /**
     * Check apakah user bisa restore deleted product (hanya admin)
     */
    public function restore(User $user, Product $product): bool
    {
        return $user->isAdmin();
    }

    /**
     * Check apakah user bisa force delete product (hanya admin)
     */
    public function forceDelete(User $user, Product $product): bool
    {
        return $user->isAdmin();
    }
}
