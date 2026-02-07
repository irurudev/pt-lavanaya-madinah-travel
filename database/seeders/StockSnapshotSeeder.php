<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\StockSnapshot;
use Illuminate\Database\Seeder;

class StockSnapshotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create snapshots untuk 3 bulan terakhir
        $months = [
            now()->subMonths(2)->format('Y-m'),
            now()->subMonth()->format('Y-m'),
            now()->format('Y-m'),
        ];

        foreach ($months as $period) {
            $products = Product::all();

            foreach ($products as $product) {
                // Cek apakah snapshot sudah ada
                if (StockSnapshot::where('product_id', $product->id)
                    ->where('period', $period)
                    ->exists()) {
                    continue;
                }

                // Generate random closing stock (60-200% dari current stock)
                $closingStock = max(0, intval($product->stock * (0.6 + (rand(0, 100) / 100))));

                StockSnapshot::create([
                    'product_id' => $product->id,
                    'period' => $period,
                    'closing_stock' => $closingStock,
                ]);
            }
        }
    }
}
