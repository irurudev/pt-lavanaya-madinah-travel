<?php

namespace Database\Seeders;

use App\Enums\TransactionType;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

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

        $now = now();

        foreach ($products as $index => $product) {
            // Outbound dibuat lebih dari 30 hari lalu agar masuk kategori slow/dead stock
            $outboundDate = $now->copy()->subDays(45 + $index);
            $outboundSequence = str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT);

            Transaction::create([
                'product_id' => $product->id,
                'user_id' => $user->id,
                'type' => TransactionType::Out,
                'quantity' => 2 + ($index % 4),
                'reference_no' => 'SJ-' . $outboundDate->format('Ym') . '-' . $outboundSequence,
                'price_at_transaction' => $product->buy_price ?? $product->unit_price,
                'notes' => 'Pengiriman ke pelanggan',
                'created_at' => $outboundDate,
            ]);

            // Inbound tetap ada dalam 30 hari terakhir untuk menjaga data transaksi tetap hidup
            $inboundDate = $now->copy()->subDays(5 + $index);
            $inboundSequence = str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT);

            Transaction::create([
                'product_id' => $product->id,
                'user_id' => $user->id,
                'type' => TransactionType::In,
                'quantity' => 12 + ($index % 6),
                'reference_no' => 'PO-' . $inboundDate->format('Ym') . '-' . $inboundSequence,
                'price_at_transaction' => $product->buy_price ?? $product->unit_price,
                'notes' => 'Pengadaan stok periodik',
                'created_at' => $inboundDate,
            ]);
        }
    }
}
