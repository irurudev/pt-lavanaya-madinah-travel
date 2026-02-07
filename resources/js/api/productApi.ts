import axios from '@/lib/axios';
import type {
  ApiResponse,
  CreateProductPayload,
  PaginationMeta,
  Product,
  UpdateProductPayload,
} from '@/types/warehouse';

/**
 * Mendapatkan daftar semua produk
 */
export async function getProducts(page = 1, perPage = 10): Promise<{
  data: Product[];
  pagination: PaginationMeta;
}> {
  const { data } = await axios.get('/products', {
    params: { page, per_page: perPage },
  });
  return {
    data: data.data,
    pagination: data.pagination,
  };
}

/**
 * Mendapatkan detail produk spesifik
 */
export async function getProduct(id: number): Promise<Product> {
  const { data } = await axios.get(`/products/${id}`);
  return data.data;
}

/**
 * Mendapatkan produk dengan stok rendah (di bawah min_stock)
 */
export async function getLowStockProducts(): Promise<Product[]> {
  const { data } = await axios.get('/products/low-stock');
  return data.data;
}

/**
 * Membuat produk baru
 */
export async function createProduct(
  payload: CreateProductPayload,
): Promise<ApiResponse<Product>> {
  const { data } = await axios.post('/products', payload);
  return data;
}

/**
 * Mengupdate produk
 */
export async function updateProduct(
  id: number,
  payload: UpdateProductPayload,
): Promise<ApiResponse<Product>> {
  const { data } = await axios.put(`/products/${id}`, payload);
  return data;
}

/**
 * Menghapus produk
 */
export async function deleteProduct(id: number): Promise<ApiResponse<void>> {
  const { data } = await axios.delete(`/products/${id}`);
  return data;
}
