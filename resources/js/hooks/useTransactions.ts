import { useCallback, useState } from 'react';

import {
  createInboundTransaction,
  createOutboundTransaction,
  deleteTransaction,
  getTransaction,
  getTransactions,
} from '@/api/transactionApi';
import type {
  CreateInboundTransactionPayload,
  CreateOutboundTransactionPayload,
  PaginationMeta,
  Transaction,
} from '@/types/warehouse';

/**
 * Hook untuk mengelola transaksi
 * Menyediakan fungsi CRUD dengan state loading dan error handling
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  /**
   * Fetch daftar transaksi - tanpa dependency problem
   */
  const fetchTransactions = useCallback(async (targetPage: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTransactions(targetPage, perPage);
      setTransactions(result.data);
      setPagination(result.pagination);
      setPage(result.pagination.current_page);

      if (targetPage > 1 && result.data.length === 0 && result.pagination.total > 0) {
        await fetchTransactions(targetPage - 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  /**
   * Fetch transaksi spesifik
   */
  const fetchTransaction = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      return await getTransaction(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Buat transaksi masuk
   */
  const createInbound = useCallback(
    async (payload: CreateInboundTransactionPayload) => {
      setLoading(true);
      setError(null);
      try {
        const result = await createInboundTransaction(payload);
        await fetchTransactions(page);
        return result.data;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Gagal membuat transaksi masuk',
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTransactions, page],
  );

  /**
   * Buat transaksi keluar
   */
  const createOutbound = useCallback(
    async (payload: CreateOutboundTransactionPayload) => {
      setLoading(true);
      setError(null);
      try {
        const result = await createOutboundTransaction(payload);
        await fetchTransactions(page);
        return result.data;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Gagal membuat transaksi keluar',
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTransactions, page],
  );

  /**
   * Hapus transaksi
   */
  const remove = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        await deleteTransaction(id);
        await fetchTransactions(page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal menghapus transaksi');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTransactions, page],
  );

  return {
    transactions,
    loading,
    error,
    pagination,
    page,
    setPage,
    fetchTransactions,
    fetchTransaction,
    createInbound,
    createOutbound,
    remove,
  };
}
