<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'user_id' => $this->user_id,
            'type' => $this->type,
            'type_label' => $this->type?->label(),
            'type_color' => $this->type?->color(),
            'quantity' => $this->quantity,
            'reference_no' => $this->reference_no,
            'price_at_transaction' => $this->price_at_transaction,
            'notes' => $this->notes,
            'product' => new ProductResource($this->whenLoaded('product')),
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'email' => $this->user?->email,
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
