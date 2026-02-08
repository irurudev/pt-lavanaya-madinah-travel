<?php

namespace App\Repositories;

use App\Enums\TransactionType;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ReportRepository
{
    /**
     * Mendapatkan laporan stok barang dengan detail diurutkan dari yang terbaru
     */
    public function getStockReport(int $perPage = 10): LengthAwarePaginator
    {
        $paginator = Product::with('category')
                ->select('products.id', 'products.sku', 'products.name', 'products.stock', 
                    'products.min_stock', 'products.buy_price', 'products.category_id', 'products.created_at')
            ->orderBy('products.id', 'desc')
            ->paginate($perPage);

        $paginator->getCollection()->transform(function ($product) {
            $product->is_low_stock = $product->stock <= $product->min_stock;
            return $product;
        });

        return $paginator;
    }

    /**
     * Mendapatkan laporan transaksi masuk & keluar dengan pagination
     */
    public function getTransactionReport(?string $type = null, ?int $perPage = 15, ?string $startDate = null, ?string $endDate = null): LengthAwarePaginator
    {
        $query = Transaction::with(['product', 'product.category', 'user'])
            ->select('transactions.id', 'transactions.product_id', 'transactions.user_id', 
                    'transactions.type', 'transactions.quantity', 'transactions.reference_no',
                    'transactions.price_at_transaction', 'transactions.notes', 'transactions.created_at');

        if ($type) {
            $query->where('type', $type);
        }

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Mendapatkan laporan transaksi masuk
     */
    public function getInboundReport(?int $perPage = 15, ?string $startDate = null, ?string $endDate = null): LengthAwarePaginator
    {
        return $this->getTransactionReport(TransactionType::In->value, $perPage, $startDate, $endDate);
    }

    /**
     * Mendapatkan laporan transaksi keluar
     */
    public function getOutboundReport(?int $perPage = 15, ?string $startDate = null, ?string $endDate = null): LengthAwarePaginator
    {
        return $this->getTransactionReport(TransactionType::Out->value, $perPage, $startDate, $endDate);
    }

    /**
     * Mendapatkan ringkasan stok (total stok, jumlah produk, produk low stock, dll)
     */
    public function getStockSummary(): array
    {
        $totalProducts = Product::where('deleted_at', null)->count();
        $lowStockProducts = Product::whereColumn('stock', '<=', 'min_stock')->count();
        $totalStockValue = Product::select(DB::raw('SUM(stock * buy_price) as total'))
            ->first()
            ->total ?? 0;

        return [
            'total_products' => $totalProducts,
            'low_stock_count' => $lowStockProducts,
            'total_stock_value' => (float) $totalStockValue,
        ];
    }

    /**
     * Mendapatkan ringkasan transaksi per bulan
     */
    public function getTransactionSummary(?string $startDate = null, ?string $endDate = null): array
    {
        $inboundQuery = Transaction::where('type', TransactionType::In->value);
        $outboundQuery = Transaction::where('type', TransactionType::Out->value);

        if ($startDate) {
            $inboundQuery->whereDate('created_at', '>=', $startDate);
            $outboundQuery->whereDate('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $inboundQuery->whereDate('created_at', '<=', $endDate);
            $outboundQuery->whereDate('created_at', '<=', $endDate);
        }

        $inboundTotal = $inboundQuery->sum('quantity');
        $outboundTotal = $outboundQuery->sum('quantity');

        return [
            'inbound_total' => $inboundTotal,
            'outbound_total' => $outboundTotal,
        ];
    }
}
