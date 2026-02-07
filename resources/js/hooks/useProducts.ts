import { useCallback, useState } from 'react';

import {
  createProduct,
  deleteProduct,
  getLowStockProducts,
  getProduct,
  getProducts,
  updateProduct,
} from '@/api/productApi';
import type {
  CreateProductPayload,
  PaginationMeta,
  Product,
  UpdateProductPayload,
} from '@/types/warehouse';

/**
 * Hook untuk mengelola produk
 * Menyediakan fungsi CRUD dengan state loading dan error handling
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  /**
   * Fetch daftar produk - tanpa dependency problem
   */
  const fetchProducts = useCallback(async (targetPage: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getProducts(targetPage, perPage);
      setProducts(result.data);
      setPagination(result.pagination);
      setPage(result.pagination.current_page);

      if (targetPage > 1 && result.data.length === 0 && result.pagination.total > 0) {
        await fetchProducts(targetPage - 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  /**
   * Fetch produk spesifik
   */
  const fetchProduct = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      return await getProduct(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch produk dengan stok rendah
   */
  const fetchLowStockProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await getLowStockProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Buat produk baru
   */
  const create = useCallback(
    async (payload: CreateProductPayload) => {
      setLoading(true);
      setError(null);
      try {
        const result = await createProduct(payload);
        await fetchProducts(1);
        return result.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal membuat produk');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts],
  );

  /**
   * Update produk
   */
  const update = useCallback(
    async (id: number, payload: UpdateProductPayload) => {
      setLoading(true);
      setError(null);
      try {
        const result = await updateProduct(id, payload);
        await fetchProducts(page);
        return result.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal mengupdate produk');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts, page],
  );

  /**
   * Hapus produk
   */
  const remove = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        await deleteProduct(id);
        await fetchProducts(page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal menghapus produk');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts, page],
  );

  return {
    products,
    loading,
    error,
    pagination,
    page,
    setPage,
    fetchProducts,
    fetchProduct,
    fetchLowStockProducts,
    create,
    update,
    remove,
  };
}
