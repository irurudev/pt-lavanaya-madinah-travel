import axios from '@/lib/axios';
import type {
  PaginationMeta,
  StockReportItem,
  StockReportSummary,
  TransactionReportItem,
  TransactionReportPagination,
  TransactionReportSummary,
} from '@/types/warehouse';

/**
 * Mendapatkan laporan stok barang
 */
export async function getStockReport(page = 1, perPage = 10): Promise<{
  data: StockReportItem[];
  pagination: PaginationMeta;
  summary: StockReportSummary;
}> {
  const { data } = await axios.get('/reports/stock', {
    params: { page, per_page: perPage },
  });
  return {
    data: data.data,
    pagination: data.pagination,
    summary: data.summary,
  };
}

/**
 * Mendapatkan laporan transaksi (masuk & keluar)
 */
export async function getTransactionReport(
  page = 1, 
  perPage = 10, 
  startDate?: string, 
  endDate?: string,
  type?: 'in' | 'out'
): Promise<{
  data: TransactionReportItem[];
  pagination: TransactionReportPagination;
  summary: TransactionReportSummary;
}> {
  const params: Record<string, unknown> = { page, per_page: perPage };
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  if (type) params.type = type;

  const { data } = await axios.get('/reports/transactions', { params });
  return {
    data: data.data,
    pagination: data.pagination,
    summary: data.summary,
  };
}

/**
 * Mendapatkan laporan transaksi masuk (inbound)
 */
export async function getInboundReport(
  page = 1, 
  perPage = 10, 
  startDate?: string, 
  endDate?: string
): Promise<{
  data: TransactionReportItem[];
  pagination: TransactionReportPagination;
}> {
  const params: Record<string, unknown> = { page, per_page: perPage };
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;

  const { data } = await axios.get('/reports/inbound', { params });
  return {
    data: data.data,
    pagination: data.pagination,
  };
}

/**
 * Mendapatkan laporan transaksi keluar (outbound)
 */
export async function getOutboundReport(
  page = 1, 
  perPage = 10, 
  startDate?: string, 
  endDate?: string
): Promise<{
  data: TransactionReportItem[];
  pagination: TransactionReportPagination;
}> {
  const params: Record<string, unknown> = { page, per_page: perPage };
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;

  const { data } = await axios.get('/reports/outbound', { params });
  return {
    data: data.data,
    pagination: data.pagination,
  };
}

/**
 * Download laporan stok ke CSV atau PDF
 */
export async function downloadStockReport(format: 'csv' | 'pdf' = 'csv', startDate?: string, endDate?: string): Promise<void> {
  try {
    const params = new URLSearchParams();
    params.append('format', format);
    
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await axios.get(`/reports/stock/export?${params.toString()}`, {
      responseType: 'blob',
    });

    // Cek apakah response adalah error text
    if (response.data.type === 'text/plain') {
      const errorText = await response.data.text();
      throw new Error(errorText);
    }

    // Buat blob URL dan download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    // Extract filename dari Content-Disposition header
    const contentDisposition = response.headers['content-disposition'] || '';
    let filename = `laporan-stok.${format}`;
    
    if (contentDisposition && contentDisposition.includes('filename="')) {
      const parts = contentDisposition.split('filename="');
      if (parts.length > 1) {
        filename = parts[1].split('"')[0];
      }
    }

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export stock error:', error);
    throw new Error('Gagal mengunduh laporan stok: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

/**
 * Download laporan transaksi ke CSV atau PDF dengan filter tanggal dan tipe
 */
export async function downloadTransactionReport(
  type?: 'in' | 'out',
  format: 'csv' | 'pdf' = 'csv',
  startDate?: string,
  endDate?: string
): Promise<void> {
  try {
    const params = new URLSearchParams();
    params.append('format', format);
    
    if (type) params.append('type', type);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await axios.get(`/reports/transactions/export?${params.toString()}`, {
      responseType: 'blob',
    });

    // Cek apakah response adalah error text
    if (response.data.type === 'text/plain') {
      const errorText = await response.data.text();
      throw new Error(errorText);
    }

    // Buat blob URL dan download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    // Extract filename dari Content-Disposition header
    const contentDisposition = response.headers['content-disposition'] || '';
    let filename = `laporan-transaksi.${format}`;
    
    if (contentDisposition && contentDisposition.includes('filename="')) {
      const parts = contentDisposition.split('filename="');
      if (parts.length > 1) {
        filename = parts[1].split('"')[0];
      }
    }

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export transaction error:', error);
    throw new Error('Gagal mengunduh laporan transaksi: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}
