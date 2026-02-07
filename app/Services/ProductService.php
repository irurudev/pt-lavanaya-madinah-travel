<?php

namespace App\Services;

use App\DTOs\ProductDTO;
use App\Models\Product;
use App\Repositories\ProductRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class ProductService
{
    public function __construct(
        protected ProductRepository $productRepository,
    ) {}

    /**
     * Mendapatkan semua produk
     */
    public function getAllProducts(): Collection
    {
        return $this->productRepository->getAll();
    }

    /**
     * Mendapatkan produk dengan pagination
     */
    public function getPaginatedProducts(int $perPage = 10): LengthAwarePaginator
    {
        return $this->productRepository->paginate($perPage);
    }

    /**
     * Mencari produk berdasarkan ID
     */
    public function getProductById(int $id): ?Product
    {
        return $this->productRepository->findById($id);
    }

    /**
     * Mendapatkan produk dengan stok rendah
     */
    public function getLowStockProducts(): Collection
    {
        return $this->productRepository->getLowStockProducts();
    }

    /**
     * Membuat produk baru
     */
    public function createProduct(ProductDTO $dto): Product
    {
        $sku = $this->generateSku();

        return $this->productRepository->create([
            'category_id' => $dto->category_id,
            'sku' => $sku,
            'name' => $dto->name,
            'stock' => 0,
            'min_stock' => $dto->min_stock,
            'buy_price' => $dto->buy_price,
            'sell_price' => $dto->sell_price,
            'unit_price' => $dto->buy_price,
        ]);
    }

    /**
     * Mengupdate produk
     */
    public function updateProduct(Product $product, ProductDTO $dto): Product
    {
        return $this->productRepository->update($product, [
            'category_id' => $dto->category_id,
            'name' => $dto->name,
            'min_stock' => $dto->min_stock,
            'buy_price' => $dto->buy_price,
            'sell_price' => $dto->sell_price,
            'unit_price' => $dto->buy_price,
        ]);
    }

    /**
     * Generate SKU unik untuk produk baru
     */
    private function generateSku(): string
    {
        $date = now()->format('Ymd');

        do {
            $random = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
            $sku = Str::upper("SKU-{$date}-{$random}");
        } while ($this->productRepository->existsBySku($sku));

        return $sku;
    }

    /**
     * Menghapus produk
     */
    public function deleteProduct(Product $product): bool
    {
        return $this->productRepository->delete($product);
    }
}
