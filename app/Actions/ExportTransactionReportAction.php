<?php

namespace App\Actions;

use App\Enums\TransactionType;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class ExportTransactionReportAction
{
    /**
     * Generate CSV data untuk laporan transaksi
     */
    public function executeCSV(?string $type = null, ?string $startDate = null, ?string $endDate = null): string
    {
        $transactions = $this->getTransactions($type, $startDate, $endDate);
        return $this->generateCsvContent($transactions);
    }

    /**
     * Generate PDF data untuk laporan transaksi
     */
    public function executePDF(?string $type = null, ?string $startDate = null, ?string $endDate = null): string
    {
        $transactions = $this->getTransactions($type, $startDate, $endDate);
        return $this->generatePdfContent($transactions, $type, $startDate, $endDate);
    }

    /**
     * Query transaksi dengan filter type dan date range
     */
    private function getTransactions(?string $type = null, ?string $startDate = null, ?string $endDate = null): Collection
    {
        $query = Transaction::with(['product', 'product.category', 'user']);

        if ($type) {
            $query->where('type', $type);
        }

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Generate CSV content dengan format yang rapi
     */
    private function generateCsvContent(Collection $transactions): string
    {
        $output = fopen('php://memory', 'r+');
        
        // Company Header
        fputcsv($output, ['MySmartWarehouse - Warehouse Management System'], ',');
        fputcsv($output, ['Laporan Mutasi Stok'], ',');
        fputcsv($output, ['Tanggal: ' . now()->format('d M Y H:i:s')], ',');
        fputcsv($output, [], ','); // Empty row
        
        // Table Header
        fputcsv($output, [
            'Tanggal',
            'Tipe',
            'SKU',
            'Nama Produk',
            'Kategori',
            'Jumlah',
            'Harga Unit',
            'Total Nilai',
            'User'
        ], ',');
        
        // Data
        foreach ($transactions as $transaction) {
            $totalValue = $transaction->quantity * $transaction->price_at_transaction;
            
            // Tentukan label tipe transaksi
            $typeLabel = match ($transaction->type?->value) {
                'in' => 'Masuk',
                'out' => 'Keluar',
                default => 'Unknown',
            };
            
            fputcsv($output, [
                $transaction->created_at->format('d/m/Y H:i'),
                $typeLabel,
                $transaction->product?->sku ?? '-',
                $transaction->product?->name ?? '-',
                $transaction->product?->category?->name ?? '-',
                $transaction->quantity,
                number_format($transaction->price_at_transaction, 2, ',', '.'),
                number_format($totalValue, 2, ',', '.'),
                $transaction->user?->name ?? '-',
            ], ',');
        }
        
        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);
        
        return $csv;
    }

    /**
     * Generate PDF content (HTML-based)
     */
    private function generatePdfContent(Collection $transactions, ?string $type, ?string $startDate, ?string $endDate): string
    {
        $typeLabel = match ($type) {
            'in' => 'Barang Masuk',
            'out' => 'Barang Keluar',
            default => 'Semua Mutasi Stok',
        };

        $dateRange = '';
        if ($startDate && $endDate) {
            $dateRange = Carbon::parse($startDate)->format('d M Y') . ' - ' . Carbon::parse($endDate)->format('d M Y');
        } elseif ($startDate) {
            $dateRange = 'Dari ' . Carbon::parse($startDate)->format('d M Y');
        } elseif ($endDate) {
            $dateRange = 'Sampai ' . Carbon::parse($endDate)->format('d M Y');
        }

        $html = '
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Laporan ' . htmlspecialchars($typeLabel) . '</title>
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
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                        border-bottom: 3px solid #2d7a6e;
                        padding-bottom: 15px;
                    }
                    .company-info {
                        flex: 1;
                    }
                    .company-name {
                        font-size: 18pt;
                        font-weight: bold;
                        color: #2d7a6e;
                        margin-bottom: 5px;
                    }
                    .company-tagline {
                        font-size: 8pt;
                        color: #666;
                        font-style: italic;
                    }
                    .report-title {
                        font-size: 14pt;
                        font-weight: bold;
                        color: #2d7a6e;
                        text-align: right;
                        min-width: 200px;
                    }
                    .report-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr 1fr;
                        gap: 20px;
                        margin-bottom: 15px;
                        font-size: 9pt;
                        color: #555;
                    }
                    .info-item {
                        padding: 5px 0;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #2d7a6e;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                    }
                    th, td {
                        border: 1px solid #c0c0c0;
                        padding: 7px 8px;
                        text-align: left;
                        font-size: 8.5pt;
                    }
                    th {
                        background-color: #2d7a6e;
                        color: white;
                        font-weight: bold;
                        text-align: center;
                    }
                    tr:nth-child(even) { background-color: #f8f8f8; }
                    td:nth-child(1),
                    td:nth-child(2),
                    td:nth-child(6),
                    td:nth-child(7),
                    td:nth-child(8) {
                        text-align: center;
                    }
                    .in { 
                        color: #388e3c; 
                        font-weight: bold;
                        background-color: #f0f8f4;
                    }
                    .out { 
                        color: #d32f2f; 
                        font-weight: bold;
                        background-color: #fef4f4;
                    }
                    .total {
                        background-color: #e8e8e8;
                        font-weight: bold;
                        border-top: 2px solid #2d7a6e;
                    }
                    .footer {
                        margin-top: 20px;
                        border-top: 1px solid #ddd;
                        padding-top: 10px;
                        font-size: 8pt;
                        color: #999;
                        text-align: right;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="company-info">
                        <div class="company-name">MySmartWarehouse</div>
                        <div class="company-tagline">Warehouse Management System</div>
                    </div>
                    <div class="report-title">Laporan ' . htmlspecialchars($typeLabel) . '</div>
                </div>

                <div class="report-info">
                    <div class="info-item">
                        <div class="info-label">Periode:</div>
                        <div>' . ($dateRange ? htmlspecialchars($dateRange) : 'Semua Data') . '</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Tanggal Cetak:</div>
                        <div>' . now()->format('d M Y H:i:s') . '</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Record:</div>
                        <div>' . $transactions->count() . '</div>
                    </div>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th style="width: 12%;">Tanggal</th>
                            <th style="width: 8%;">Tipe</th>
                            <th style="width: 8%;">SKU</th>
                            <th style="width: 16%;">Nama Produk</th>
                            <th style="width: 12%;">Kategori</th>
                            <th style="width: 6%;">Qty</th>
                            <th style="width: 12%;">Harga Unit</th>
                            <th style="width: 12%;">Total</th>
                            <th style="width: 14%;">User</th>
                        </tr>
                    </thead>
                    <tbody>';

        $totalQty = 0;
        $totalValue = 0;

        foreach ($transactions as $transaction) {
            $value = $transaction->quantity * $transaction->price_at_transaction;
            $totalQty += $transaction->quantity;
            $totalValue += $value;

            $typeDisplayLabel = match ($transaction->type?->value) {
                'in' => 'Masuk',
                'out' => 'Keluar',
                default => 'Unknown',
            };
            
            $typeClass = $transaction->type?->value === 'in' ? 'in' : 'out';

            $html .= '
                        <tr>
                            <td>' . $transaction->created_at->format('d/m/Y H:i') . '</td>
                            <td class="' . $typeClass . '">' . $typeDisplayLabel . '</td>
                            <td>' . htmlspecialchars($transaction->product?->sku ?? '-') . '</td>
                            <td>' . htmlspecialchars($transaction->product?->name ?? '-') . '</td>
                            <td>' . htmlspecialchars($transaction->product?->category?->name ?? '-') . '</td>
                            <td>' . $transaction->quantity . ' unit</td>
                            <td>Rp ' . number_format($transaction->price_at_transaction, 2, ',', '.') . '</td>
                            <td>Rp ' . number_format($value, 2, ',', '.') . '</td>
                            <td>' . htmlspecialchars($transaction->user?->name ?? '-') . '</td>
                        </tr>';
        }

        $html .= '
                        <tr class="total">
                            <td colspan="5">TOTAL</td>
                            <td>' . $totalQty . ' unit</td>
                            <td></td>
                            <td>Rp ' . number_format($totalValue, 2, ',', '.') . '</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer">
                    <p>Laporan ini dicetak otomatis oleh sistem MySmartWarehouse</p>
                </div>
            </body>
        </html>';

        // Generate PDF menggunakan dompdf dengan orientasi landscape
        $pdf = Pdf::loadHTML($html);
        $pdf->setPaper('a4', 'landscape');
        return $pdf->output();
    }
}
