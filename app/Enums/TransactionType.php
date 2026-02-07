<?php

namespace App\Enums;

enum TransactionType: string
{
    case In = 'in';
    case Out = 'out';

    /**
     * Get label untuk UI
     */
    public function label(): string
    {
        return match($this) {
            self::In => 'Barang Masuk',
            self::Out => 'Barang Keluar',
        };
    }

    /**
     * Get warna badge untuk UI
     */
    public function color(): string
    {
        return match($this) {
            self::In => 'success',
            self::Out => 'error',
        };
    }
}
