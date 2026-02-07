<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource untuk laporan stok barang
 */
class StockReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'name' => $this->name,
            'stock' => $this->stock,
            'min_stock' => $this->min_stock,
            'is_low_stock' => $this->is_low_stock,
            'buy_price' => (float) $this->buy_price,
            'stock_value' => (float) ($this->stock * $this->buy_price),
            'category' => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
            ],
            'created_at' => $this->created_at,
        ];
    }
}
