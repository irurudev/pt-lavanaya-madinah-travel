<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\User;

class CategoryPolicy
{
    /**
     * Check apakah user bisa view categories
     * Viewer tidak bisa akses - hanya admin dan operator
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isOperator();
    }

    /**
     * Check apakah user bisa view category spesifik
     */
    public function view(User $user, Category $category): bool
    {
        return $user->hasPermission('view_categories');
    }

    /**
     * Check apakah user bisa membuat category (hanya admin)
     * Kategori adalah master data - hanya admin yang bisa mengelola
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Check apakah user bisa mengupdate category (hanya admin)
     * Kategori adalah master data - hanya admin yang bisa mengelola
     */
    public function update(User $user, Category $category): bool
    {
        return $user->isAdmin();
    }

    /**
     * Check apakah user bisa menghapus category (hanya admin)
     */
    public function delete(User $user, Category $category): bool
    {
        return $user->isAdmin();
    }

    /**
     * Check apakah user bisa restore deleted category (hanya admin)
     */
    public function restore(User $user, Category $category): bool
    {
        return $user->isAdmin();
    }

    /**
     * Check apakah user bisa force delete category (hanya admin)
     */
    public function forceDelete(User $user, Category $category): bool
    {
        return $user->isAdmin();
    }
}
