<?php

namespace Database\Seeders;

use App\Enums\TransactionType;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        if (!$user) {
            return;
        }
        $products = Product::all();
        if ($products->isEmpty()) {
            return;
        }

        $dates = [
            Carbon::create(2025, 12, 1, 9, 0, 0),
            Carbon::create(2025, 12, 3, 14, 30, 0),
            Carbon::create(2025, 12, 5, 10, 15, 0),
            Carbon::create(2025, 12, 8, 16, 45, 0),
            Carbon::create(2025, 12, 11, 11, 0, 0),
            Carbon::create(2025, 12, 14, 15, 10, 0),
            Carbon::create(2025, 12, 18, 9, 20, 0),
            Carbon::create(2025, 12, 22, 13, 50, 0),
            Carbon::create(2025, 12, 27, 10, 5, 0),
            Carbon::create(2025, 12, 30, 17, 25, 0),
            Carbon::create(2026, 1, 2, 9, 0, 0),
            Carbon::create(2026, 1, 6, 14, 40, 0),
            Carbon::create(2026, 1, 9, 10, 25, 0),
            Carbon::create(2026, 1, 12, 16, 15, 0),
            Carbon::create(2026, 1, 16, 11, 35, 0),
            Carbon::create(2026, 1, 20, 15, 5, 0),
            Carbon::create(2026, 2, 3, 9, 10, 0),
            Carbon::create(2026, 2, 7, 13, 45, 0),
            Carbon::create(2026, 2, 12, 10, 30, 0),
            Carbon::create(2026, 2, 20, 16, 0, 0),
        ];

        foreach ($dates as $index => $date) {
            $product = $products[$index % $products->count()];
            $type = $index % 2 === 0 ? TransactionType::In : TransactionType::Out;
            $prefix = $type === TransactionType::In ? 'PO' : 'SJ';
            $sequence = str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT);

            Transaction::create([
                'product_id' => $product->id,
                'user_id' => $user->id,
                'type' => $type,
                'quantity' => $type === TransactionType::In ? 10 + $index : 2 + ($index % 5),
                'reference_no' => $prefix . '-' . $date->format('Ym') . '-' . $sequence,
                'price_at_transaction' => $product->buy_price ?? $product->unit_price,
                'notes' => $type === TransactionType::In ? 'Pengadaan stok periodik' : 'Pengiriman ke pelanggan',
                'created_at' => $date,
            ]);
        }
    }
}
