<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;

class CategoryDTO extends Data
{
    public function __construct(
        public ?int $id = null,
        public string $name,
    ) {}
}
