<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService,
    ) {}

    /**
     * Menampilkan daftar semua user
     */
    public function index(Request $request): JsonResponse
    {
        // Otorisasi hanya admin
        $this->authorize('viewAny', User::class);

        $perPage = (int) $request->query('per_page', 10);
        $perPage = $perPage > 0 ? $perPage : 10;

        $users = $this->userService->getUsersPaginated($perPage);

        return response()->json([
            'data' => UserResource::collection($users->items()),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    /**
     * Menyimpan user baru
     */
    public function store(UserRequest $request): JsonResponse
    {
        $data = $request->validated();
        $user = $this->userService->createUser($data);

        return response()->json([
            'message' => 'User berhasil dibuat',
            'data' => new UserResource($user),
        ], Response::HTTP_CREATED);
    }

    /**
     * Menampilkan detail user spesifik
     */
    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);

        return response()->json([
            'data' => new UserResource($user),
        ]);
    }

    /**
     * Mengupdate user
     */
    public function update(UserRequest $request, User $user): JsonResponse
    {
        $this->authorize('update', $user);

        $data = $request->validated();

        // Cek jika mencoba menonaktifkan admin user
        if ($user->isAdmin() && isset($data['is_active']) && ! $data['is_active']) {
            return response()->json([
                'message' => 'User admin tidak dapat dinonaktifkan',
            ], 403);
        }

        $updated = $this->userService->updateUser($user, $data);

        return response()->json([
            'message' => 'User berhasil diperbarui',
            'data' => new UserResource($updated),
        ]);
    }

    /**
     * Toggle status user (activate/deactivate) - tidak ada delete
     */
    public function toggleStatus(User $user): JsonResponse
    {
        // Cek jika mencoba toggle admin user
        if ($user->isAdmin()) {
            return response()->json([
                'message' => 'User admin tidak dapat dinonaktifkan',
            ], 403);
        }

        $this->authorize('toggleStatus', $user);

        $updated = $this->userService->deactivateUser($user);

        $status = $updated->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return response()->json([
            'message' => "User berhasil $status",
            'data' => new UserResource($updated),
        ]);
    }
}
