<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ProductRepository
{
    /**
     * Mendapatkan semua produk dengan relasi diurutkan dari yang terbaru
     */
    public function getAll(): Collection
    {
        return Product::with('category')->orderBy('id', 'desc')->get();
    }

    /**
     * Mendapatkan produk dengan pagination diurutkan dari yang terbaru
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Product::with('category')->orderBy('id', 'desc')->paginate($perPage);
    }

    /**
     * Mencari produk berdasarkan ID
     */
    public function findById(int $id): ?Product
    {
        return Product::with('category')->find($id);
    }

    /**
     * Mencari produk berdasarkan kategori diurutkan dari yang terbaru
     */
    public function findByCategory(int $categoryId): Collection
    {
        return Product::where('category_id', $categoryId)->orderBy('id', 'desc')->get();
    }

    /**
     * Mengecek apakah SKU sudah ada
     */
    public function existsBySku(string $sku): bool
    {
        return Product::where('sku', $sku)->exists();
    }

    /**
     * Mencari produk dengan stok rendah (di bawah min_stock) diurutkan dari yang terbaru
     */
    public function getLowStockProducts(): Collection
    {
        return Product::whereColumn('stock', '<=', 'min_stock')->orderBy('id', 'desc')->get();
    }

    /**
     * Membuat produk baru
     */
    public function create(array $data): Product
    {
        return Product::create($data);
    }

    /**
     * Mengupdate produk
     */
    public function update(Product $product, array $data): Product
    {
        $product->update($data);
        return $product;
    }

    /**
     * Mengupdate stok produk
     */
    public function updateStock(Product $product, int $quantity, bool $isInbound = true): Product
    {
        if ($isInbound) {
            $product->increment('stock', $quantity);
        } else {
            $product->decrement('stock', $quantity);
        }
        return $product->fresh();
    }

    /**
     * Menghapus produk
     */
    public function delete(Product $product): bool
    {
        return $product->delete();
    }

    /**
     * Menghapus produk secara permanent
     */
    public function forceDelete(Product $product): bool
    {
        return $product->forceDelete();
    }

    /**
     * Restore produk yang soft deleted
     */
    public function restore(Product $product): bool
    {
        return $product->restore();
    }
}
