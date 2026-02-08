/**
 * API Client untuk Dashboard Analytics
 */

import axios from 'axios';
import type {
  FinancialMetrics,
  FastMover,
  SlowMover,
  TransactionTrend,
  CriticalAlert,
  CategoryPerformance,
  OperationalStats,
} from '@/types/warehouse';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Mendapatkan financial metrics
 */
export async function getFinancialMetrics(): Promise<FinancialMetrics> {
  try {
    const response = await api.get('/reports/analytics/financial');
    return response.data.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch financial metrics');
  }
}

/**
 * Mendapatkan fast movers (top outbound 30 hari)
 */
export async function getFastMovers(limit: number = 10): Promise<FastMover[]> {
  try {
    const response = await api.get('/reports/analytics/fast-movers', {
      params: { limit },
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch fast movers');
  }
}

/**
 * Mendapatkan slow movers (dead stock)
 */
export async function getSlowMovers(limit: number = 10): Promise<SlowMover[]> {
  try {
    const response = await api.get('/reports/analytics/slow-movers', {
      params: { limit },
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch slow movers');
  }
}

/**
 * Mendapatkan transaction trends (30 hari daily)
 */
export async function getTransactionTrends(): Promise<TransactionTrend[]> {
  try {
    const response = await api.get('/reports/analytics/transaction-trends');
    return response.data.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch transaction trends');
  }
}

/**
 * Mendapatkan critical alerts
 */
export async function getCriticalAlerts(): Promise<CriticalAlert[]> {
  try {
    const response = await api.get('/reports/analytics/critical-alerts');
    return response.data.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch critical alerts');
  }
}

/**
 * Mendapatkan category performance
 */
export async function getCategoryPerformance(): Promise<CategoryPerformance[]> {
  try {
    const response = await api.get('/reports/analytics/category-performance');
    return response.data.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch category performance');
  }
}

/**
 * Mendapatkan operational statistics
 */
export async function getOperationalStats(): Promise<OperationalStats> {
  try {
    const response = await api.get('/reports/analytics/operational-stats');
    return response.data.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch operational stats');
  }
}
