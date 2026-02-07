import axios from '@/lib/axios';
import type {
  ApiResponse,
  Category,
  CreateCategoryPayload,
  PaginationMeta,
  UpdateCategoryPayload,
} from '@/types/warehouse';

/**
 * Mendapatkan daftar semua kategori
 */
export async function getCategories(page = 1, perPage = 10): Promise<{
  data: Category[];
  pagination: PaginationMeta;
}> {
  const { data } = await axios.get('/categories', {
    params: { page, per_page: perPage },
  });
  return {
    data: data.data,
    pagination: data.pagination,
  };
}

/**
 * Mendapatkan detail kategori spesifik
 */
export async function getCategory(id: number): Promise<Category> {
  const { data } = await axios.get(`/categories/${id}`);
  return data.data;
}

/**
 * Membuat kategori baru
 */
export async function createCategory(
  payload: CreateCategoryPayload,
): Promise<ApiResponse<Category>> {
  const { data } = await axios.post('/categories', payload);
  return data;
}

/**
 * Mengupdate kategori
 */
export async function updateCategory(
  id: number,
  payload: UpdateCategoryPayload,
): Promise<ApiResponse<Category>> {
  const { data } = await axios.put(`/categories/${id}`, payload);
  return data;
}

/**
 * Menghapus kategori
 */
export async function deleteCategory(id: number): Promise<ApiResponse<void>> {
  const { data } = await axios.delete(`/categories/${id}`);
  return data;
}
