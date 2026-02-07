import axios from '@/lib/axios';
import type {
  ApiResponse,
  CreateInboundTransactionPayload,
  CreateOutboundTransactionPayload,
  PaginationMeta,
  Transaction,
} from '@/types/warehouse';

/**
 * Mendapatkan daftar semua transaksi
 */
export async function getTransactions(page = 1, perPage = 10): Promise<{
  data: Transaction[];
  pagination: PaginationMeta;
}> {
  const { data } = await axios.get('/transactions', {
    params: { page, per_page: perPage },
  });
  return {
    data: data.data,
    pagination: data.pagination,
  };
}

/**
 * Mendapatkan detail transaksi spesifik
 */
export async function getTransaction(id: number): Promise<Transaction> {
  const { data } = await axios.get(`/transactions/${id}`);
  return data.data;
}

/**
 * Membuat transaksi masuk (barang masuk ke gudang)
 */
export async function createInboundTransaction(
  payload: CreateInboundTransactionPayload,
): Promise<ApiResponse<Transaction>> {
  const { data } = await axios.post('/transactions/inbound', payload);
  return data;
}

/**
 * Membuat transaksi keluar (barang keluar dari gudang)
 */
export async function createOutboundTransaction(
  payload: CreateOutboundTransactionPayload,
): Promise<ApiResponse<Transaction>> {
  const { data } = await axios.post('/transactions/outbound', payload);
  return data;
}

/**
 * Menghapus transaksi
 */
export async function deleteTransaction(id: number): Promise<ApiResponse<void>> {
  const { data } = await axios.delete(`/transactions/${id}`);
  return data;
}
