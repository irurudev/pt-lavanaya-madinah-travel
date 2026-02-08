import {
  Box,
  Button,
  Heading,
  Stack,
  Flex,
  Grid,
  Spinner,
  Center,
  Text,
  Badge,
  Input,
  IconButton,
} from '@chakra-ui/react';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { PaginationControls } from '@/components/PaginationControls';
import { TransactionForm } from '@/components/TransactionForm';
import { NativeSelectField, NativeSelectRoot } from '@/components/ui/native-select';
import { useProducts } from '@/hooks/useProducts';
import { useTransactions } from '@/hooks/useTransactions';
import WarehouseLayout from '@/layouts/WarehouseLayout';
import type { TransactionType } from '@/types/warehouse';

/**
 * Halaman untuk mengelola transaksi
 * Menampilkan daftar transaksi dan form untuk membuat transaksi baru
 */
export default function TransactionsPage() {
  const { props } = usePage();
  const user = (props.auth as Record<string, unknown>)?.user as Record<string, unknown> | undefined;
  const isAdmin = (user?.role as string) === 'admin';

  const {
    transactions,
    loading,
    error,
    pagination,
    page,
    setPage,
    fetchTransactions,
    createInbound,
    createOutbound,
    remove,
  } = useTransactions();
  const {
    products,
    fetchProducts,
  } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'inbound' | 'outbound'>('inbound');
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchTransactions(page);
  }, [page, fetchTransactions]);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const filteredTransactions = transactions.filter((tx) => {
    // Filter berdasarkan tipe transaksi
    if (filter !== 'all' && tx.type !== filter) {
      return false;
    }

    // Filter berdasarkan tanggal
    if (dateFilter) {
      const txDate = new Date(tx.created_at).toLocaleDateString('id-ID');
      const filterDate = new Date(dateFilter).toLocaleDateString('id-ID');
      if (txDate !== filterDate) {
        return false;
      }
    }

    return true;
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      try {
        await remove(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Gagal menghapus transaksi');
      }
    }
  };

  const getTypeLabel = (type: TransactionType) => {
    return type === 'in' ? 'Barang Masuk' : 'Barang Keluar';
  };



  return (
    <WarehouseLayout>
      <Stack gap={6}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
          <Heading size="2xl">Mutasi Barang</Heading>
          <Flex gap={2}>
            <Button
              colorScheme="green"
              variant={formType === 'inbound' && showForm ? 'solid' : 'outline'}
              onClick={() => {
                setFormType('inbound');
                setShowForm(true);
              }}
            >
              + Barang Masuk
            </Button>
            <Button
              colorScheme="red"
              variant={formType === 'outbound' && showForm ? 'solid' : 'outline'}
              onClick={() => {
                setFormType('outbound');
                setShowForm(true);
              }}
            >
              - Barang Keluar
            </Button>
          </Flex>
        </Flex>

        {showForm && (
          <Box bg="white" shadow="md" rounded="lg" p={6}>
            <Heading size="lg" mb={4}>
              {formType === 'inbound' ? 'Barang Masuk (PO)' : 'Barang Keluar (SJ)'}
            </Heading>
            <TransactionForm
              type={formType}
              onSuccess={() => setShowForm(false)}
              products={products}
              onCreateInbound={createInbound}
              onCreateOutbound={createOutbound}
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

        <Box bg="gray.50" shadow="sm" rounded="lg" p={6}>
          <Stack gap={4}>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                <Box>
                  <Text mb={2} fontWeight="medium" fontSize="sm">Filter Tipe</Text>
                  <NativeSelectRoot size="sm">
                    <NativeSelectField
                      value={filter}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value as 'all' | 'in' | 'out')}
                    >
                      <option value="all">Semua Transaksi</option>
                      <option value="in">Barang Masuk</option>
                      <option value="out">Barang Keluar</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Box>

                <Box>
                  <Text mb={2} fontWeight="medium" fontSize="sm">Filter Tanggal</Text>
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    size="sm"
                  />
                </Box>

                <Box>
                  <Text mb={2} fontWeight="medium" fontSize="sm">Total Transaksi</Text>
                  <Box
                    borderWidth="1px"
                    borderRadius="md"
                    px={3}
                    py={2}
                    textAlign="center"
                    fontWeight="semibold"
                    bg="white"
                  >
                    {filteredTransactions.length}
                  </Box>
                </Box>
              </Grid>
              {(filter !== 'all' || dateFilter) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setFilter('all');
                    setDateFilter('');
                  }}
                >
                  Reset Filter
                </Button>
              )}
            </Stack>
        </Box>

        {loading ? (
          <Center py={8}>
            <Spinner size="xl" color="teal.500" />
          </Center>
        ) : filteredTransactions.length === 0 ? (
          <Box bg="blue.50" border="1px" borderColor="blue.200" p={4} rounded="md">
            <Text color="blue.700" fontWeight="medium">Tidak ada transaksi. Silakan buat transaksi baru.</Text>
          </Box>
        ) : (
          <Box bg="white" shadow="md" rounded="lg" p={6}>
            <Box overflowX="auto">
              <Box as="table" width="full" style={{ borderCollapse: 'collapse' }}>
                <Box as="thead">
                  <Box as="tr" borderBottom="2px" borderColor="gray.200">
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Tanggal</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Tipe</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Produk</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Jumlah</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Ref. No</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Harga</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Operator</Box>
                    <Box as="th" textAlign="right" p={3} fontWeight="semibold">Aksi</Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  {filteredTransactions.map((tx) => (
                    <Box as="tr" key={tx.id} borderBottom="1px" borderColor="gray.100">
                      <Box as="td" p={3} fontSize="sm">
                        {new Date(tx.created_at).toLocaleDateString('id-ID')}
                      </Box>
                      <Box as="td" p={3}>
                        <Badge colorScheme={tx.type === 'in' ? 'green' : 'red'}>
                          {getTypeLabel(tx.type)}
                        </Badge>
                      </Box>
                      <Box as="td" p={3}>
                        <Box>
                          <Text fontWeight="semibold">{tx.product?.name}</Text>
                          <Text fontSize="xs" color="gray.600">{tx.product?.sku}</Text>
                        </Box>
                      </Box>
                      <Box as="td" p={3} fontWeight="semibold">{tx.quantity}</Box>
                      <Box as="td" p={3}>{tx.reference_no}</Box>
                      <Box as="td" p={3}>Rp {Number(tx.price_at_transaction).toLocaleString('id-ID')}</Box>
                      <Box as="td" p={3} fontSize="sm">{tx.user?.name}</Box>
                      <Box as="td" p={3} textAlign="right">
                        {/* Only admin can delete transactions - audit trail preservation */}
                        {isAdmin ? (
                          <IconButton
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            aria-label="Hapus transaksi"
                            onClick={() => handleDelete(tx.id)}
                          >
                            <FiTrash2 />
                          </IconButton>
                        ) : (
                          <Text fontSize="sm" color="gray.500">No Action</Text>
                        )}
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
