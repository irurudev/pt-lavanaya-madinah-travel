<?php

namespace App\Services;

use App\Actions\CreateStockSnapshotAction;
use App\Actions\ExportSnapshotReportAction;
use App\DTOs\StockSnapshotDTO;
use App\Models\StockSnapshot;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class StockSnapshotService
{
    public function __construct(
        protected CreateStockSnapshotAction $snapshotAction,
        protected ExportSnapshotReportAction $exportAction,
    ) {}

    /**
     * Buat stock snapshot untuk periode tertentu
     */
    public function createSnapshot(StockSnapshotDTO $dto, bool $forceUpdate = false): Collection
    {
        return $this->snapshotAction->execute($dto, $forceUpdate);
    }

    /**
     * Get list periode yang sudah ada snapshots
     */
    public function getExistingPeriods(): array
    {
        return $this->snapshotAction->getExistingPeriods();
    }

    /**
     * Get snapshot data untuk periode tertentu diurutkan dari yang terbaru
     */
    public function getSnapshotsByPeriod(string $period): Collection
    {
        return $this->snapshotAction->getSnapshotsByPeriod($period);
    }

    /**
     * Get snapshot data untuk periode tertentu dengan pagination
     */
    public function getSnapshotsByPeriodPaginated(string $period, int $perPage = 10): LengthAwarePaginator
    {
        return StockSnapshot::with('product', 'product.category')
            ->where('period', $period)
            ->orderBy('id', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get all snapshots dengan pagination
     */
    public function getAllSnapshots(int $perPage = 10)
    {
        return StockSnapshot::with('product', 'product.category')
            ->orderBy('period', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get snapshot summary untuk periode tertentu
     */
    public function getSnapshotSummary(string $period): array
    {
        $snapshots = $this->getSnapshotsByPeriod($period);

        return [
            'period' => $period,
            'total_products' => $snapshots->count(),
            'total_value' => $snapshots->sum(fn($snapshot) => 
                $snapshot->closing_stock * $snapshot->product->buy_price
            ),
            'average_stock' => $snapshots->avg('closing_stock'),
        ];
    }

    /**
     * Export snapshot report ke CSV
     */
    public function exportCSV(string $period): string
    {
        return $this->exportAction->executeCSV($period);
    }

    /**
     * Export snapshot report ke PDF
     */
    public function exportPDF(string $period): string
    {
        return $this->exportAction->executePDF($period);
    }
}
