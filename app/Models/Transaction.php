<?php

namespace App\Models;

use App\Enums\TransactionType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'product_id',
        'user_id',
        'type',
        'quantity',
        'reference_no',
        'price_at_transaction',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price_at_transaction' => 'decimal:2',
        'type' => TransactionType::class,
    ];

    /**
     * Relasi ke product - include soft deleted products
     * untuk menjaga data transaksi tetap utuh
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }

    /**
     * Relasi ke user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Cek apakah ini transaksi masuk
     */
    public function isInbound(): bool
    {
        return $this->type === TransactionType::In;
    }

    /**
     * Cek apakah ini transaksi keluar
     */
    public function isOutbound(): bool
    {
        return $this->type === TransactionType::Out;
    }
}
