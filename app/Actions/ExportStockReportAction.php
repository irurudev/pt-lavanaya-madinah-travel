<?php

namespace App\Actions;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Barryvdh\DomPDF\Facade\Pdf;

class ExportStockReportAction
{
    /**
     * Generate CSV data untuk laporan stok dengan optional date range
     */
    public function executeCSV(?string $startDate = null, ?string $endDate = null): string
    {
        $query = Product::with('category')
            ->select('products.sku', 'products.name', 'products.stock', 
                    'products.min_stock', 'products.buy_price', 'products.category_id');
        
        $products = $query->get();

        $csv = $this->generateCsvContent($products);
        return $csv;
    }

    /**
     * Generate PDF data untuk laporan stok dengan optional date range
     */
    public function executePDF(?string $startDate = null, ?string $endDate = null): string
    {
        $query = Product::with('category')
            ->select('products.sku', 'products.name', 'products.stock', 
                    'products.min_stock', 'products.buy_price', 'products.category_id');
        
        $products = $query->get();

        return $this->generatePdfContent($products, $startDate, $endDate);
    }

    /**
     * Generate CSV content dengan format yang rapi
     */
    private function generateCsvContent(Collection $products): string
    {
        $output = fopen('php://memory', 'r+');
        
        // Company Header
        fputcsv($output, ['MySmartWarehouse - Warehouse Management System'], ',');
        fputcsv($output, ['Laporan Stok Barang'], ',');
        fputcsv($output, ['Tanggal: ' . now()->format('d M Y H:i:s')], ',');
        fputcsv($output, [], ','); // Empty row
        
        // Table Header
        fputcsv($output, ['SKU', 'Nama Produk', 'Kategori', 'Stok', 'Min Stok', 'Harga Beli', 'Nilai Stok', 'Status'], ',');
        
        // Data
        foreach ($products as $product) {
            $stockValue = $product->stock * $product->buy_price;
            $status = $product->stock <= $product->min_stock ? 'Rendah' : 'Normal';
            
            fputcsv($output, [
                $product->sku,
                $product->name,
                $product->category?->name ?? '-',
                $product->stock,
                $product->min_stock,
                number_format($product->buy_price, 2, ',', '.'),
                number_format($stockValue, 2, ',', '.'),
                $status,
            ], ',');
        }
        
        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);
        
        return $csv;
    }

    /**
     * Generate PDF content menggunakan dompdf
     */
    private function generatePdfContent(Collection $products, ?string $startDate = null, ?string $endDate = null): string
    {
        $html = '
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Laporan Stok Barang</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                    }
                    body {
                        font-family: "Segoe UI", Arial, sans-serif;
                        padding: 15px 20px;
                        font-size: 10pt;
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
                        padding: 8px 10px;
                        text-align: left;
                        font-size: 9pt;
                    }
                    th {
                        background-color: #2d7a6e;
                        color: white;
                        font-weight: bold;
                        text-align: center;
                    }
                    tr:nth-child(even) { background-color: #f8f8f8; }
                    td:nth-child(4),
                    td:nth-child(5),
                    td:nth-child(6),
                    td:nth-child(7),
                    td:nth-child(8) {
                        text-align: center;
                    }
                    .low-stock { 
                        color: #d32f2f; 
                        font-weight: bold;
                        background-color: #ffebee;
                    }
                    .normal-stock { 
                        color: #388e3c; 
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
                    <div class="report-title">Laporan Stok Barang</div>
                </div>

                <div class="report-info">
                    <div class="info-item">
                        <div class="info-label">Periode:</div>
                        <div>Semua Data</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Tanggal Cetak:</div>
                        <div>' . now()->format('d M Y H:i:s') . '</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Record:</div>
                        <div>' . $products->count() . '</div>
                    </div>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Nama Produk</th>
                            <th>Kategori</th>
                            <th>Stok</th>
                            <th>Min Stok</th>
                            <th>Harga Beli</th>
                            <th>Nilai Stok</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>';

        $totalValue = 0;
        foreach ($products as $product) {
            $stockValue = $product->stock * $product->buy_price;
            $totalValue += $stockValue;
            $isLowStock = $product->stock <= $product->min_stock;
            $status = $isLowStock ? 'Rendah' : 'Normal';
            $statusClass = $isLowStock ? 'low-stock' : 'normal-stock';

            $html .= '
                        <tr>
                            <td>' . htmlspecialchars($product->sku) . '</td>
                            <td>' . htmlspecialchars($product->name) . '</td>
                            <td>' . htmlspecialchars($product->category?->name ?? '-') . '</td>
                            <td>' . $product->stock . '</td>
                            <td>' . $product->min_stock . '</td>
                            <td>Rp ' . number_format($product->buy_price, 2, ',', '.') . '</td>
                            <td>Rp ' . number_format($stockValue, 2, ',', '.') . '</td>
                            <td class="' . $statusClass . '">' . $status . '</td>
                        </tr>';
        }

        $html .= '
                        <tr style="background-color: #e8e8e8; font-weight: bold;">
                            <td colspan="6" style="text-align: right; padding-right: 10px;">TOTAL NILAI STOK:</td>
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
