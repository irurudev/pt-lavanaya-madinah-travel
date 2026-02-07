<?php

namespace App\Http\Controllers\Api;

use App\DTOs\CategoryDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService,
    ) {}

    /**
     * Menampilkan daftar semua kategori
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 10);
        $perPage = $perPage > 0 ? $perPage : 10;

        $categories = $this->categoryService->getPaginatedCategories($perPage);

        return response()->json([
            'data' => CategoryResource::collection($categories->items()),
            'pagination' => [
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
            ],
        ]);
    }

    /**
     * Menyimpan kategori baru
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $dto = CategoryDTO::from($request->validated());
        $category = $this->categoryService->createCategory($dto);

        return response()->json([
            'message' => 'Kategori berhasil dibuat',
            'data' => new CategoryResource($category),
        ], Response::HTTP_CREATED);
    }

    /**
     * Menampilkan detail kategori spesifik
     */
    public function show(Category $category): JsonResponse
    {
        $this->authorize('view', $category);

        return response()->json([
            'data' => new CategoryResource($category),
        ]);
    }

    /**
     * Mengupdate kategori
     */
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $this->authorize('update', $category);

        $dto = CategoryDTO::from($request->validated());
        $updated = $this->categoryService->updateCategory($category, $dto);

        return response()->json([
            'message' => 'Kategori berhasil diperbarui',
            'data' => new CategoryResource($updated),
        ]);
    }

    /**
     * Menghapus kategori
     */
    public function destroy(Category $category): JsonResponse
    {
        $this->authorize('delete', $category);

        $this->categoryService->deleteCategory($category);

        return response()->json([
            'message' => 'Kategori berhasil dihapus',
        ]);
    }
}
