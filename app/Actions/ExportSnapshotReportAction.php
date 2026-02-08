<?php

namespace App\Actions;

use App\Models\StockSnapshot;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Collection;

class ExportSnapshotReportAction
{
    /**
     * Generate CSV data untuk snapshot berdasarkan periode
     */
    public function executeCSV(string $period): string
    {
        $snapshots = $this->getSnapshotsByPeriod($period);
        return $this->generateCsvContent($snapshots, $period);
    }

    /**
     * Generate PDF data untuk snapshot berdasarkan periode
     */
    public function executePDF(string $period): string
    {
        $snapshots = $this->getSnapshotsByPeriod($period);
        return $this->generatePdfContent($snapshots, $period);
    }

    /**
     * Ambil data snapshot berdasarkan periode dengan relasi
     */
    private function getSnapshotsByPeriod(string $period): Collection
    {
        return StockSnapshot::with(['product.category'])
            ->where('period', $period)
            ->orderBy('id', 'desc')
            ->get();
    }

    /**
     * Generate CSV content dengan format yang rapi
     */
    private function generateCsvContent(Collection $snapshots, string $period): string
    {
        $output = fopen('php://memory', 'r+');
        
        // Company Header
        fputcsv($output, ['MySmartWarehouse - Warehouse Management System'], ',');
        fputcsv($output, ['Laporan Snapshot Stok'], ',');
        fputcsv($output, ['Periode: ' . $period], ',');
        fputcsv($output, ['Tanggal Export: ' . now()->format('d M Y H:i:s')], ',');
        fputcsv($output, [], ','); // Empty row
        
        // Table Header
        fputcsv($output, ['SKU', 'Nama Produk', 'Kategori', 'Closing Stock', 'Harga Beli', 'Snapshot Value', 'Status'], ',');
        
        // Data
        foreach ($snapshots as $snapshot) {
            $product = $snapshot->product;
            $snapshotValue = $snapshot->closing_stock * ($product->buy_price ?? 0);
            $status = $snapshot->closing_stock <= $product->min_stock ? 'Rendah' : 'Normal';
            
            fputcsv($output, [
                $product->sku ?? '-',
                $product->name ?? '-',
                $product->category?->name ?? '-',
                $snapshot->closing_stock,
                number_format($product->buy_price ?? 0, 2, ',', '.'),
                number_format($snapshotValue, 2, ',', '.'),
                $status,
            ], ',');
        }
        
        // Summary
        fputcsv($output, [], ',');
        $totalValue = $snapshots->sum(fn($s) => $s->closing_stock * ($s->product->buy_price ?? 0));
        fputcsv($output, ['Total Produk', $snapshots->count()], ',');
        fputcsv($output, ['Total Nilai Snapshot', number_format($totalValue, 2, ',', '.')], ',');
        
        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);
        
