import { useCallback, useEffect, useState } from 'react';
import * as snapshotApi from '@/api/snapshotApi';
import type { PaginationMeta, StockSnapshotItem, StockSnapshotSummary } from '@/types/warehouse';

/**
 * Hook untuk mengelola data stock snapshot
 */
export function useStockSnapshots() {
  const [periods, setPeriods] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [items, setItems] = useState<StockSnapshotItem[]>([]);
  const [summary, setSummary] = useState<StockSnapshotSummary | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const perPage = 10;

  const loadPeriods = useCallback(async () => {
    try {
      setError(null);
      const result = await snapshotApi.getSnapshotPeriods();
      const safePeriods = Array.isArray(result) ? result : [];
      setPeriods(safePeriods);
      if (!selectedPeriod && safePeriods.length > 0) {
        setSelectedPeriod(safePeriods[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat periode snapshot');
      setLoading(false);
    }
  }, [selectedPeriod]);

  const loadSnapshots = useCallback(async (period: string, targetPage = 1) => {
    try {
      setLoading(true);
      setError(null);
      const result = await snapshotApi.getSnapshotsByPeriod(period, targetPage, perPage);
      setItems(result.data);
      setSummary(result.summary);
      setPagination(result.pagination);
      setPage(result.pagination.current_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data snapshot');
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  const createSnapshot = async (period?: string) => {
    try {
      setIsCreating(true);
      setError(null); // Clear error sebelum mencoba create
      const targetPeriod = period ?? selectedPeriod;
      await snapshotApi.createSnapshot(targetPeriod || undefined);
      await loadPeriods();
      if (targetPeriod) {
        setSelectedPeriod(targetPeriod);
      }
      if (targetPeriod) {
        await loadSnapshots(targetPeriod);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal membuat snapshot';
      setError(errorMessage);
      // Auto clear error setelah 5 detik
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsCreating(false);
    }
  };

  const createPreviousMonthSnapshot = async () => {
    try {
      setIsCreating(true);
      setError(null); // Clear error sebelum mencoba create
      await snapshotApi.createPreviousMonthSnapshot();
      await loadPeriods();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal membuat snapshot bulan sebelumnya';
      setError(errorMessage);
      // Auto clear error setelah 5 detik
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    loadPeriods();
  }, [loadPeriods]);

  useEffect(() => {
    if (selectedPeriod) {
      loadSnapshots(selectedPeriod, page);
    }
  }, [selectedPeriod, page, loadSnapshots]);

  return {
    periods,
    selectedPeriod,
    setSelectedPeriod,
    items,
    summary,
    pagination,
    page,
    setPage,
    loading,
    isCreating,
    error,
    refresh: () => selectedPeriod && loadSnapshots(selectedPeriod, page),
    createSnapshot,
    createPreviousMonthSnapshot,
  };
}
