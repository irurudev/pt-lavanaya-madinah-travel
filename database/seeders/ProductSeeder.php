<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Electronics
            [
                'category_id' => 1,
                'sku' => 'SKU-1001',
                'name' => 'Laptop Dell Inspiron',
                'stock' => 10,
                'min_stock' => 5,
                'buy_price' => 8500000.00,
                'sell_price' => 9500000.00,
                'unit_price' => 8500000.00,
            ],
            [
                'category_id' => 1,
                'sku' => 'SKU-1002',
                'name' => 'Mouse Wireless Logitech',
                'stock' => 50,
                'min_stock' => 20,
                'buy_price' => 250000.00,
                'sell_price' => 300000.00,
                'unit_price' => 250000.00,
            ],
            // Food & Beverages
            [
                'category_id' => 2,
                'sku' => 'SKU-2001',
                'name' => 'Coffee Arabica 1kg',
                'stock' => 100,
                'min_stock' => 30,
                'buy_price' => 150000.00,
                'sell_price' => 180000.00,
                'unit_price' => 150000.00,
            ],
            [
                'category_id' => 2,
                'sku' => 'SKU-2002',
                'name' => 'Tea Jasmine Box',
                'stock' => 75,
                'min_stock' => 25,
                'buy_price' => 75000.00,
                'sell_price' => 90000.00,
                'unit_price' => 75000.00,
            ],
            // Office Supplies
            [
                'category_id' => 3,
                'sku' => 'SKU-3001',
                'name' => 'A4 Paper Ream',
                'stock' => 200,
                'min_stock' => 100,
                'buy_price' => 50000.00,
                'sell_price' => 60000.00,
                'unit_price' => 50000.00,
            ],
            [
                'category_id' => 3,
                'sku' => 'SKU-3002',
                'name' => 'Ballpoint Pen Box',
                'stock' => 150,
                'min_stock' => 50,
                'buy_price' => 80000.00,
                'sell_price' => 95000.00,
                'unit_price' => 80000.00,
            ],
            // Furniture
            [
                'category_id' => 4,
                'sku' => 'SKU-4001',
                'name' => 'Office Chair Ergonomic',
                'stock' => 20,
                'min_stock' => 10,
                'buy_price' => 1500000.00,
                'sell_price' => 1750000.00,
                'unit_price' => 1500000.00,
            ],
            // Clothing
            [
                'category_id' => 5,
                'sku' => 'SKU-5001',
                'name' => 'T-Shirt Cotton L',
                'stock' => 80,
                'min_stock' => 30,
                'buy_price' => 75000.00,
                'sell_price' => 90000.00,
                'unit_price' => 75000.00,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
