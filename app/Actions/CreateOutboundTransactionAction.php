<?php

namespace App\Actions;

use App\Enums\TransactionType;
use App\Models\Product;
use App\Models\Transaction;
use App\Repositories\ProductRepository;
use App\Repositories\TransactionRepository;
use Exception;
use Illuminate\Support\Facades\DB;

class CreateOutboundTransactionAction
{
    public function __construct(
        protected TransactionRepository $transactionRepository,
        protected ProductRepository $productRepository,
    ) {}

    /**
     * Membuat transaksi keluar dan update stok dengan validasi ketat
     * Menggunakan lockForUpdate untuk prevent race condition pada concurrent requests
     * Transaction atomicity dijaga - jika salah satu gagal, semua rollback
     * Reference No dan harga di-generate otomatis
     */
    public function execute(
        Product $product,
        int $userId,
        int $quantity,
        ?string $notes = null,
    ): Transaction {
        return DB::transaction(function () use (
            $product,
            $userId,
            $quantity,
            $notes,
        ) {
            // Lock product untuk concurrency control
            $lockedProduct = Product::lockForUpdate()->find($product->id);

            // Validasi stok tidak boleh minus
            if ($lockedProduct->stock < $quantity) {
                throw new Exception(
                    "Stok produk '{$lockedProduct->name}' tidak cukup. "
                    . "Stok tersedia: {$lockedProduct->stock}, Diminta: {$quantity}"
                );
            }

            // Auto-generate reference number dengan format OUT-YYYYMMDD-XXXX
            $referenceNo = $this->transactionRepository->generateReferenceNo(TransactionType::Out);
            
            // Gunakan harga jual dari produk
            $priceAtTransaction = $lockedProduct->sell_price;

            // Buat transaction record
            $transaction = $this->transactionRepository->create([
                'product_id' => $lockedProduct->id,
                'user_id' => $userId,
                'type' => TransactionType::Out,
                'quantity' => $quantity,
                'reference_no' => $referenceNo,
                'price_at_transaction' => $priceAtTransaction,
                'notes' => $notes,
            ]);

            // Update stok produk (decrement)
            $this->productRepository->updateStock($lockedProduct, $quantity, false);

            return $transaction;
        });
    }
}
