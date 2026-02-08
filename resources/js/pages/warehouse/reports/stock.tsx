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
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiDownload, FiSearch } from 'react-icons/fi';
import * as reportApi from '@/api/reportApi';
import { PaginationControls } from '@/components/PaginationControls';
import { useStockReport } from '@/hooks/useReport';
import WarehouseLayout from '@/layouts/WarehouseLayout';

/**
 * Halaman laporan stok barang
 * Menampilkan ringkasan dan detail stok semua produk
 */
export default function StockReportPage() {
  const { items, pagination, setPage, loading, error } = useStockReport();
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [currentFormat, setCurrentFormat] = useState<'csv' | 'pdf' | null>(null);

  const filteredItems = items.filter((item) =>
    `${item.sku} ${item.name} ${item.category?.name || ''}`.toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      setIsExporting(true);
      setCurrentFormat(format);
      await reportApi.downloadStockReport(format);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal mengunduh laporan stok';
      console.error(errorMsg);
      alert(errorMsg);
    } finally {
      setIsExporting(false);
      setCurrentFormat(null);
    }
  };

  return (
    <WarehouseLayout>
      <Stack gap={6}>
        {/* Header */}
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <Heading size="2xl">Laporan Stok Barang</Heading>
        </Flex>
        <Text color="gray.600" fontSize="sm">
          Posisi stok saat ini untuk tiap produk, termasuk nilai stok dan status stok rendah.
        </Text>

        {/* Error Message */}
        {error && (
          <Box bg="red.50" border="1px" borderColor="red.200" p={4} rounded="md">
            <Text color="red.700" fontWeight="medium">{error}</Text>
          </Box>
        )}

        {/* Search & Export Row */}
        <Flex gap={4} flexWrap="wrap" align="flex-end" bg="white" p={4} rounded="lg" shadow="sm">
          <Box flex={1} minW="300px" position="relative">
            <Text fontSize="sm" fontWeight="semibold" mb={2}>Cari Produk</Text>
            <Input
              placeholder="SKU, nama, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              paddingLeft="40px"
            />
            <FiSearch 
              style={{
                position: 'absolute',
                left: '12px',
                bottom: '12px',
                color: '#cbd5e0',
                pointerEvents: 'none',
              }}
            />
          </Box>
          <Flex gap={2}>
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={() => handleExport('csv')}
              loading={isExporting && currentFormat === 'csv'}
              size="sm"
              display="flex"
              gap={2}
              alignItems="center"
            >
              <FiDownload />
              CSV
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              onClick={() => handleExport('pdf')}
              loading={isExporting && currentFormat === 'pdf'}
              size="sm"
              display="flex"
              gap={2}
              alignItems="center"
            >
              <FiDownload />
              PDF
            </Button>
          </Flex>
        </Flex>

        {/* Loading */}
        {loading ? (
          <Center py={8}>
            <Spinner size="xl" color="teal.500" />
          </Center>
        ) : filteredItems.length === 0 ? (
          <Box bg="blue.50" border="1px" borderColor="blue.200" p={4} rounded="md">
            <Text color="blue.700" fontWeight="medium">
              {searchQuery
                ? 'Tidak ada produk yang sesuai dengan pencarian.'
                : 'Belum ada data laporan stok.'}
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
                    <Box as="th" textAlign="right" p={3} fontWeight="semibold">Nilai Stok</Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  {filteredItems.map((item, index) => (
                    <Box 
                      as="tr" 
                      key={item.id} 
                      borderBottom="1px" 
                      borderColor="gray.100"
                      bg={item.is_low_stock ? 'red.50' : 'transparent'}
                      _hover={{ bg: item.is_low_stock ? 'red.100' : 'gray.50' }}
                    >
                      <Box as="td" p={3} fontWeight="semibold">
                        {((pagination?.current_page || 1) - 1) * (pagination?.per_page || 10) + (index + 1)}
                      </Box>
                      <Box as="td" p={3} fontWeight="semibold">{item.sku}</Box>
                      <Box as="td" p={3}>{item.name}</Box>
                      <Box as="td" p={3}>{item.category?.name}</Box>
                      <Box as="td" p={3} textAlign="center">
                        <Badge
                          colorScheme={item.is_low_stock ? 'red' : 'green'}
                        >
                          {item.stock}
                        </Badge>
                      </Box>
                      <Box as="td" p={3} textAlign="center">{item.min_stock}</Box>
                      <Box as="td" p={3} textAlign="right">
                        Rp{Number(item.buy_price).toLocaleString('id-ID')}
                      </Box>
                      <Box as="td" p={3} textAlign="right" fontWeight="semibold">
                        Rp{Math.round(item.stock_value).toLocaleString('id-ID')}
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
