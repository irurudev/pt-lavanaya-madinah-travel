import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Badge,
  Spinner,
  Center,
  Stack,
} from '@chakra-ui/react';
import { FiPackage, FiLayers, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
import WarehouseLayout from '@/layouts/WarehouseLayout';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types/warehouse';

/**
 * Dashboard halaman untuk menampilkan ringkasan warehouse
 * Menampilkan statistik stok, produk dengan stok rendah, dll
 */
export default function DashboardPage() {
  const { products, fetchProducts, fetchLowStockProducts } = useProducts();
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchProducts(1);
        const lowStock = await fetchLowStockProducts();
        if (lowStock) {
          setLowStockProducts(Array.isArray(lowStock) ? lowStock : []);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchProducts, fetchLowStockProducts]);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const averageStock = totalProducts > 0 ? Math.round(totalStock / totalProducts) : 0;

  if (loading) {
    return (
      <WarehouseLayout>
        <Center h="400px">
          <Spinner size="xl" color="teal.500" />
        </Center>
      </WarehouseLayout>
    );
  }

  return (
    <WarehouseLayout>
      <Stack gap={6}>
        <Heading size="2xl">Dashboard Warehouse</Heading>

        {/* Statistik Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
          <Box bg="teal.500" color="white" shadow="md" rounded="lg" p={6}>
            <Stack gap={2}>
              <Text fontSize="sm" display="flex" alignItems="center" gap={2}>
                <FiPackage /> Total Produk
              </Text>
              <Text fontSize="3xl" fontWeight="bold">
                {totalProducts}
              </Text>
            </Stack>
          </Box>

          <Box bg="green.500" color="white" shadow="md" rounded="lg" p={6}>
            <Stack gap={2}>
              <Text fontSize="sm" display="flex" alignItems="center" gap={2}>
                <FiLayers /> Total Stok
              </Text>
              <Text fontSize="3xl" fontWeight="bold">
                {totalStock.toLocaleString('id-ID')}
              </Text>
            </Stack>
          </Box>

          <Box bg="blue.500" color="white" shadow="md" rounded="lg" p={6}>
            <Stack gap={2}>
              <Text fontSize="sm" display="flex" alignItems="center" gap={2}>
                <FiTrendingUp /> Rata-rata Stok
              </Text>
              <Text fontSize="3xl" fontWeight="bold">
                {averageStock}
              </Text>
            </Stack>
          </Box>

          <Box bg="orange.500" color="white" shadow="md" rounded="lg" p={6}>
            <Stack gap={2}>
              <Text fontSize="sm" display="flex" alignItems="center" gap={2}>
                <FiAlertTriangle /> Stok Rendah
              </Text>
              <Text fontSize="3xl" fontWeight="bold">
                {lowStockProducts.length}
              </Text>
            </Stack>
          </Box>
        </Grid>

        {/* Produk dengan Stok Rendah */}
        <Box bg="white" shadow="md" rounded="lg" p={6}>
          <Heading size="lg" mb={4}>⚠️ Produk Dengan Stok Rendah</Heading>
          {lowStockProducts.length === 0 ? (
            <Box bg="green.50" border="1px" borderColor="green.200" p={4} rounded="md">
              <Text color="green.700" fontWeight="medium">Semua produk memiliki stok yang cukup</Text>
            </Box>
          ) : (
            <Box overflowX="auto">
              <Box as="table" width="full" style={{ borderCollapse: 'collapse' }}>
                <Box as="thead">
                  <Box as="tr" borderBottom="2px" borderColor="gray.200">
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">SKU</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Nama Produk</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Stok Saat Ini</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Stok Minimal</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Kekurangan</Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  {lowStockProducts.map((product) => (
                    <Box as="tr" key={product.id} borderBottom="1px" borderColor="gray.100">
                      <Box as="td" p={3} fontWeight="bold">{product.sku}</Box>
                      <Box as="td" p={3}>{product.name}</Box>
                      <Box as="td" p={3}>
                        <Badge colorScheme="red">{product.stock}</Badge>
                      </Box>
                      <Box as="td" p={3}>{product.min_stock}</Box>
                      <Box as="td" p={3} fontWeight="bold">
                        {product.min_stock - product.stock}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Top 5 Produk Terbanyak */}
        <Box bg="white" shadow="md" rounded="lg" p={6}>
          <Heading size="lg" mb={4}>📊 Top 5 Produk Dengan Stok Terbanyak</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }} gap={4}>
            {products
              .sort((a, b) => b.stock - a.stock)
              .slice(0, 5)
              .map((product) => (
                <Box key={product.id} bg="gray.50" shadow="sm" rounded="lg" p={4}>
                  <Text fontSize="xs" color="gray.600">{product.sku}</Text>
                  <Text fontWeight="bold" fontSize="sm" mt={1}>{product.name}</Text>
                  <Box borderTop="1px" borderColor="gray.200" my={2} />
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">
                    {product.stock}
                  </Text>
                  <Text fontSize="xs" color="gray.600">unit tersedia</Text>
                </Box>
              ))}
          </Grid>
        </Box>

        {/* Informasi Sistem */}
        <Box bg="blue.50" border="1px" borderColor="blue.200" p={4} rounded="md">
          <Text fontWeight="bold" color="blue.700" mb={2}>ℹ️ Informasi Sistem</Text>
          <Text fontSize="sm" color="blue.700">
            Sistem warehouse ini dirancang untuk manajemen stok real-time dengan
            validasi ketat untuk mencegah stok minus.
          </Text>
          <Box as="ul" mt={2} pl={6} fontSize="sm" color="blue.700">
            <li>Setiap transaksi tercatat dengan operator dan timestamp</li>
            <li>Stok tidak bisa menjadi negatif saat pengeluaran barang</li>
            <li>Sistem memberikan alert untuk produk dengan stok di bawah minimum</li>
            <li>History transaksi lengkap untuk audit dan reporting</li>
          </Box>
        </Box>
      </Stack>
    </WarehouseLayout>
  );
}
