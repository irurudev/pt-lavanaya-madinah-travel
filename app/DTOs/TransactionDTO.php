<?php

namespace App\DTOs;

use App\Enums\TransactionType;
use Spatie\LaravelData\Data;

class TransactionDTO extends Data
{
    public function __construct(
        public ?int $id = null,
        public int $product_id,
        public int $user_id,
        public TransactionType $type,
        public int $quantity,
        public string $reference_no,
        public string $price_at_transaction,
        public ?string $notes = null,
    ) {}
}
