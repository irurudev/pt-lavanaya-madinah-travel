<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockSnapshot extends Model
{
    protected $fillable = [
        'product_id',
        'period',
        'closing_stock',
    ];

    protected $casts = [
        'closing_stock' => 'integer',
    ];

    /**
     * Relasi ke product - include soft deleted products
     * untuk menjaga snapshot history tetap utuh
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }
}
