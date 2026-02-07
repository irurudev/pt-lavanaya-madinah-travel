<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository
{
    /**
     * Mendapatkan semua kategori diurutkan dari yang terbaru
     */
    public function getAll(): Collection
    {
        return Category::orderBy('id', 'desc')->get();
    }

    /**
     * Mendapatkan kategori dengan pagination diurutkan dari yang terbaru
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Category::orderBy('id', 'desc')->paginate($perPage);
    }

    /**
     * Mencari kategori berdasarkan ID
     */
    public function findById(int $id): ?Category
    {
        return Category::find($id);
    }

    /**
     * Membuat kategori baru
     */
    public function create(array $data): Category
    {
        return Category::create($data);
    }

    /**
     * Mengupdate kategori
     */
    public function update(Category $category, array $data): Category
    {
        $category->update($data);
        return $category;
    }

    /**
     * Menghapus kategori
     */
    public function delete(Category $category): bool
    {
        return $category->delete();
    }

    /**
     * Menghapus kategori secara permanent
     */
    public function forceDelete(Category $category): bool
    {
        return $category->forceDelete();
    }

    /**
     * Restore kategori yang soft deleted
     */
    public function restore(Category $category): bool
    {
        return $category->restore();
    }
}
