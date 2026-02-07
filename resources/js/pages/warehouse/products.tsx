import {
  Box,
  Button,
  Heading,
  Stack,
  Flex,
  Spinner,
  Center,
  Text,
  Input,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { PaginationControls } from '@/components/PaginationControls';
import { ProductForm } from '@/components/ProductForm';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import WarehouseLayout from '@/layouts/WarehouseLayout';
import type { Product } from '@/types/warehouse';

/**
 * Halaman untuk mengelola produk
 * CRUD operations untuk master data produk
 */
export default function ProductsPage() {
  const {
    products,
    loading,
    error,
    pagination,
    page,
    setPage,
    fetchProducts,
    create,
    update,
    remove,
  } = useProducts();
  const {
    categories,
    fetchCategories,
  } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  useEffect(() => {
    fetchCategories(1);
  }, [fetchCategories]);

  const filteredProducts = products.filter((product) =>
    `${product.sku} ${product.name} ${product.category?.name || ''}`.toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await remove(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Gagal menghapus produk');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  return (
    <WarehouseLayout>
      <Stack gap={6}>
        <Flex justify="space-between" align="center">
          <Heading size="2xl">Kelola Produk</Heading>
          <Button
            colorScheme="teal"
            onClick={() => {
              setSelectedProduct(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? 'Batal' : 'Tambah Produk'}
          </Button>
        </Flex>

        {showForm && (
          <Box bg="white" shadow="md" rounded="lg" p={6}>
            <Heading size="lg" mb={4}>
              {selectedProduct ? 'Edit Produk' : 'Buat Produk Baru'}
            </Heading>
            <ProductForm
              initialData={selectedProduct || undefined}
              onSuccess={handleFormClose}
              categories={categories}
              onCreateProduct={create}
              onUpdateProduct={update}
              isLoading={loading}
              apiError={error}
            />
          </Box>
        )}

        {error && (
          <Box bg="red.50" border="1px" borderColor="red.200" p={4} rounded="md">
            <Text color="red.700" fontWeight="medium">{error}</Text>
          </Box>
        )}

        <Box>
          <Input
            placeholder="Cari produk (SKU, nama, kategori)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="lg"
          />
        </Box>

        {loading ? (
          <Center py={8}>
            <Spinner size="xl" color="teal.500" />
          </Center>
        ) : filteredProducts.length === 0 ? (
          <Box bg="blue.50" border="1px" borderColor="blue.200" p={4} rounded="md">
            <Text color="blue.700" fontWeight="medium">
              {searchQuery
                ? 'Tidak ada produk yang sesuai dengan pencarian.'
                : 'Belum ada produk. Silakan buat produk baru.'}
            </Text>
          </Box>
        ) : (
          <Box bg="white" shadow="md" rounded="lg" p={6}>
            <Box overflowX="auto">
              <Box as="table" width="full" style={{ borderCollapse: 'collapse' }}>
                <Box as="thead">
                  <Box as="tr" borderBottom="2px" borderColor="gray.200">
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold" minWidth="50px">#</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">SKU</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Nama Produk</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Kategori</Box>
                    <Box as="th" textAlign="center" p={3} fontWeight="semibold">Stok</Box>
                    <Box as="th" textAlign="center" p={3} fontWeight="semibold">Min Stok</Box>
                    <Box as="th" textAlign="right" p={3} fontWeight="semibold">Harga Beli</Box>
                    <Box as="th" textAlign="right" p={3} fontWeight="semibold">Harga Jual</Box>
                    <Box as="th" textAlign="right" p={3} fontWeight="semibold">Aksi</Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  {filteredProducts.map((product, index) => (
                    <Box as="tr" key={product.id} borderBottom="1px" borderColor="gray.100">
                      <Box as="td" p={3}>{((page - 1) * 10) + (index + 1)}</Box>
                      <Box as="td" p={3}>{product.sku}</Box>
                      <Box as="td" p={3}>
                        <Text fontWeight="semibold">{product.name}</Text>
                      </Box>
                      <Box as="td" p={3}>{product.category?.name}</Box>
                      <Box as="td" p={3} textAlign="center">
                        <Badge
                          colorScheme={product.is_low_stock ? 'red' : 'green'}
                        >
                          {product.stock}
                        </Badge>
                      </Box>
                      <Box as="td" p={3} textAlign="center">{product.min_stock}</Box>
                      <Box as="td" p={3} textAlign="right">
                        Rp{Number(product.buy_price).toLocaleString('id-ID')}
                      </Box>
                      <Box as="td" p={3} textAlign="right">
                        Rp{Number(product.sell_price).toLocaleString('id-ID')}
                      </Box>
                      <Box as="td" p={3} textAlign="right">
                        <Flex gap={2} justify="flex-end">
                          <IconButton
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            aria-label="Edit produk"
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowForm(true);
                            }}
                          >
                            <FiEdit2 />
                          </IconButton>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            aria-label="Hapus produk"
                            onClick={() => handleDelete(product.id)}
                          >
                            <FiTrash2 />
                          </IconButton>
                        </Flex>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {pagination && (
              <PaginationControls
                pagination={pagination}
                onPageChange={(nextPage) => setPage(nextPage)}
              />
            )}
          </Box>
        )}
      </Stack>
    </WarehouseLayout>
  );
}
