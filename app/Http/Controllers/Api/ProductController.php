<?php

namespace App\Http\Controllers\Api;

use App\DTOs\ProductDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService,
    ) {}

    /**
     * Menampilkan daftar semua produk
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 10);
        $perPage = $perPage > 0 ? $perPage : 10;

        $products = $this->productService->getPaginatedProducts($perPage);

        return response()->json([
            'data' => ProductResource::collection($products->items()),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    /**
     * Menyimpan produk baru
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $dto = ProductDTO::from($request->validated());
        $product = $this->productService->createProduct($dto);

        return response()->json([
            'message' => 'Produk berhasil dibuat',
            'data' => new ProductResource($product),
        ], Response::HTTP_CREATED);
    }

    /**
     * Menampilkan detail produk spesifik
     */
    public function show(Product $product): JsonResponse
    {
        $this->authorize('view', $product);

        return response()->json([
            'data' => new ProductResource($product->load('category')),
        ]);
    }

    /**
     * Mengupdate produk
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $this->authorize('update', $product);

        $dto = ProductDTO::from($request->validated());
        $updated = $this->productService->updateProduct($product, $dto);

        return response()->json([
            'message' => 'Produk berhasil diperbarui',
            'data' => new ProductResource($updated),
        ]);
    }

    /**
     * Menghapus produk
     */
    public function destroy(Product $product): JsonResponse
    {
        $this->authorize('delete', $product);

        $this->productService->deleteProduct($product);

        return response()->json([
            'message' => 'Produk berhasil dihapus',
        ]);
    }

    /**
     * Mendapatkan produk dengan stok rendah
     */
    public function lowStock(): JsonResponse
    {
        $products = $this->productService->getLowStockProducts();
        return response()->json([
            'data' => ProductResource::collection($products),
        ]);
    }
}
