import axios from '@/lib/axios';
import type { PaginationMeta, StockSnapshotItem, StockSnapshotSummary } from '@/types/warehouse';

/**
 * Mendapatkan daftar periode snapshot
 */
export async function getSnapshotPeriods(): Promise<string[]> {
  const { data } = await axios.get('/snapshots/periods');
  return Array.isArray(data.periods) ? data.periods : [];
}

/**
 * Mendapatkan snapshot berdasarkan periode
 */
export async function getSnapshotsByPeriod(
  period: string,
  page = 1,
  perPage = 10,
): Promise<{
  data: StockSnapshotItem[];
  summary: StockSnapshotSummary;
  pagination: PaginationMeta;
}> {
  const { data } = await axios.get(`/snapshots/period/${period}`, {
    params: { page, per_page: perPage },
  });
  return {
    data: data.data,
    summary: data.summary,
    pagination: data.pagination,
  };
}

/**
 * Membuat snapshot untuk periode tertentu
 */
export async function createSnapshot(period?: string): Promise<StockSnapshotItem[]> {
  const payload = period ? { period } : {};
  try {
    const { data } = await axios.post('/snapshots', payload);
    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

/**
 * Membuat snapshot untuk bulan sebelumnya
 */
export async function createPreviousMonthSnapshot(): Promise<StockSnapshotItem[]> {
  try {
    const { data } = await axios.post('/snapshots/previous-month');
    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}
