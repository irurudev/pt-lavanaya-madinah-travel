<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Operator users
        User::firstOrCreate(
            ['email' => 'operator@example.com'],
            [
                'name' => 'Operator Gudang',
                'password' => Hash::make('password'),
                'role' => 'operator',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Viewer users
        User::firstOrCreate(
            ['email' => 'viewer@example.com'],
            [
                'name' => 'Viewer Only (Read-Only)',
                'password' => Hash::make('password'),
                'role' => 'viewer',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Additional test operators
        User::factory()
            ->operator()
            ->count(2)
            ->create();
    }
}
