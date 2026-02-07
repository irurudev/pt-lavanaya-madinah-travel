import {
  Box,
  Button,
  Heading,
  Stack,
  Flex,
  Spinner,
  Center,
  Text,
  Badge,
  Grid,
  Card,
  Tabs,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import * as reportApi from '@/api/reportApi';
import { PaginationControls } from '@/components/PaginationControls';
import { useTransactionReport, useInboundReport, useOutboundReport } from '@/hooks/useReport';
import WarehouseLayout from '@/layouts/WarehouseLayout';
import type { TransactionReportItem, TransactionReportPagination } from '@/types/warehouse';

/**
 * Komponen tabel laporan transaksi
 */
function TransactionReportTable({
  items,
  loading,
  error,
  pagination,
  onPageChange,
}: {
  items: TransactionReportItem[];
  loading: boolean;
  error: string | null;
  pagination: TransactionReportPagination | null;
  onPageChange: (page: number) => void;
}) {
  if (error) {
    return (
      <Box bg="red.50" border="1px" borderColor="red.200" p={4} rounded="md">
        <Text color="red.700" fontWeight="medium">{error}</Text>
      </Box>
    );
  }

  if (loading) {
    return (
      <Center py={8}>
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  if (items.length === 0) {
    return (
      <Box bg="blue.50" border="1px" borderColor="blue.200" p={4} rounded="md">
        <Text color="blue.700" fontWeight="medium">Belum ada data laporan transaksi.</Text>
      </Box>
    );
  }

  return (
    <Box bg="white" shadow="md" rounded="lg" p={6}>
      <Box overflowX="auto">
        <Box as="table" width="full" style={{ borderCollapse: 'collapse' }}>
          <Box as="thead">
            <Box as="tr" borderBottom="2px" borderColor="gray.200">
              <Box as="th" textAlign="left" p={3} fontWeight="semibold" minWidth="50px">#</Box>
              <Box as="th" textAlign="left" p={3} fontWeight="semibold">Tanggal</Box>
              <Box as="th" textAlign="left" p={3} fontWeight="semibold">SKU</Box>
              <Box as="th" textAlign="left" p={3} fontWeight="semibold">Nama Produk</Box>
              <Box as="th" textAlign="left" p={3} fontWeight="semibold">Kategori</Box>
              <Box as="th" textAlign="center" p={3} fontWeight="semibold">Jumlah</Box>
              <Box as="th" textAlign="right" p={3} fontWeight="semibold">Harga Unit</Box>
              <Box as="th" textAlign="right" p={3} fontWeight="semibold">Total</Box>
              <Box as="th" textAlign="left" p={3} fontWeight="semibold">User</Box>
            </Box>
          </Box>
          <Box as="tbody">
            {items.map((item, index) => (
              <Box as="tr" key={item.id} borderBottom="1px" borderColor="gray.100">
                <Box as="td" p={3} fontWeight="semibold">
                  {((pagination?.current_page || 1) - 1) * (pagination?.per_page || 10) + (index + 1)}
                </Box>
                <Box as="td" p={3} fontSize="sm">
                  {new Date(item.created_at).toLocaleDateString('id-ID')}
                </Box>
                <Box as="td" p={3} fontWeight="semibold">{item.product.sku}</Box>
                <Box as="td" p={3}>{item.product.name}</Box>
                <Box as="td" p={3}>{item.product.category}</Box>
                <Box as="td" p={3} textAlign="center">
                  <Badge colorScheme="blue">{item.quantity}</Badge>
                </Box>
                <Box as="td" p={3} textAlign="right">
                  Rp{Number(item.price_at_transaction).toLocaleString('id-ID')}
                </Box>
                <Box as="td" p={3} textAlign="right" fontWeight="semibold">
                  Rp{Math.round(item.total_value).toLocaleString('id-ID')}
                </Box>
                <Box as="td" p={3} fontSize="sm">{item.user.name}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {pagination && (
        <PaginationControls
          pagination={pagination}
          onPageChange={onPageChange}
        />
      )}
    </Box>
  );
}

/**
 * Halaman laporan transaksi masuk & keluar
 */
export default function TransactionReportPage() {
  const transactionReport = useTransactionReport();
  const inboundReport = useInboundReport();
  const outboundReport = useOutboundReport();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExport = async () => {
    try {
      setIsExporting(true);
      if (exportType === 'all') {
        await reportApi.downloadTransactionReport(undefined, exportFormat, startDate || undefined, endDate || undefined);
      } else {
        await reportApi.downloadTransactionReport(exportType === 'in' ? 'in' : 'out', exportFormat, startDate || undefined, endDate || undefined);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal mengunduh laporan transaksi';
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
          <Heading size="2xl">Laporan Mutasi Stok</Heading>
        </Flex>
        <Text color="gray.600" fontSize="sm">
          Riwayat pergerakan stok (masuk dan keluar) pada rentang tanggal yang dipilih.
        </Text>

        {/* Export Controls */}
        <Flex gap={4} flexWrap="wrap" align="flex-end" bg="white" p={4} rounded="lg" shadow="sm">
          <Box flex={1} minW="200px">
            <Text fontSize="sm" fontWeight="semibold" mb={2}>Dari Tanggal</Text>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                width: '100%',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </Box>
          <Box flex={1} minW="200px">
            <Text fontSize="sm" fontWeight="semibold" mb={2}>Hingga Tanggal</Text>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                width: '100%',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </Box>
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
                boxSizing: 'border-box',
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
        {transactionReport.summary && (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
            <Card.Root bg="white" shadow="md">
              <Card.Body>
                <Heading size="sm" color="gray.600" mb={2}>Total Barang Masuk</Heading>
                <Heading size="2xl" color="green.600">
                  {transactionReport.summary.inbound_total} unit
                </Heading>
              </Card.Body>
            </Card.Root>

            <Card.Root bg="white" shadow="md">
              <Card.Body>
                <Heading size="sm" color="gray.600" mb={2}>Total Barang Keluar</Heading>
                <Heading size="2xl" color="red.600">
                  {transactionReport.summary.outbound_total} unit
                </Heading>
              </Card.Body>
            </Card.Root>
          </Grid>
        )}

        {/* Tabs */}
        <Tabs.Root defaultValue="all">
          <Tabs.List bg="white" rounded="lg" shadow="sm" p={0} border="1px" borderColor="gray.200">
            <Tabs.Trigger value="all" fontWeight="semibold" px={6} py={3}>
              Semua Transaksi
            </Tabs.Trigger>
            <Tabs.Trigger value="inbound" fontWeight="semibold" px={6} py={3}>
              Barang Masuk (In)
            </Tabs.Trigger>
            <Tabs.Trigger value="outbound" fontWeight="semibold" px={6} py={3}>
              Barang Keluar (Out)
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="all" pt={6}>
            <TransactionReportTable
              items={transactionReport.items}
              loading={transactionReport.loading}
              error={transactionReport.error}
              pagination={transactionReport.pagination}
              onPageChange={(nextPage) => transactionReport.setPage(nextPage)}
            />
          </Tabs.Content>

          <Tabs.Content value="inbound" pt={6}>
            <TransactionReportTable
              items={inboundReport.items}
              loading={inboundReport.loading}
              error={inboundReport.error}
              pagination={inboundReport.pagination}
              onPageChange={(nextPage) => inboundReport.setPage(nextPage)}
            />
          </Tabs.Content>

          <Tabs.Content value="outbound" pt={6}>
            <TransactionReportTable
              items={outboundReport.items}
              loading={outboundReport.loading}
              error={outboundReport.error}
              pagination={outboundReport.pagination}
              onPageChange={(nextPage) => outboundReport.setPage(nextPage)}
            />
          </Tabs.Content>
        </Tabs.Root>
      </Stack>
    </WarehouseLayout>
  );
}