        return $csv;
    }

    /**
     * Generate PDF content menggunakan dompdf
     */
    private function generatePdfContent(Collection $snapshots, string $period): string
    {
        $totalValue = $snapshots->sum(fn($s) => $s->closing_stock * ($s->product->buy_price ?? 0));
        $totalProducts = $snapshots->count();
        
        $html = '
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Laporan Snapshot Stok - ' . $period . '</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                    }
                    body {
                        font-family: "Segoe UI", Arial, sans-serif;
                        padding: 15px 20px;
                        font-size: 9pt;
                        color: #333;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                        border-bottom: 2px solid #0d9488;
                        padding-bottom: 10px;
                    }
                    .company-name {
                        font-size: 16pt;
                        font-weight: bold;
                        color: #0d9488;
                        margin-bottom: 3px;
                    }
                    .report-title {
                        font-size: 12pt;
                        font-weight: 600;
                        margin-bottom: 5px;
                    }
                    .report-period {
                        font-size: 10pt;
                        color: #666;
                        margin-bottom: 3px;
                    }
                    .export-date {
                        font-size: 8pt;
                        color: #999;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 15px;
                    }
                    th {
                        background: #0d9488;
                        color: white;
                        padding: 8px 6px;
                        text-align: left;
                        font-size: 9pt;
                        font-weight: 600;
                    }
                    td {
                        padding: 6px 6px;
                        border-bottom: 1px solid #e5e7eb;
                        font-size: 8pt;
                    }
                    tr:nth-child(even) {
                        background: #f9fafb;
                    }
                    .text-right {
                        text-align: right;
                    }
                    .text-center {
                        text-align: center;
                    }
                    .status-badge {
                        padding: 2px 8px;
                        border-radius: 4px;
                        font-size: 7pt;
                        font-weight: 600;
                        display: inline-block;
                    }
                    .status-normal {
                        background: #d1fae5;
                        color: #065f46;
                    }
                    .status-rendah {
                        background: #fee2e2;
                        color: #991b1b;
                    }
                    .summary {
                        margin-top: 20px;
                        padding: 12px;
                        background: #f0fdfa;
                        border: 1px solid #0d9488;
                        border-radius: 4px;
                    }
                    .summary-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 4px 0;
                        font-size: 9pt;
                    }
                    .summary-label {
                        font-weight: 600;
                        color: #0d9488;
                    }
                    .summary-value {
                        font-weight: 700;
                        color: #0f766e;
                    }
                    .footer {
                        margin-top: 20px;
                        text-align: center;
                        font-size: 7pt;
                        color: #999;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="company-name">MySmartWarehouse</div>
                    <div class="report-title">Laporan Snapshot Stok</div>
                    <div class="report-period">Periode: ' . htmlspecialchars($period) . '</div>
                    <div class="export-date">Tanggal Export: ' . now()->format('d M Y H:i:s') . '</div>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th style="width: 10%">SKU</th>
                            <th style="width: 22%">Nama Produk</th>
                            <th style="width: 15%">Kategori</th>
                            <th style="width: 10%" class="text-right">Closing Stock</th>
                            <th style="width: 13%" class="text-right">Harga Beli</th>
                            <th style="width: 15%" class="text-right">Snapshot Value</th>
                            <th style="width: 10%" class="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>';
        
        foreach ($snapshots as $snapshot) {
            $product = $snapshot->product;
            $snapshotValue = $snapshot->closing_stock * ($product->buy_price ?? 0);
            $status = $snapshot->closing_stock <= $product->min_stock ? 'Rendah' : 'Normal';
            $statusClass = $status === 'Rendah' ? 'status-rendah' : 'status-normal';
            
            $html .= '
                        <tr>
                            <td>' . htmlspecialchars($product->sku ?? '-') . '</td>
                            <td>' . htmlspecialchars($product->name ?? '-') . '</td>
                            <td>' . htmlspecialchars($product->category?->name ?? '-') . '</td>
                            <td class="text-right">' . number_format($snapshot->closing_stock, 0, ',', '.') . '</td>
                            <td class="text-right">Rp' . number_format($product->buy_price ?? 0, 0, ',', '.') . '</td>
                            <td class="text-right">Rp' . number_format($snapshotValue, 0, ',', '.') . '</td>
                            <td class="text-center">
                                <span class="status-badge ' . $statusClass . '">' . $status . '</span>
                            </td>
                        </tr>';
        }
        
        $html .= '
                    </tbody>
                </table>
                
                <div class="summary">
                    <div class="summary-row">
                        <span class="summary-label">Total Produk:</span>
                        <span class="summary-value">' . number_format($totalProducts, 0, ',', '.') . '</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Total Nilai Snapshot:</span>
                        <span class="summary-value">Rp' . number_format($totalValue, 0, ',', '.') . '</span>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Dokumen ini dibuat secara otomatis oleh sistem MySmartWarehouse</p>
                </div>
            </body>
        </html>';

        $pdf = Pdf::loadHTML($html);
        $pdf->setPaper('A4', 'landscape');
        
        return $pdf->output();
    }
}
