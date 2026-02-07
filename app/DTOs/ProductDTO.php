<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;

class ProductDTO extends Data
{
    public function __construct(
        public ?int $id = null,
        public int $category_id,
        public ?string $sku = null,
        public string $name,
        public int $min_stock,
        public string $buy_price,
        public string $sell_price,
        public int $stock = 0,
    ) {}
}
