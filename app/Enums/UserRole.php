<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Operator = 'operator';
    case Viewer = 'viewer';

    /**
     * Get label untuk UI
     */
    public function label(): string
    {
        return match($this) {
            self::Admin => 'Administrator',
            self::Operator => 'Operator Gudang',
            self::Viewer => 'Viewer Only',
        };
    }

    /**
     * Get badge color untuk UI
     */
    public function badgeColor(): string
    {
        return match($this) {
            self::Admin => 'red',
            self::Operator => 'blue',
            self::Viewer => 'gray',
        };
    }

    /**
     * Check jika role memiliki permission
     */
    public function hasPermission(string $permission): bool
    {
        return match($this) {
            self::Admin => true, // Admin bisa semua
            self::Operator => in_array($permission, [
                'view_reports', 'create_transactions', 'view_products',
                'view_categories', 'create_snapshots', 'delete_products',
                'edit_products_stock'
            ]),
            self::Viewer => in_array($permission, [
                'view_reports', 'view_products', 'view_categories'
            ]),
        };
    }
}
