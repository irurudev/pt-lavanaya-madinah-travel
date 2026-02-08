<?php

namespace App\Services;

use App\Repositories\ReportRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ReportService
{
    public function __construct(
        protected ReportRepository $reportRepository,
    ) {}

    /**
     * Mendapatkan laporan stok barang
     */
    public function getStockReport(?int $perPage = 10): LengthAwarePaginator
    {
        return $this->reportRepository->getStockReport($perPage ?? 10);
    }

    /**
     * Mendapatkan laporan transaksi (masuk & keluar)
     */
    public function getTransactionReport(?string $type = null, ?int $perPage = 10, ?string $startDate = null, ?string $endDate = null): LengthAwarePaginator
    {
        return $this->reportRepository->getTransactionReport($type, $perPage, $startDate, $endDate);
    }

    /**
     * Mendapatkan laporan transaksi masuk
     */
    public function getInboundReport(?int $perPage = 10, ?string $startDate = null, ?string $endDate = null): LengthAwarePaginator
    {
        return $this->reportRepository->getInboundReport($perPage, $startDate, $endDate);
    }

    /**
     * Mendapatkan laporan transaksi keluar
     */
    public function getOutboundReport(?int $perPage = 10, ?string $startDate = null, ?string $endDate = null): LengthAwarePaginator
    {
        return $this->reportRepository->getOutboundReport($perPage, $startDate, $endDate);
    }

    /**
     * Mendapatkan ringkasan stok
     */
    public function getStockSummary(): array
    {
        return $this->reportRepository->getStockSummary();
    }

    /**
     * Mendapatkan ringkasan transaksi
     */
    public function getTransactionSummary(?string $startDate = null, ?string $endDate = null): array
    {
        return $this->reportRepository->getTransactionSummary($startDate, $endDate);
    }
}
