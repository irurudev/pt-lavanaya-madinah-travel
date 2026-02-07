<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;

class StockSnapshotDTO extends Data
{
    public function __construct(
        public ?string $period = null,
    ) {}
}
