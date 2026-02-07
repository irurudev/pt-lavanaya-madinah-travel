<?php

namespace App\Actions;

use App\DTOs\StockSnapshotDTO;
use App\Models\Product;
use App\Models\StockSnapshot;
use Illuminate\Database\Eloquent\Collection;

class CreateStockSnapshotAction
{
    /**
     * Buat stock snapshot untuk produk pada periode tertentu
     * Jika tidak ada period, gunakan periode bulan sekarang
     */
    public function execute(StockSnapshotDTO $dto): Collection
    {
        $period = $dto->period ?? now()->format('Y-m');

        // Cek apakah snapshot untuk periode ini sudah ada
        $existingCount = StockSnapshot::where('period', $period)->count();
        if ($existingCount > 0) {
            throw new \Exception("Snapshot untuk periode {$period} sudah ada");
        }

        $products = Product::all();

        foreach ($products as $product) {
            StockSnapshot::create([
                'product_id' => $product->id,
                'period' => $period,
                'closing_stock' => $product->stock,
            ]);
        }

        // Return snapshots yang baru dibuat dengan loading relationships diurutkan dari yang terbaru
        return StockSnapshot::with('product', 'product.category')
            ->where('period', $period)
            ->orderBy('id', 'desc')
            ->get();
    }

    /**
     * Buat snapshot untuk bulan terakhir (previous month)
     */
    public function executeForPreviousMonth(): Collection
    {
        $previousMonth = now()->subMonth()->format('Y-m');
        return $this->execute(new StockSnapshotDTO($previousMonth));
    }

    /**
     * Get list periode snapshots yang sudah ada
     */
    public function getExistingPeriods(): array
    {
        return array_values(
            StockSnapshot::distinct()
                ->pluck('period')
                ->sort()
                ->reverse()
                ->toArray()
        );
    }

    /**
     * Get snapshot data untuk periode tertentu diurutkan dari yang terbaru
     */
    public function getSnapshotsByPeriod(string $period): Collection
    {
        return StockSnapshot::with('product', 'product.category')
            ->where('period', $period)
            ->orderBy('id', 'desc')
            ->get();
    }
}
