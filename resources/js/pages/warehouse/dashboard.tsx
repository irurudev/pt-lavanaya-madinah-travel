import {
  Box,
  Heading,
  Text,
  Badge,
  Spinner,
  Center,
  Stack,
  SimpleGrid,
  HStack,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  FiPackage,
  FiTrendingUp,
  FiAlertTriangle,
  FiDollarSign,
  FiPieChart,
  FiArrowUp,
  FiArrowDown,
  FiZap,
  FiBarChart2,
  FiUsers,
  FiTrendingDown,
} from 'react-icons/fi';
import { useDashboardAnalytics } from '@/hooks/useAnalytics';
import { useProducts } from '@/hooks/useProducts';
import WarehouseLayout from '@/layouts/WarehouseLayout';

/**
 * Dashboard halaman dengan analytics yang comprehensive
 * Menampilkan financial metrics, trends, movers, alerts, dan operational stats
 */
export default function DashboardPage() {
  const {
    financialMetrics,
    fastMovers,
    slowMovers,
    criticalAlerts,
    categoryPerformance,
    operationalStats,
    loading,
  } = useDashboardAnalytics();

  const { products, fetchLowStockProducts } = useProducts();
  const [lowStockProducts, setLowStockProducts] = useState(0);

  useEffect(() => {
    const loadLowStock = async () => {
      const lowStock = await fetchLowStockProducts();
      if (lowStock) {
        setLowStockProducts(Array.isArray(lowStock) ? lowStock.length : 0);
      }
    };
    loadLowStock();
  }, [fetchLowStockProducts]);

  const cardBg = 'white';
  const borderColor = 'gray.200';

  if (loading) {
    return (
      <WarehouseLayout>
        <Center h="400px">
          <Spinner size="xl" color="teal.500" />
        </Center>
      </WarehouseLayout>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <WarehouseLayout>
      <Stack gap={6}>
        <Heading size="2xl">🎯 Dashboard Warehouse Intelligence</Heading>

        {/* SECTION 1: FINANCIAL METRICS */}
        <Box bg={cardBg} shadow="md" rounded="lg" p={6} border="1px" borderColor={borderColor}>
          <Heading size="lg" mb={6}>💰 Financial Overview</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
            <Box bg="teal.50" rounded="lg" p={4} border="1px" borderColor="teal.200">
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" color="teal.700" fontWeight="medium">
                  Total Inventory Value
                </Text>
                <Icon as={FiDollarSign} color="teal.500" boxSize={5} />
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="teal.900">
                {financialMetrics ? formatCurrency(financialMetrics.total_inventory_value) : '-'}
              </Text>
              <Text fontSize="xs" color="teal.600">Nilai stok saat ini</Text>
            </Box>

            <Box bg="green.50" rounded="lg" p={4} border="1px" borderColor="green.200">
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" color="green.700" fontWeight="medium">
                  Potential Revenue
                </Text>
                <Icon as={FiTrendingUp} color="green.500" boxSize={5} />
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="green.900">
                {financialMetrics ? formatCurrency(financialMetrics.potential_revenue) : '-'}
              </Text>
              <Text fontSize="xs" color="green.600">Jika semua stok terjual</Text>
            </Box>

            <Box bg="blue.50" rounded="lg" p={4} border="1px" borderColor="blue.200">
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" color="blue.700" fontWeight="medium">
                  Potential Profit
                </Text>
                <Icon as={FiZap} color="blue.500" boxSize={5} />
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="blue.900">
                {financialMetrics ? formatCurrency(financialMetrics.potential_gross_profit) : '-'}
              </Text>
              <Text fontSize="xs" color="blue.600">Gross profit potensial</Text>
            </Box>

            <Box bg="purple.50" rounded="lg" p={4} border="1px" borderColor="purple.200">
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" color="purple.700" fontWeight="medium">
                  Avg Transaction
                </Text>
                <Icon as={FiBarChart2} color="purple.500" boxSize={5} />
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="purple.900">
                {financialMetrics ? formatCurrency(financialMetrics.average_transaction_value) : '-'}
              </Text>
              <Text fontSize="xs" color="purple.600">Rata-rata transaksi 30 hari</Text>
            </Box>
          </SimpleGrid>
        </Box>

        {/* SECTION 2: CRITICAL ALERTS */}
        {criticalAlerts && criticalAlerts.length > 0 && (
          <Box bg={cardBg} shadow="md" rounded="lg" p={6} border="1px" borderColor={borderColor}>
            <Heading size="lg" mb={4}>
              🚨 Critical Alerts ({criticalAlerts.length})
            </Heading>
            <Stack gap={3}>
              {criticalAlerts.slice(0, 8).map((alert) => {
                const bgColor = alert.severity === 'danger' ? 'red.50' : alert.severity === 'warning' ? 'orange.50' : 'blue.50';
                const borderColorAlert = alert.severity === 'danger' ? 'red.200' : alert.severity === 'warning' ? 'orange.200' : 'blue.200';
                const textColor = alert.severity === 'danger' ? 'red.700' : alert.severity === 'warning' ? 'orange.700' : 'blue.700';
                
                return (
                  <Box
                    key={alert.id}
                    bg={bgColor}
                    border="1px"
                    borderColor={borderColorAlert}
                    rounded="lg"
                    p={3}
                    borderLeft="4px"
                  >
                    <Text fontWeight="bold" fontSize="sm" color={textColor} mb={1}>
                      {alert.title}
                    </Text>
                    <Text fontSize="xs" color={textColor}>
                      {alert.message}
                    </Text>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        )}

        {/* SECTION 3: FAST & SLOW MOVERS */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
          <Box bg={cardBg} shadow="md" rounded="lg" p={6} border="1px" borderColor={borderColor}>
            <Heading size="lg" mb={4} display="flex" alignItems="center" gap={2}>
              <Icon as={FiArrowUp} color="green.500" /> Top 10 Fast Movers
            </Heading>
            <Box maxH="400px" overflowY="auto">
              <VStack gap={3} align="stretch">
                {fastMovers && fastMovers.length > 0 ? (
                  fastMovers.map((product) => (
                  <Box key={product.id} bg="green.50" p={3} rounded="md" border="1px" borderColor="green.200">
                    <HStack justify="space-between" mb={1}>
                      <VStack align="start" gap={0}>
                        <Text fontWeight="bold" fontSize="sm">
                          {product.name}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          SKU: {product.sku}
                        </Text>
                      </VStack>
                      <Badge colorScheme="green">{product.total_outbound} unit</Badge>
                    </HStack>
                  </Box>
                  ))
                ) : (
                  <Text color="gray.500" fontSize="sm">
                    Tidak ada data
                  </Text>
                )}
              </VStack>
            </Box>
          </Box>

          <Box bg={cardBg} shadow="md" rounded="lg" p={6} border="1px" borderColor={borderColor}>
            <Heading size="lg" mb={4} display="flex" alignItems="center" gap={2}>
              <Icon as={FiTrendingDown} color="orange.500" /> Slow/Dead Stock
            </Heading>
            <Box maxH="400px" overflowY="auto">
              <VStack gap={3} align="stretch">
                {slowMovers && slowMovers.length > 0 ? (
                  slowMovers.map((product) => (
                  <Box key={product.id} bg="orange.50" p={3} rounded="md" border="1px" borderColor="orange.200">
                    <HStack justify="space-between" mb={1}>
                      <Text fontWeight="bold" fontSize="sm">
                        {product.name}
                      </Text>
                      <Badge colorScheme="orange">{product.days_no_movement > 30 ? "> 30" : product.days_no_movement} d</Badge>
                    </HStack>
                    <Text fontSize="xs" color="gray.600">
                      SKU: {product.sku} | Stok: {product.current_stock}
                    </Text>
                  </Box>
                  ))
                ) : (
                  <Text color="gray.500" fontSize="sm">
                    Tidak ada data
                  </Text>
                )}
              </VStack>
            </Box>
          </Box>
        </SimpleGrid>

        {/* SECTION 4: CATEGORY PERFORMANCE */}
        <Box bg={cardBg} shadow="md" rounded="lg" p={6} border="1px" borderColor={borderColor}>
          <Heading size="lg" mb={4} display="flex" alignItems="center" gap={2}>
            <Icon as={FiPieChart} /> Category Performance
          </Heading>
          {categoryPerformance && categoryPerformance.length > 0 ? (
            <VStack gap={2} align="stretch">
              {categoryPerformance.map((cat) => (
                <Box key={cat.category_id} p={3} bg="gray.50" rounded="md" border="1px" borderColor="gray.200">
                  <HStack justify="space-between" mb={1}>
                    <Text fontWeight="bold">{cat.category_name}</Text>
                    <HStack gap={2}>
                      <Badge colorScheme="blue">{cat.total_products} produk</Badge>
                      <Badge colorScheme="green">In: {cat.inbound_30days}</Badge>
                      <Badge colorScheme="red">Out: {cat.outbound_30days}</Badge>
                    </HStack>
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    Nilai: {formatCurrency(cat.total_value)} | {cat.low_stock_count > 0 ? `${cat.low_stock_count} rendah` : 'OK'}
                  </Text>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text color="gray.500">Tidak ada data</Text>
          )}
        </Box>

        {/* SECTION 5: OPERATIONAL STATS */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
          <Box bg={cardBg} shadow="md" rounded="lg" p={6} border="1px" borderColor={borderColor}>
            <Heading size="lg" mb={4} display="flex" alignItems="center" gap={2}>
              <Icon as={FiBarChart2} /> Operational Stats
            </Heading>
            <VStack gap={4} align="stretch">
              <Box>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="sm" fontWeight="medium">Total Transaksi</Text>
                  <Text fontSize="lg" fontWeight="bold">
                    {operationalStats?.total_transactions_30days || 0}
                  </Text>
                </HStack>
                <HStack fontSize="xs" color="gray.600" gap={4}>
                  <HStack gap={1}>
                    <Icon as={FiArrowUp} color="green.500" boxSize={4} />
                    <Text>In: {operationalStats?.inbound_transactions_30days}</Text>
                  </HStack>
                  <HStack gap={1}>
                    <Icon as={FiArrowDown} color="red.500" boxSize={4} />
                    <Text>Out: {operationalStats?.outbound_transactions_30days}</Text>
                  </HStack>
                </HStack>
              </Box>
              <Box borderTop="1px" borderColor={borderColor} pt={4}>
                <Text fontSize="sm" fontWeight="medium" mb={2}>
                  Avg per Day
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  {operationalStats?.avg_transactions_per_day.toFixed(1)} tx
                </Text>
              </Box>
            </VStack>
          </Box>

          <Box bg={cardBg} shadow="md" rounded="lg" p={6} border="1px" borderColor={borderColor}>
            <Heading size="lg" mb={4} display="flex" alignItems="center" gap={2}>
              <Icon as={FiUsers} /> Top Operators
            </Heading>
            <VStack gap={2} align="stretch">
              {operationalStats && operationalStats.top_operators && operationalStats.top_operators.length > 0 ? (
                operationalStats.top_operators.slice(0, 5).map((op, idx) => (
                  <Box key={op.user_id} bg="blue.50" p={2} rounded="md">
                    <HStack justify="space-between" fontSize="sm">
                      <Text fontWeight="medium">
                        #{idx + 1} {op.operator_name}
                      </Text>
                      <Badge colorScheme="blue">{op.transaction_count}</Badge>
                    </HStack>
                  </Box>
                ))
              ) : (
                <Text color="gray.500" fontSize="sm">
                  Tidak ada data
                </Text>
              )}
            </VStack>
          </Box>
        </SimpleGrid>

        {/* SECTION 6: SUMMARY CARDS */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          <Box bg="teal.500" color="white" shadow="md" rounded="lg" p={6}>
            <Stack gap={2}>
              <Text fontSize="sm" display="flex" alignItems="center" gap={2}>
                <Icon as={FiPackage} /> Total Produk
              </Text>
              <Text fontSize="3xl" fontWeight="bold">
                {products.length}
              </Text>
            </Stack>
          </Box>

          <Box bg="orange.500" color="white" shadow="md" rounded="lg" p={6}>
            <Stack gap={2}>
              <Text fontSize="sm" display="flex" alignItems="center" gap={2}>
                <Icon as={FiAlertTriangle} /> Stok Rendah
              </Text>
              <Text fontSize="3xl" fontWeight="bold">
                {lowStockProducts}
              </Text>
            </Stack>
          </Box>

          <Box bg={lowStockProducts === 0 ? "green.500" : "red.500"} color="white" shadow="md" rounded="lg" p={6}>
            <Stack gap={2}>
              <Text fontSize="sm" display="flex" alignItems="center" gap={2}>
                <Icon as={FiTrendingUp} /> Status Warehouse
              </Text>
              {lowStockProducts === 0 ? (
                <>
                  <Text fontSize="3xl" fontWeight="bold">✓ Aman</Text>
                  <Text fontSize="xs">Semua stok dalam kondisi baik</Text>
                </>
              ) : (
                <>
                  <Text fontSize="3xl" fontWeight="bold">⚠ Perhatian</Text>
                  <Text fontSize="xs">{lowStockProducts} produk stok rendah</Text>
                </>
              )}
            </Stack>
          </Box>
        </SimpleGrid>

        {/* INFO BOX */}
        <Box bg="blue.50" border="1px" borderColor="blue.200" p={4} rounded="md">
          <Text fontWeight="bold" color="blue.700" mb={2}>
            ℹ️ Dashboard Analytics
          </Text>
          <Text fontSize="sm" color="blue.700">
            Dashboard menampilkan data real-time: financial metrics, fast/slow movers, critical alerts, category performance, dan operational statistics untuk periode 30 hari terakhir.
          </Text>
        </Box>
      </Stack>
    </WarehouseLayout>
  );
}
