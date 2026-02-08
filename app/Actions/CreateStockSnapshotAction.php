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
     * Jika forceUpdate true, hapus snapshot lama dan buat yang baru
     */
    public function execute(StockSnapshotDTO $dto, bool $forceUpdate = false): Collection
    {
        $period = $dto->period ?? now()->format('Y-m');

        // Cek apakah snapshot untuk periode ini sudah ada
        $existingCount = StockSnapshot::where('period', $period)->count();
        if ($existingCount > 0) {
            if (!$forceUpdate) {
                throw new \Exception("Snapshot untuk periode {$period} sudah ada. Apakah Anda ingin memperbarui data snapshot tersebut?");
            }
            
            // Hapus snapshot lama jika force update
            StockSnapshot::where('period', $period)->delete();
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
     * Get list periode snapshots yang sudah ada di database + periode bulan sekarang
     * User hanya bisa membuat snapshot untuk bulan sekarang (stok diambil dari kondisi saat ini)
     */
    public function getExistingPeriods(): array
    {
        // Ambil periode yang sudah ada di database
        $existingPeriods = StockSnapshot::distinct()
            ->pluck('period')
            ->toArray();

        // Tambahkan periode bulan sekarang
        $currentPeriod = now()->format('Y-m');
        if (!in_array($currentPeriod, $existingPeriods)) {
            $existingPeriods[] = $currentPeriod;
        }

        // Sort descending
        rsort($existingPeriods);

        return array_values($existingPeriods);
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
