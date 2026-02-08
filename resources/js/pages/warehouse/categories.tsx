import {
  Box,
  Button,
  Heading,
  Stack,
  Flex,
  Spinner,
  Center,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { CategoryForm } from '@/components/CategoryForm';
import { PaginationControls } from '@/components/PaginationControls';
import { useCategories } from '@/hooks/useCategories';
import WarehouseLayout from '@/layouts/WarehouseLayout';
import type { Category } from '@/types/warehouse';

/**
 * Halaman untuk mengelola kategori
 * CRUD operations untuk master data kategori
 */
export default function CategoriesPage() {
  const { props } = usePage();
  const user = (props.auth as Record<string, unknown>)?.user as Record<string, unknown> | undefined;
  const isAdmin = (user?.role as string) === 'admin';

  const {
    categories,
    loading,
    error,
    pagination,
    page,
    setPage,
    fetchCategories,
    create,
    update,
    remove,
  } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories(page);
  }, [page, fetchCategories]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        await remove(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Gagal menghapus kategori');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedCategory(null);
  };

  return (
    <WarehouseLayout>
      <Stack gap={6}>
        <Flex justify="space-between" align="center">
          <Heading size="2xl">Kelola Kategori</Heading>
          {/* Only admin can create/edit categories - master data control */}
          {isAdmin && (
            <Button
              colorScheme="teal"
              onClick={() => {
                setSelectedCategory(null);
                setShowForm(!showForm);
              }}
            >
              {showForm ? 'Batal' : 'Tambah Kategori'}
            </Button>
          )}
        </Flex>

        {showForm && (
          <Box bg="white" shadow="md" rounded="lg" p={6}>
            <Heading size="lg" mb={4}>
              {selectedCategory ? 'Edit Kategori' : 'Buat Kategori Baru'}
            </Heading>
            <CategoryForm
              initialData={selectedCategory || undefined}
              onSuccess={handleFormClose}
              onCreateCategory={create}
              onUpdateCategory={update}
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

        {loading ? (
          <Center py={8}>
            <Spinner size="xl" color="teal.500" />
          </Center>
        ) : categories.length === 0 ? (
          <Box bg="blue.50" border="1px" borderColor="blue.200" p={4} rounded="md">
            <Text color="blue.700" fontWeight="medium">Belum ada kategori. Silakan buat kategori baru.</Text>
          </Box>
        ) : (
          <Box bg="white" shadow="md" rounded="lg" p={6}>
            <Box overflowX="auto">
              <Box as="table" width="full" style={{ borderCollapse: 'collapse' }}>
                <Box as="thead">
                  <Box as="tr" borderBottom="2px" borderColor="gray.200">
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold" minWidth="50px">#</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Nama Kategori</Box>
                    <Box as="th" textAlign="left" p={3} fontWeight="semibold">Dibuat</Box>
                    <Box as="th" textAlign="right" p={3} fontWeight="semibold">Aksi</Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  {categories.map((category, index) => (
                    <Box as="tr" key={category.id} borderBottom="1px" borderColor="gray.100">
                      <Box as="td" p={3}>{((page - 1) * 10) + (index + 1)}</Box>
                      <Box as="td" p={3}>
                        <Text fontWeight="semibold">{category.name}</Text>
                      </Box>
                      <Box as="td" p={3}>
                        {new Date(category.created_at).toLocaleDateString('id-ID')}
                      </Box>
                      <Box as="td" p={3} textAlign="right">
                        {isAdmin ? (
                          <Flex gap={2} justify="flex-end">
                            <IconButton
                              size="sm"
                              variant="ghost"
                              colorScheme="blue"
                              aria-label="Edit kategori"
                              onClick={() => {
                                setSelectedCategory(category);
                                setShowForm(true);
                              }}
                            >
                              <FiEdit2 />
                            </IconButton>
                            <IconButton
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              aria-label="Hapus kategori"
                              onClick={() => handleDelete(category.id)}
                            >
                              <FiTrash2 />
                            </IconButton>
                          </Flex>
                        ) : (
                          <Text fontSize="sm" color="gray.500">View Only</Text>
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
