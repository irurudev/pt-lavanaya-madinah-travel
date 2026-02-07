import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
  Card,
  Badge,
} from '@chakra-ui/react';
import { FiCalendar, FiPlusCircle } from 'react-icons/fi';
import { PaginationControls } from '@/components/PaginationControls';
import { useStockSnapshots } from '@/hooks/useSnapshot';
import WarehouseLayout from '@/layouts/WarehouseLayout';
import { usePage } from '@inertiajs/react';

/**
 * Halaman laporan snapshot stok per periode
 */
export default function StockSnapshotPage() {
  const { props } = usePage();
  const user = (props.auth as Record<string, unknown>)?.user as Record<string, unknown> | undefined;
  const userRole = (user?.role as string) || '';
  const isViewer = userRole === 'viewer';

  const {
    periods,
    selectedPeriod,
    setSelectedPeriod,
    items,
    summary,
    pagination,
    page,
    setPage,
    loading,
    isCreating,
    error,
    createSnapshot,
    createPreviousMonthSnapshot,
  } = useStockSnapshots();

  return (
    <WarehouseLayout>
      <Stack gap={6}>
        {/* Header */}
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <Heading size="2xl">Stock Snapshot Report</Heading>
        </Flex>
        <Text color="gray.600" fontSize="sm">
          Snapshot stok pada titik waktu tertentu untuk audit dan perbandingan periode.
        </Text>

        {/* Controls */}
        <Flex gap={4} flexWrap="wrap" align="flex-end" bg="white" p={4} rounded="lg" shadow="sm">
          <Box flex={1} minW="220px">
            <Text fontSize="sm" fontWeight="semibold" mb={2}>Snapshot Period</Text>
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setPage(1);
                setSelectedPeriod(e.target.value);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                width: '100%',
                fontFamily: 'inherit',
              }}
            >
              {Array.isArray(periods) && periods.length > 0 ? (
                periods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))
              ) : (
                <option value="">No period available</option>
              )}
            </select>
          </Box>
          {/* Hide create buttons untuk viewer - mereka hanya bisa view dan export */}
          {!isViewer && (
            <>
              <Button
                colorScheme="teal"
                onClick={() => createSnapshot(selectedPeriod || undefined)}
                loading={isCreating}
                loadingText="Creating..."
                size="sm"
                display="flex"
                gap={2}
                alignItems="center"
              >
                <FiPlusCircle />
                Create Snapshot
              </Button>
              <Button
                variant="outline"
                colorScheme="teal"
                onClick={() => createPreviousMonthSnapshot()}
                loading={isCreating}
                loadingText="Creating..."
                size="sm"
                display="flex"
                gap={2}
                alignItems="center"
              >
                <FiCalendar />
                Previous Month
              </Button>
            </>
          )}
        </Flex>

        {/* Summary Cards */}
        {summary && (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
            <Card.Root bg="white" shadow="md">
              <Card.Body>
                <Heading size="sm" color="gray.600" mb={2}>Total Products</Heading>
                <Heading size="2xl" color="teal.600">{summary.total_products}</Heading>
              </Card.Body>
            </Card.Root>

            <Card.Root bg="white" shadow="md">
              <Card.Body>
                <Heading size="sm" color="gray.600" mb={2}>Total Stock Value</Heading>
                <Heading size="lg" color="green.600">
                  Rp{Math.round(summary.total_value).toLocaleString('id-ID')}
                </Heading>
              </Card.Body>
            </Card.Root>

            <Card.Root bg="white" shadow="md">
              <Card.Body>
                <Heading size="sm" color="gray.600" mb={2}>Average Closing Stock</Heading>
                <Heading size="2xl" color="blue.600">
                  {Math.round(summary.average_stock || 0)}
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

        {/* Content */}
        {loading ? (
          <Center py={8}>
            <Spinner size="xl" color="teal.500" />
          </Center>
        ) : items.length === 0 ? (
          <Box bg="blue.50" border="1px" borderColor="blue.200" p={4} rounded="md">
            <Text color="blue.700" fontWeight="medium">No snapshot data for this period.</Text>
          </Box>
        ) : (
          <Box bg="white" shadow="md" rounded="lg" p={6}>
            <Box overflowX="auto">
              <Box as="table" width="full" style={{ borderCollapse: 'collapse' }}>
                <Box as="thead">
                  <Box as="tr" borderBottom="2px" borderColor="gray.200">
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold" minWidth="50px">#</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Period</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">SKU</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Product</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Category</Box>
                    <Box as="th" textAlign="center" p={3} fontWeight="semibold">Closing Stock</Box>
                    <Box as="th" textAlign="right" p={3} fontWeight="semibold">Harga Beli</Box>
                    <Box as="th" textAlign="right" p={3} fontWeight="semibold">Snapshot Value</Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  {items.map((item, index) => (
                    <Box as="tr" key={item.id} borderBottom="1px" borderColor="gray.100">
                      <Box as="td" p={3} fontWeight="semibold">
                        {((page - 1) * 10) + (index + 1)}
                      </Box>
                      <Box as="td" p={3} fontSize="sm">{item.period}</Box>
                      <Box as="td" p={3} fontWeight="semibold">{item.product?.sku}</Box>
                      <Box as="td" p={3}>{item.product?.name}</Box>
                      <Box as="td" p={3}>{item.category?.name || '-'}</Box>
                      <Box as="td" p={3} textAlign="center">
                        <Badge colorScheme="blue">{item.closing_stock}</Badge>
                      </Box>
                      <Box as="td" p={3} textAlign="right">
                        Rp{Number(item.product?.buy_price || 0).toLocaleString('id-ID')}
                      </Box>
                      <Box as="td" p={3} textAlign="right" fontWeight="semibold">
                        Rp{Math.round(item.snapshot_value).toLocaleString('id-ID')}
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
