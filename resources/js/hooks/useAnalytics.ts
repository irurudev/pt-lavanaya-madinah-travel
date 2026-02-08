import { useEffect, useState, useCallback } from 'react';
import * as analyticsApi from '@/api/analyticsApi';
import type {
  FinancialMetrics,
  FastMover,
  SlowMover,
  TransactionTrend,
  CriticalAlert,
  CategoryPerformance,
  OperationalStats,
} from '@/types/warehouse';

/**
 * Hook untuk mengelola dashboard analytics
 */
export function useDashboardAnalytics() {
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics | null>(null);
  const [fastMovers, setFastMovers] = useState<FastMover[]>([]);
  const [slowMovers, setSlowMovers] = useState<SlowMover[]>([]);
  const [transactionTrends, setTransactionTrends] = useState<TransactionTrend[]>([]);
  const [criticalAlerts, setCriticalAlerts] = useState<CriticalAlert[]>([]);
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[]>([]);
  const [operationalStats, setOperationalStats] = useState<OperationalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [fm, fmov, smov, tt, ca, cp, os] = await Promise.all([
        analyticsApi.getFinancialMetrics(),
        analyticsApi.getFastMovers(10),
        analyticsApi.getSlowMovers(10),
        analyticsApi.getTransactionTrends(),
        analyticsApi.getCriticalAlerts(),
        analyticsApi.getCategoryPerformance(),
        analyticsApi.getOperationalStats(),
      ]);

      setFinancialMetrics(fm);
      setFastMovers(fmov);
      setSlowMovers(smov);
      setTransactionTrends(tt);
      setCriticalAlerts(ca);
      setCategoryPerformance(cp);
      setOperationalStats(os);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllAnalytics();
  }, [fetchAllAnalytics]);

  return {
    financialMetrics,
    fastMovers,
    slowMovers,
    transactionTrends,
    criticalAlerts,
    categoryPerformance,
    operationalStats,
    loading,
    error,
    refetch: fetchAllAnalytics,
  };
}

/**
 * Hook untuk fetch financial metrics saja
 */
export function useFinancialMetrics() {
  const [data, setData] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const result = await analyticsApi.getFinancialMetrics();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load financial metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

/**
 * Hook untuk fetch critical alerts
 */
export function useCriticalAlerts() {
  const [alerts, setAlerts] = useState<CriticalAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const result = await analyticsApi.getCriticalAlerts();
      setAlerts(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { alerts, loading, error, refetch: fetch };
}
