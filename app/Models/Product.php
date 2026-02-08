<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'sku',
        'name',
        'stock',
        'min_stock',
        'buy_price',
        'sell_price',
        'unit_price',
    ];

    protected $casts = [
        'stock' => 'integer',
        'min_stock' => 'integer',
        'buy_price' => 'decimal:2',
        'sell_price' => 'decimal:2',
        'unit_price' => 'decimal:2',
    ];

    /**
     * Relasi ke category - include soft deleted categories
     * untuk menjaga label kategori tetap muncul meskipun kategori dihapus
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class)->withTrashed();
    }

    /**
     * Relasi ke transactions
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Relasi ke stock snapshots
     */
    public function stockSnapshots(): HasMany
    {
        return $this->hasMany(StockSnapshot::class);
    }

    /**
     * Cek apakah stok masih dalam kondisi aman (di atas min_stock)
     */
    public function isLowStock(): bool
    {
        return $this->stock <= $this->min_stock;
    }
}
