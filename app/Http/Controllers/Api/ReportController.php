<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StockReportResource;
use App\Http\Resources\TransactionReportResource;
use App\Services\ReportService;
use App\Actions\ExportStockReportAction;
use App\Actions\ExportTransactionReportAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function __construct(
        protected ReportService $reportService,
        protected ExportStockReportAction $exportStockReportAction,
        protected ExportTransactionReportAction $exportTransactionReportAction,
    ) {}

    /**
     * Laporan stok barang
     * GET /reports/stock
     */
    public function stockReport(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 10);
        $perPage = $perPage > 0 ? $perPage : 10;

        $stockReport = $this->reportService->getStockReport($perPage);
        $summary = $this->reportService->getStockSummary();

        return response()->json([
            'success' => true,
            'data' => StockReportResource::collection($stockReport->items()),
            'pagination' => [
                'current_page' => $stockReport->currentPage(),
                'last_page' => $stockReport->lastPage(),
                'per_page' => $stockReport->perPage(),
                'total' => $stockReport->total(),
            ],
            'summary' => $summary,
        ]);
    }

    /**
     * Laporan transaksi (masuk & keluar)
     * GET /reports/transactions
     */
    public function transactionReport(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 10);
        $perPage = $perPage > 0 ? $perPage : 10;
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $type = $request->query('type'); // 'in', 'out', atau null

        $transactionReport = $this->reportService->getTransactionReport($type, $perPage, $startDate, $endDate);
        $summary = $this->reportService->getTransactionSummary($startDate, $endDate);

        return response()->json([
            'success' => true,
            'data' => TransactionReportResource::collection($transactionReport->items()),
            'pagination' => [
                'current_page' => $transactionReport->currentPage(),
                'last_page' => $transactionReport->lastPage(),
                'per_page' => $transactionReport->perPage(),
                'total' => $transactionReport->total(),
            ],
            'summary' => $summary,
        ]);
    }

    /**
     * Laporan transaksi masuk (inbound)
     * GET /reports/inbound
     */
    public function inboundReport(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 10);
        $perPage = $perPage > 0 ? $perPage : 10;
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $transactionReport = $this->reportService->getInboundReport($perPage, $startDate, $endDate);

        return response()->json([
            'success' => true,
            'data' => TransactionReportResource::collection($transactionReport->items()),
            'pagination' => [
                'current_page' => $transactionReport->currentPage(),
                'last_page' => $transactionReport->lastPage(),
                'per_page' => $transactionReport->perPage(),
                'total' => $transactionReport->total(),
            ],
        ]);
    }

    /**
     * Laporan transaksi keluar (outbound)
     * GET /reports/outbound
     */
    public function outboundReport(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 10);
        $perPage = $perPage > 0 ? $perPage : 10;
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $transactionReport = $this->reportService->getOutboundReport($perPage, $startDate, $endDate);

        return response()->json([
            'success' => true,
            'data' => TransactionReportResource::collection($transactionReport->items()),
            'pagination' => [
                'current_page' => $transactionReport->currentPage(),
                'last_page' => $transactionReport->lastPage(),
                'per_page' => $transactionReport->perPage(),
                'total' => $transactionReport->total(),
            ],
        ]);
    }

    /**
     * Export laporan stok barang ke CSV atau PDF
     * GET /reports/stock/export?format=csv|pdf&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
     */
    public function exportStock(Request $request): StreamedResponse
    {
        try {
            $format = $request->query('format', 'csv'); // csv atau pdf
            $format = in_array($format, ['csv', 'pdf']) ? $format : 'csv';
            $startDate = $request->query('start_date');
            $endDate = $request->query('end_date');
            
            if ($format === 'csv') {
                $content = $this->exportStockReportAction->executeCSV($startDate, $endDate);
                $contentType = 'text/csv; charset=utf-8';
            } else {
                $content = $this->exportStockReportAction->executePDF($startDate, $endDate);
                $contentType = 'application/pdf';
            }

            $filename = 'laporan-stok-' . now()->format('d-m-Y-His') . '.' . $format;

            return response()->streamDownload(function () use ($content) {
                echo $content;
            }, $filename, [
                'Content-Type' => $contentType,
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]);
        } catch (\Exception $e) {
            return response()->streamDownload(function () use ($e) {
                echo 'Error: ' . $e->getMessage();
            }, 'error.txt', [
                'Content-Type' => 'text/plain',
            ]);
        }
    }

    /**
     * Export laporan transaksi ke CSV atau PDF
     * GET /reports/transactions/export?format=csv|pdf&type=in|out&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
     */
    public function exportTransactions(Request $request): StreamedResponse
    {
        try {
            $format = $request->query('format', 'csv'); // csv atau pdf
            $format = in_array($format, ['csv', 'pdf']) ? $format : 'csv';
            $type = $request->query('type'); // 'in', 'out', atau null untuk semua
            $startDate = $request->query('start_date');
            $endDate = $request->query('end_date');
            
            if ($format === 'csv') {
                $content = $this->exportTransactionReportAction->executeCSV($type, $startDate, $endDate);
                $contentType = 'text/csv; charset=utf-8';
            } else {
                $content = $this->exportTransactionReportAction->executePDF($type, $startDate, $endDate);
                $contentType = 'application/pdf';
            }

            $typeLabel = match ($type) {
                'in' => 'masuk',
                'out' => 'keluar',
                default => 'mutasi',
            };

            $filename = 'laporan-transaksi-' . $typeLabel . '-' . now()->format('d-m-Y-His') . '.' . $format;

            return response()->streamDownload(function () use ($content) {
                echo $content;
            }, $filename, [
                'Content-Type' => $contentType,
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]);
        } catch (\Exception $e) {
            return response()->streamDownload(function () use ($e) {
                echo 'Error: ' . $e->getMessage();
            }, 'error.txt', [
                'Content-Type' => 'text/plain',
            ]);
        }
    }
}
