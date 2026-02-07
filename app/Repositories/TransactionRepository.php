<?php

namespace App\Repositories;

use App\Enums\TransactionType;
use App\Models\Transaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class TransactionRepository
{
    /**
     * Mendapatkan semua transaksi dengan relasi diurutkan dari yang terbaru
     */
    public function getAll(): Collection
    {
        return Transaction::with(['product.category', 'user'])->orderBy('created_at', 'desc')->get();
    }

    /**
     * Mendapatkan transaksi dengan pagination diurutkan dari yang terbaru
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Transaction::with(['product.category', 'user'])->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Mencari transaksi berdasarkan ID
     */
    public function findById(int $id): ?Transaction
    {
        return Transaction::with(['product.category', 'user'])->find($id);
    }

    /**
     * Mencari transaksi berdasarkan produk
     */
    public function findByProduct(int $productId): Collection
    {
        return Transaction::where('product_id', $productId)->orderBy('created_at', 'desc')->get();
    }

    /**
     * Mencari transaksi berdasarkan tipe (in/out)
     */
    public function findByType(TransactionType $type): Collection
    {
        return Transaction::where('type', $type)->orderBy('created_at', 'desc')->get();
    }

    /**
     * Mendapatkan transaksi dalam range tanggal
     */
    public function findByDateRange(string $startDate, string $endDate): Collection
    {
        return Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Membuat transaksi baru
     */
    public function create(array $data): Transaction
    {
        return Transaction::create($data);
    }

    /**
     * Menghapus transaksi
     */
    public function delete(Transaction $transaction): bool
    {
        return $transaction->delete();
    }

    /**
     * Mendapatkan total transaksi masuk per produk
     */
    public function getTotalInbound(int $productId): int
    {
        return Transaction::where('product_id', $productId)
            ->where('type', TransactionType::In)
            ->sum('quantity');
    }

    /**
     * Mendapatkan total transaksi keluar per produk
     */
    public function getTotalOutbound(int $productId): int
    {
        return Transaction::where('product_id', $productId)
            ->where('type', TransactionType::Out)
            ->sum('quantity');
    }

    /**
     * Generate nomor referensi otomatis dengan format: PREFIX-YYYYMMDD-XXXX
     * PREFIX: IN untuk transaksi masuk, OUT untuk transaksi keluar
     * XXXX: Sequential number untuk hari tersebut
     */
    public function generateReferenceNo(TransactionType $type): string
    {
        $prefix = $type === TransactionType::In ? 'IN' : 'OUT';
        $date = now()->format('Ymd');
        
        // Cari nomor terakhir untuk hari ini dengan prefix yang sama
        $lastTransaction = Transaction::where('type', $type)
            ->whereDate('created_at', now()->toDateString())
            ->orderBy('id', 'desc')
            ->first();
        
        // Extract sequential number dari reference_no terakhir
        $sequence = 1;
        if ($lastTransaction && preg_match('/-\d{8}-(\d+)$/', $lastTransaction->reference_no, $matches)) {
            $sequence = intval($matches[1]) + 1;
        }
        
        // Format: PREFIX-YYYYMMDD-XXXX (contoh: IN-20260207-0001)
        return sprintf('%s-%s-%04d', $prefix, $date, $sequence);
    }
}
