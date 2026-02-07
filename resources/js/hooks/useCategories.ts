import { useCallback, useState } from 'react';

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '@/api/categoryApi';
import type {
  Category,
  CreateCategoryPayload,
  PaginationMeta,
  UpdateCategoryPayload,
} from '@/types/warehouse';

/**
 * Hook untuk mengelola kategori
 * Menyediakan fungsi CRUD dengan state loading dan error handling
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  /**
   * Fetch daftar kategori - tanpa dependency problem
   */
  const fetchCategories = useCallback(async (targetPage: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCategories(targetPage, perPage);
      setCategories(result.data);
      setPagination(result.pagination);
      setPage(result.pagination.current_page);

      if (targetPage > 1 && result.data.length === 0 && result.pagination.total > 0) {
        await fetchCategories(targetPage - 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  /**
   * Fetch kategori spesifik
   */
  const fetchCategory = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      return await getCategory(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Buat kategori baru
   */
  const create = useCallback(async (payload: CreateCategoryPayload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createCategory(payload);
      await fetchCategories(1);
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat kategori');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  /**
   * Update kategori
   */
  const update = useCallback(
    async (id: number, payload: UpdateCategoryPayload) => {
      setLoading(true);
      setError(null);
      try {
        const result = await updateCategory(id, payload);
        await fetchCategories(page);
        return result.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal mengupdate kategori');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories, page],
  );

  /**
   * Hapus kategori
   */
  const remove = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteCategory(id);
      await fetchCategories(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus kategori');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, page]);

  return {
    categories,
    loading,
    error,
    pagination,
    page,
    setPage,
    fetchCategories,
    fetchCategory,
    create,
    update,
    remove,
  };
}
