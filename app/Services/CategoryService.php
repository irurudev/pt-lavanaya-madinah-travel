<?php

namespace App\Services;

use App\DTOs\CategoryDTO;
use App\Models\Category;
use App\Repositories\CategoryRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    public function __construct(
        protected CategoryRepository $categoryRepository,
    ) {}

    /**
     * Mendapatkan semua kategori
     */
    public function getAllCategories(): Collection
    {
        return $this->categoryRepository->getAll();
    }

    /**
     * Mendapatkan kategori dengan pagination
     */
    public function getPaginatedCategories(int $perPage = 10): LengthAwarePaginator
    {
        return $this->categoryRepository->paginate($perPage);
    }

    /**
     * Mencari kategori berdasarkan ID
     */
    public function getCategoryById(int $id): ?Category
    {
        return $this->categoryRepository->findById($id);
    }

    /**
     * Membuat kategori baru
     */
    public function createCategory(CategoryDTO $dto): Category
    {
        return $this->categoryRepository->create([
            'name' => $dto->name,
        ]);
    }

    /**
     * Mengupdate kategori
     */
    public function updateCategory(Category $category, CategoryDTO $dto): Category
    {
        return $this->categoryRepository->update($category, [
            'name' => $dto->name,
        ]);
    }

    /**
     * Menghapus kategori
     */
    public function deleteCategory(Category $category): bool
    {
        return $this->categoryRepository->delete($category);
    }
}
