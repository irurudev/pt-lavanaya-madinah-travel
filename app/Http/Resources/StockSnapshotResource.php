<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource untuk stock snapshot data
 */
class StockSnapshotResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'period' => $this->period,
            'closing_stock' => $this->closing_stock,
            'product' => [
                'id' => $this->product?->id,
                'sku' => $this->product?->sku,
                'name' => $this->product?->name,
                'buy_price' => (float) $this->product?->buy_price,
            ],
            'category' => [
                'id' => $this->product?->category?->id,
                'name' => $this->product?->category?->name,
            ],
            'snapshot_value' => (float) ($this->closing_stock * $this->product?->buy_price),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
