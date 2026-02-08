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

    /**
     * Mendapatkan financial metrics dashboard
     */
    public function getFinancialMetrics(): array
    {
        $products = Product::query()->get();
        
        $totalInventoryValue = $products->sum(fn($p) => $p->stock * ($p->buy_price ?? 0));
        $potentialRevenue = $products->sum(fn($p) => $p->stock * ($p->sell_price ?? 0));
        $totalPotentialProfit = $products->sum(fn($p) => $p->stock * (($p->sell_price ?? 0) - ($p->buy_price ?? 0)));
        
        // Transaction values last 30 days
        $thirtyDaysAgo = now()->subDays(30);
        $inboundValue = Transaction::where('type', TransactionType::In->value)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->sum(DB::raw('quantity * price_at_transaction'));
        $outboundValue = Transaction::where('type', TransactionType::Out->value)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->sum(DB::raw('quantity * price_at_transaction'));
        
        $averageTransactionValue = Transaction::where('created_at', '>=', $thirtyDaysAgo)
            ->count() > 0 
            ? (($inboundValue + $outboundValue) / Transaction::where('created_at', '>=', $thirtyDaysAgo)->count())
            : 0;

        return [
            'total_inventory_value' => (float) $totalInventoryValue,
            'potential_revenue' => (float) $potentialRevenue,
            'potential_gross_profit' => (float) $totalPotentialProfit,
            'inbound_value_30days' => (float) $inboundValue,
            'outbound_value_30days' => (float) $outboundValue,
            'average_transaction_value' => (float) $averageTransactionValue,
        ];
    }

    /**
     * Mendapatkan fast moving products (top outbound 30 hari)
     */
    public function getFastMovers(int $limit = 10): array
    {
        $thirtyDaysAgo = now()->subDays(30);
        
        return Transaction::where('type', TransactionType::Out->value)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->with('product.category')
            ->select('product_id', DB::raw('SUM(quantity) as total_outbound'), DB::raw('COUNT(*) as transaction_count'))
            ->groupBy('product_id')
            ->orderByDesc('total_outbound')
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->product_id,
                    'sku' => $item->product->sku,
                    'name' => $item->product->name,
                    'category' => $item->product->category->name ?? 'N/A',
                    'total_outbound' => $item->total_outbound,
                    'transaction_count' => $item->transaction_count,
                    'current_stock' => $item->product->stock,
                    'stock_value' => $item->product->stock * ($item->product->buy_price ?? 0),
                ];
            })
            ->toArray();
    }

    /**
     * Mendapatkan slow/dead stock products (no outbound >30 hari)
     */
    public function getSlowMovers(int $limit = 10): array
    {
        $thirtyDaysAgo = now()->subDays(30);
        
        $productsWithOutbound = Transaction::where('type', TransactionType::Out->value)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->pluck('product_id')
            ->unique();
        
        return Product::whereNotIn('id', $productsWithOutbound)
            ->with('category')
            ->select('id', 'sku', 'name', 'stock', 'buy_price', 'category_id', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($product) {
                $lastOutbound = Transaction::where('product_id', $product->id)
                    ->where('type', TransactionType::Out->value)
                    ->latest()
                    ->first();
                
                return [
                    'id' => $product->id,
                    'sku' => $product->sku,
                    'name' => $product->name,
                    'category' => $product->category->name ?? 'N/A',
                    'current_stock' => $product->stock,
                    'stock_value' => $product->stock * ($product->buy_price ?? 0),
                    'days_no_movement' => $lastOutbound ? $lastOutbound->created_at->diffInDays(now()) : 999,
                    'last_outbound_date' => $lastOutbound?->created_at,
                ];
            })
            ->toArray();
    }

    /**
     * Mendapatkan transaction trend data (last 30 days, grouped by day)
     */
    public function getTransactionTrends(): array
    {
        $thirtyDaysAgo = now()->subDays(30)->startOfDay();
        
        $data = Transaction::where('created_at', '>=', $thirtyDaysAgo)
            ->select(
                DB::raw('DATE(created_at) as date'),
                'type',
                DB::raw('SUM(quantity) as total_quantity')
            )
            ->groupBy('date', 'type')
            ->orderBy('date')
            ->get();
        
        $trends = [];
        for ($i = 30; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $inbound = $data->where('date', $date)->where('type', TransactionType::In->value)->first();
            $outbound = $data->where('date', $date)->where('type', TransactionType::Out->value)->first();
            
            $trends[] = [
                'date' => $date,
                'inbound' => $inbound?->total_quantity ?? 0,
                'outbound' => $outbound?->total_quantity ?? 0,
            ];
        }
        
        return $trends;
    }

    /**
     * Mendapatkan critical alerts untuk dashboard
     */
    public function getCriticalAlerts(): array
    {
        $alerts = [];
        
        // 1. Produk dengan stok kritis (< 20% min_stock)
        $criticalStocks = Product::where(DB::raw('stock < (min_stock * 0.2)'))
            ->orWhere('stock', 0)
            ->with('category')
            ->select('id', 'sku', 'name', 'stock', 'min_stock', 'category_id')
            ->get();
        
        foreach ($criticalStocks as $product) {
            $alerts[] = [
                'id' => 'stock_critical_' . $product->id,
                'type' => 'critical_stock',
                'severity' => $product->stock == 0 ? 'danger' : 'warning',
                'title' => $product->stock == 0 ? 'Stok Habis' : 'Stok Kritis',
                'message' => "{$product->name} (SKU: {$product->sku}) - Stok: {$product->stock} unit",
                'product_id' => $product->id,
                'product_name' => $product->name,
                'current_stock' => $product->stock,
                'min_stock' => $product->min_stock,
            ];
        }
        
        // 2. Overstock items (> 200% average stock)
        $averageStock = Product::avg('stock');
        $overstockItems = Product::where('stock', '>', $averageStock * 2)
            ->with('category')
            ->select('id', 'sku', 'name', 'stock', 'category_id')
            ->limit(5)
            ->get();
        
        foreach ($overstockItems as $product) {
            $alerts[] = [
                'id' => 'overstock_' . $product->id,
                'type' => 'overstock',
                'severity' => 'info',
                'title' => 'Overstock Terdeteksi',
                'message' => "{$product->name} (SKU: {$product->sku}) - Stok: {$product->stock} unit",
                'product_id' => $product->id,
                'product_name' => $product->name,
                'current_stock' => $product->stock,
            ];
        }
        
        // 3. Zero movement products (no transaction 60+ days)
        $sixtyDaysAgo = now()->subDays(60);
        $zeroMovement = Product::whereNotIn('id', 
                Transaction::where('created_at', '>=', $sixtyDaysAgo)->pluck('product_id')
            )
            ->with('category')
            ->select('id', 'sku', 'name', 'stock', 'category_id')
            ->limit(5)
            ->get();
        
        foreach ($zeroMovement as $product) {
            $lastTx = Transaction::where('product_id', $product->id)->latest()->first();
            $alerts[] = [
                'id' => 'zero_movement_' . $product->id,
                'type' => 'zero_movement',
                'severity' => 'warning',
                'title' => 'No Movement 60+ Days',
                'message' => "{$product->name} (SKU: {$product->sku}) - Last transaction: {$lastTx?->created_at?->diffForHumans()}",
                'product_id' => $product->id,
                'product_name' => $product->name,
                'days_no_movement' => $lastTx ? $lastTx->created_at->diffInDays(now()) : 999,
            ];
        }
        
        // 4. Negative margin risk (sell_price < buy_price)
        $negativeMargin = Product::whereRaw('sell_price < buy_price')
            ->with('category')
            ->select('id', 'sku', 'name', 'buy_price', 'sell_price', 'category_id')
            ->get();
        
        foreach ($negativeMargin as $product) {
            $alerts[] = [
                'id' => 'negative_margin_' . $product->id,
                'type' => 'negative_margin',
                'severity' => 'danger',
                'title' => 'Negative Margin Risk',
                'message' => "{$product->name} - Buy: " . number_format($product->buy_price, 2) . ", Sell: " . number_format($product->sell_price, 2),
                'product_id' => $product->id,
                'product_name' => $product->name,
                'buy_price' => $product->buy_price,
                'sell_price' => $product->sell_price,
            ];
        }
        
        // Sort by severity: danger > warning > info
        usort($alerts, function ($a, $b) {
            $severityOrder = ['danger' => 0, 'warning' => 1, 'info' => 2];
            return $severityOrder[$a['severity']] <=> $severityOrder[$b['severity']];
        });
        
        return array_slice($alerts, 0, 10); // Return top 10 alerts
    }

    /**
     * Mendapatkan category performance analysis
     */
    public function getCategoryPerformance(): array
    {
        $thirtyDaysAgo = now()->subDays(30);
        
        return Product::with('category')
            ->select(
                'category_id',
                DB::raw('COUNT(DISTINCT id) as total_products'),
                DB::raw('SUM(stock) as total_stock'),
                DB::raw('SUM(stock * buy_price) as total_value'),
                DB::raw('SUM(stock * sell_price) as potential_revenue')
            )
            ->groupBy('category_id')
            ->orderByDesc('total_value')
            ->get()
            ->map(function ($product) use ($thirtyDaysAgo) {
                $categoryId = $product->category_id;
                $transactionData = Transaction::where('created_at', '>=', $thirtyDaysAgo)
                    ->whereHas('product', fn($q) => $q->where('category_id', $categoryId))
                    ->select(
                        'type',
                        DB::raw('SUM(quantity) as qty')
                    )
                    ->groupBy('type')
                    ->get();
                
                $inboundQty = $transactionData->where('type', TransactionType::In->value)->first()?->qty ?? 0;
                $outboundQty = $transactionData->where('type', TransactionType::Out->value)->first()?->qty ?? 0;
                $lowStockCount = Product::where('category_id', $categoryId)
                    ->whereColumn('stock', '<=', 'min_stock')
                    ->count();
                
                return [
                    'category_id' => $categoryId,
                    'category_name' => $product->category->name,
                    'total_products' => $product->total_products,
                    'total_stock' => $product->total_stock,
                    'total_value' => (float) $product->total_value,
                    'potential_revenue' => (float) $product->potential_revenue,
                    'inbound_30days' => $inboundQty,
                    'outbound_30days' => $outboundQty,
                    'low_stock_count' => $lowStockCount,
                ];
            })
            ->toArray();
    }

    /**
     * Mendapatkan operational statistics
     */
    public function getOperationalStats(): array
    {
        $thirtyDaysAgo = now()->subDays(30);
        
        // Total transactions last 30 days
        $totalTransactions = Transaction::where('created_at', '>=', $thirtyDaysAgo)->count();
        $totalInbound = Transaction::where('type', TransactionType::In->value)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->count();
        $totalOutbound = Transaction::where('type', TransactionType::Out->value)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->count();
        
        // Most active operators
        $topOperators = Transaction::where('created_at', '>=', $thirtyDaysAgo)
            ->select('user_id', DB::raw('COUNT(*) as transaction_count'))
            ->groupBy('user_id')
            ->orderByDesc('transaction_count')
            ->limit(5)
            ->with('user:id,name')
            ->get();
        
        // Stock turnover rate per product
        $stockTurnoverData = Product::select('id', 'sku', 'name', 'stock', 'buy_price')
            ->with(['transactions' => function($q) use ($thirtyDaysAgo) {
                $q->where('type', TransactionType::Out->value)
                    ->where('created_at', '>=', $thirtyDaysAgo);
            }])
            ->get()
            ->map(function ($product) {
                $totalOutbound = $product->transactions->sum('quantity');
                $avgStock = $product->stock;
                $recordedTransactionQty = Transaction::where('product_id', $product->id)
                    ->sum('quantity'); // Sum dari semua
                
                $turnoverRate = $avgStock > 0 
                    ? round(($totalOutbound / $avgStock) * 100, 2)
                    : 0;
                
                return [
                    'id' => $product->id,
                    'sku' => $product->sku,
                    'name' => $product->name,
                    'outbound_30days' => $totalOutbound,
                    'avg_stock' => $avgStock,
                    'turnover_rate' => $turnoverRate . '%',
                ];
            })
            ->sortByDesc('outbound_30days')
            ->take(10)
            ->values()
            ->toArray();

        return [
            'total_transactions_30days' => $totalTransactions,
            'inbound_transactions_30days' => $totalInbound,
            'outbound_transactions_30days' => $totalOutbound,
            'avg_transactions_per_day' => $totalTransactions > 0 ? round($totalTransactions / 30, 2) : 0,
            'top_operators' => $topOperators->map(fn($op) => [
                'user_id' => $op->user_id,
                'operator_name' => $op->user->name ?? 'N/A',
                'transaction_count' => $op->transaction_count,
            ])->toArray(),
            'stock_turnover_top' => $stockTurnoverData,
        ];
    }
}
