<?php

namespace App\Actions;

use App\Enums\TransactionType;
use App\Models\Product;
use App\Models\Transaction;
use App\Repositories\ProductRepository;
use App\Repositories\TransactionRepository;
use Illuminate\Support\Facades\DB;

class CreateInboundTransactionAction
{
    public function __construct(
        protected TransactionRepository $transactionRepository,
        protected ProductRepository $productRepository,
    ) {}

    /**
     * Membuat transaksi masuk dan update stok
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
            // Auto-generate reference number dengan format IN-YYYYMMDD-XXXX
            $referenceNo = $this->transactionRepository->generateReferenceNo(TransactionType::In);
            
            // Gunakan harga beli dari produk
            $priceAtTransaction = $product->buy_price;

            // Buat transaction record
            $transaction = $this->transactionRepository->create([
                'product_id' => $product->id,
                'user_id' => $userId,
                'type' => TransactionType::In,
                'quantity' => $quantity,
                'reference_no' => $referenceNo,
                'price_at_transaction' => $priceAtTransaction,
                'notes' => $notes,
            ]);

            // Update stok produk (increment)
            $this->productRepository->updateStock($product, $quantity, true);

            return $transaction;
        });
    }
}
