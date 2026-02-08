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

    /**
     * Mendapatkan financial metrics untuk dashboard
     */
    public function getFinancialMetrics(): array
    {
        return $this->reportRepository->getFinancialMetrics();
    }

    /**
     * Mendapatkan fast moving products (top outbound 30 hari)
     */
    public function getFastMovers(int $limit = 10): array
    {
        return $this->reportRepository->getFastMovers($limit);
    }

    /**
     * Mendapatkan slow/dead stock products
     */
    public function getSlowMovers(int $limit = 10): array
    {
        return $this->reportRepository->getSlowMovers($limit);
    }

    /**
     * Mendapatkan transaction trend data (30 hari)
     */
    public function getTransactionTrends(): array
    {
        return $this->reportRepository->getTransactionTrends();
    }

    /**
     * Mendapatkan critical alerts dashboard
     */
    public function getCriticalAlerts(): array
    {
        return $this->reportRepository->getCriticalAlerts();
    }

    /**
     * Mendapatkan category performance analysis
     */
    public function getCategoryPerformance(): array
    {
        return $this->reportRepository->getCategoryPerformance();
    }

    /**
     * Mendapatkan operational statistics
     */
    public function getOperationalStats(): array
    {
        return $this->reportRepository->getOperationalStats();
    }
}
