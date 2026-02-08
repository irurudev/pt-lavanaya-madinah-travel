import { useEffect, useState, useCallback } from 'react';
import * as reportApi from '@/api/reportApi';
import type {
  PaginationMeta,
  StockReportItem,
  StockReportSummary,
  TransactionReportItem,
  TransactionReportPagination,
  TransactionReportSummary,
} from '@/types/warehouse';

/**
 * Hook untuk mengelola laporan stok barang
 */
export function useStockReport() {
  const [items, setItems] = useState<StockReportItem[]>([]);
  const [summary, setSummary] = useState<StockReportSummary | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const perPage = 10;

  const fetchReport = useCallback(async (targetPage = 1) => {
    try {
      setLoading(true);
      setError(null);
      const result = await reportApi.getStockReport(targetPage, perPage);
      setItems(result.data);
      setSummary(result.summary);
      setPagination(result.pagination);
      setPage(result.pagination.current_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat laporan stok');
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  useEffect(() => {
    fetchReport(page);
  }, [page, fetchReport]);

  return {
    items,
    summary,
    pagination,
    page,
    setPage,
    loading,
    error,
    refetch: () => fetchReport(page),
  };
}

/**
 * Hook untuk mengelola laporan transaksi (masuk & keluar)
 */
export function useTransactionReport(filters?: { startDate?: string; endDate?: string; type?: 'in' | 'out' }) {
  const [items, setItems] = useState<TransactionReportItem[]>([]);
  const [pagination, setPagination] = useState<TransactionReportPagination | null>(null);
  const [summary, setSummary] = useState<TransactionReportSummary | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const perPage = 10;

  const fetchReport = useCallback(async (targetPage = 1, currentFilters = appliedFilters) => {
    try {
      setLoading(true);
      setError(null);
      const result = await reportApi.getTransactionReport(
        targetPage,
        perPage,
        currentFilters?.startDate,
        currentFilters?.endDate,
        currentFilters?.type
      );
      setItems(result.data);
      setPagination(result.pagination);
      setSummary(result.summary);
      setPage(result.pagination.current_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat laporan transaksi');
    } finally {
      setLoading(false);
    }
  }, [perPage, appliedFilters]);

  const applyFilters = useCallback((newFilters: { startDate?: string; endDate?: string; type?: 'in' | 'out' }) => {
    setAppliedFilters(newFilters);
    setPage(1);
    fetchReport(1, newFilters);
  }, [fetchReport]);

  useEffect(() => {
    fetchReport(page);
  }, [page, fetchReport]);

  return {
    items,
    pagination,
    summary,
    page,
    setPage,
    loading,
    error,
    appliedFilters,
    applyFilters,
    refetch: () => fetchReport(page),
  };
}

/**
 * Hook untuk mengelola laporan transaksi masuk (inbound)
 */
export function useInboundReport(filters?: { startDate?: string; endDate?: string }) {
  const [items, setItems] = useState<TransactionReportItem[]>([]);
  const [pagination, setPagination] = useState<TransactionReportPagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const perPage = 10;

  const fetchReport = useCallback(async (targetPage = 1, currentFilters = appliedFilters) => {
    try {
      setLoading(true);
      setError(null);
      const result = await reportApi.getInboundReport(
        targetPage,
        perPage,
        currentFilters?.startDate,
        currentFilters?.endDate
      );
      setItems(result.data);
      setPagination(result.pagination);
      setPage(result.pagination.current_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat laporan masuk');
    } finally {
      setLoading(false);
    }
  }, [perPage, appliedFilters]);

  const applyFilters = useCallback((newFilters: { startDate?: string; endDate?: string }) => {
    setAppliedFilters(newFilters);
    setPage(1);
    fetchReport(1, newFilters);
  }, [fetchReport]);

  useEffect(() => {
    fetchReport(page);
  }, [page, fetchReport]);

  return {
    items,
    pagination,
    page,
    setPage,
    loading,
    error,
    appliedFilters,
    applyFilters,
    refetch: () => fetchReport(page),
  };
}

/**
 * Hook untuk mengelola laporan transaksi keluar (outbound)
 */
export function useOutboundReport(filters?: { startDate?: string; endDate?: string }) {
  const [items, setItems] = useState<TransactionReportItem[]>([]);
  const [pagination, setPagination] = useState<TransactionReportPagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const perPage = 10;

  const fetchReport = useCallback(async (targetPage = 1, currentFilters = appliedFilters) => {
    try {
      setLoading(true);
      setError(null);
      const result = await reportApi.getOutboundReport(
        targetPage,
        perPage,
        currentFilters?.startDate,
        currentFilters?.endDate
      );
      setItems(result.data);
      setPagination(result.pagination);
      setPage(result.pagination.current_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat laporan keluar');
    } finally {
      setLoading(false);
    }
  }, [perPage, appliedFilters]);

  const applyFilters = useCallback((newFilters: { startDate?: string; endDate?: string }) => {
    setAppliedFilters(newFilters);
    setPage(1);
    fetchReport(1, newFilters);
  }, [fetchReport]);

  useEffect(() => {
    fetchReport(page);
  }, [page, fetchReport]);

  return {
    items,
    pagination,
    page,
    setPage,
    loading,
    error,
    appliedFilters,
    applyFilters,
    refetch: () => fetchReport(page),
  };
}
