<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource untuk laporan transaksi (masuk & keluar)
 */
class TransactionReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type->value,
            'type_label' => $this->type === 'in' ? 'Masuk' : 'Keluar',
            'product' => [
                'id' => $this->product?->id,
                'sku' => $this->product?->sku,
                'name' => $this->product?->name,
                'category' => $this->product?->category?->name,
            ],
            'quantity' => $this->quantity,
            'price_at_transaction' => (float) $this->price_at_transaction,
            'total_value' => (float) ($this->quantity * $this->price_at_transaction),
            'reference_no' => $this->reference_no,
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'email' => $this->user?->email,
            ],
            'notes' => $this->notes,
            'created_at' => $this->created_at,
        ];
    }
}
