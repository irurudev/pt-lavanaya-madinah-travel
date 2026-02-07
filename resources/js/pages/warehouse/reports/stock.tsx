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
  Grid,
  Card,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
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
  const { items, summary, pagination, page, setPage, loading, error } = useStockReport();
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');

  const filteredItems = items.filter((item) =>
    `${item.sku} ${item.name} ${item.category?.name || ''}`.toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  // Hitung statistik tambahan
  const totalValue = filteredItems.reduce((sum, item) => sum + item.stock_value, 0);
  const averageValue = filteredItems.length > 0 ? totalValue / filteredItems.length : 0;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await reportApi.downloadStockReport(exportFormat);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal mengunduh laporan stok';
      console.error(errorMsg);
      alert(errorMsg);
    } finally {
      setIsExporting(false);
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

        {/* Export Controls */}
        <Flex gap={4} flexWrap="wrap" align="flex-end" bg="white" p={4} rounded="lg" shadow="sm">
          <Box minW="120px">
            <Text fontSize="sm" fontWeight="semibold" mb={2}>Format</Text>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'csv' | 'pdf')}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                width: '100%',
                fontFamily: 'inherit',
              }}
            >
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
          </Box>
          <Button
            colorScheme="teal"
            onClick={handleExport}
            loading={isExporting}
            loadingText="Mengunduh..."
            size="sm"
            display="flex"
            gap={2}
            alignItems="center"
          >
            <FiDownload />
            Export {exportFormat.toUpperCase()}
          </Button>
        </Flex>

        {/* Summary Cards */}
        {summary && (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
            <Card.Root bg="white" shadow="md">
              <Card.Body>
                <Heading size="sm" color="gray.600" mb={2}>Total Produk</Heading>
                <Heading size="2xl" color="teal.600">{summary.total_products}</Heading>
              </Card.Body>
            </Card.Root>

            <Card.Root bg="white" shadow="md">
              <Card.Body>
                <Heading size="sm" color="gray.600" mb={2}>Stok Rendah</Heading>
                <Heading size="2xl" color="red.600">{summary.low_stock_count}</Heading>
              </Card.Body>
            </Card.Root>

            <Card.Root bg="white" shadow="md">
              <Card.Body>
                <Heading size="sm" color="gray.600" mb={2}>Total Nilai Stok</Heading>
                <Heading size="lg" color="green.600">
                  Rp{Math.round(summary.total_stock_value).toLocaleString('id-ID')}
                </Heading>
              </Card.Body>
            </Card.Root>
          </Grid>
        )}

        {/* Error Message */}
        {error && (
          <Box bg="red.50" border="1px" borderColor="red.200" p={4} rounded="md">
            <Text color="red.700" fontWeight="medium">{error}</Text>
          </Box>
        )}

        {/* Search */}
        <Box position="relative">
          <Input
            placeholder="Cari produk (SKU, nama, kategori)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="lg"
            paddingLeft="40px"
          />
          <FiSearch 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#cbd5e0',
              pointerEvents: 'none',
            }}
          />
        </Box>

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
                    <Box as="tr" key={item.id} borderBottom="1px" borderColor="gray.100">
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
