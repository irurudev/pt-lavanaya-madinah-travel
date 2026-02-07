<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository
{
    /**
     * Dapatkan semua user dengan pagination.
     */
    public function paginate(int $perPage = 10): LengthAwarePaginator
    {
        return User::query()
            ->orderBy('id', 'desc')
            ->paginate($perPage);
    }

    /**
     * Dapatkan semua user tanpa pagination.
     */
    public function getAll(): array
    {
        return User::query()
            ->orderBy('id', 'desc')
            ->get()
            ->toArray();
    }

    /**
     * Cari user berdasarkan ID.
     */
    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    /**
     * Cari user berdasarkan email.
     */
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    /**
     * Create user baru.
     */
    public function create(array $data): User
    {
        return User::create($data);
    }

    /**
     * Update user.
     */
    public function update(User $user, array $data): User
    {
        $user->update($data);
        return $user->fresh();
    }

    /**
     * Toggle status user (activate/deactivate).
     */
    public function toggleStatus(User $user): User
    {
        $user->update(['is_active' => !$user->is_active]);
        return $user->fresh();
    }

    /**
     * Dapatkan user aktif saja.
     */
    public function getActiveUsers(): array
    {
        return User::where('is_active', true)
            ->orderBy('id', 'desc')
            ->get()
            ->toArray();
    }
}
