<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class UserService
{
    public function __construct(private UserRepository $userRepository)
    {
    }

    /**
     * Dapatkan semua user dengan pagination.
     */
    public function getUsersPaginated(int $perPage = 10): LengthAwarePaginator
    {
        return $this->userRepository->paginate($perPage);
    }

    /**
     * Dapatkan semua user.
     */
    public function getAllUsers(): array
    {
        return $this->userRepository->getAll();
    }

    /**
     * Dapatkan user berdasarkan ID.
     */
    public function getUserById(int $id): ?User
    {
        return $this->userRepository->findById($id);
    }

    /**
     * Buat user baru.
     */
    public function createUser(array $data): User
    {
        return $this->userRepository->create($data);
    }

    /**
     * Update user.
     */
    public function updateUser(User $user, array $data): User
    {
        // Jika password dikosongkan pada update, jangan update password
        if (isset($data['password']) && empty($data['password'])) {
            unset($data['password']);
        }

        return $this->userRepository->update($user, $data);
    }

    /**
     * Deactivate user (jangan delete, hanya deactivate).
     */
    public function deactivateUser(User $user): User
    {
        return $this->userRepository->toggleStatus($user);
    }

    /**
     * Aktivasi kembali user yang sudah di-deactivate.
     */
    public function reactivateUser(User $user): User
    {
        return $this->userRepository->update($user, ['is_active' => true]);
    }
}
