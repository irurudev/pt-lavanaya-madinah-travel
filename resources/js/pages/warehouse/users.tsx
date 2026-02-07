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
  IconButton,
} from '@chakra-ui/react';
import { FiEdit2, FiPlus } from 'react-icons/fi';
import WarehouseLayout from '@/layouts/WarehouseLayout';
import { useUsers } from '@/hooks/useUsers';
import { UserForm } from '@/components/UserForm';
import { PaginationControls } from '@/components/PaginationControls';
import { useState, useEffect } from 'react';
import type { User } from '@/types/warehouse';

export default function Users() {
  const {
    users,
    loading,
    error,
    pagination,
    currentPage,
    setCurrentPage,
    createUser,
    updateUser,
  } = useUsers();

  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Clear messages after 3 seconds
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleOpenForm = (user: any = null) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setSelectedUser(null);
    setShowForm(false);
    setSubmitError(null);
  };

  const handleSubmit = async (data: any) => {
    setSubmitError(null);
    try {
      if (selectedUser) {
        await updateUser((selectedUser as any).id, data);
        setSuccessMessage('User berhasil diperbarui');
      } else {
        await createUser(data);
        setSuccessMessage('User berhasil dibuat');
      }
      handleCloseForm();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Gagal menyimpan user';
      setSubmitError(errorMessage);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'operator':
        return 'blue';
      case 'viewer':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'operator':
        return 'Operator Gudang';
      case 'viewer':
        return 'Viewer (Read-Only)';
      default:
        return role;
    }
  };

  if (error) {
    return (
      <WarehouseLayout>
        <Center minH="400px">
          <Box bg="red.50" border="1px" borderColor="red.200" p={4} rounded="md" maxW="400px">
            <Text color="red.700" fontWeight="medium">Error: {error}</Text>
          </Box>
        </Center>
      </WarehouseLayout>
    );
  }

  return (
    <WarehouseLayout>
      <Stack gap={6}>
        <Flex justify="space-between" align="center">
          <Heading size="2xl">Manajemen User</Heading>
          <Button
            colorScheme="teal"
            onClick={() => handleOpenForm()}
          >
            {showForm ? 'Batal' : '+ Tambah User'}
          </Button>
        </Flex>

        {submitError && (
          <Box bg="red.50" border="1px" borderColor="red.200" p={4} rounded="md">
            <Text color="red.700" fontWeight="medium">{submitError}</Text>
          </Box>
        )}

        {successMessage && (
          <Box bg="green.50" border="1px" borderColor="green.200" p={4} rounded="md">
            <Text color="green.700" fontWeight="medium">{successMessage}</Text>
          </Box>
        )}

        {showForm && (
          <Box bg="white" shadow="md" rounded="lg" p={6}>
            <Heading size="lg" mb={4}>
              {selectedUser ? 'Edit User' : 'Tambah User Baru'}
            </Heading>
            <UserForm
              user={selectedUser}
              onSuccess={() => {
                setSelectedUser(null);
              }}
              onCancel={handleCloseForm}
              onSubmit={handleSubmit}
            />
          </Box>
        )}

        {loading ? (
          <Center py={8}>
            <Spinner size="xl" color="teal.500" />
          </Center>
        ) : users.length === 0 ? (
          <Box bg="blue.50" border="1px" borderColor="blue.200" p={4} rounded="md">
            <Text color="blue.700" fontWeight="medium">Belum ada user. Silakan tambah user baru.</Text>
          </Box>
        ) : (
          <Box bg="white" shadow="md" rounded="lg" overflow="hidden">
            <Box overflowX="auto">
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}
              >
                <thead
                  style={{
                    backgroundColor: '#f7fafc',
                    borderBottomWidth: '1px',
                  }}
                >
                  <tr>
                    <th
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        minWidth: '50px',
                      }}
                    >
                      #
                    </th>
                    <th
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        minWidth: '200px',
                      }}
                    >
                      Nama
                    </th>
                    <th
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        minWidth: '200px',
                      }}
                    >
                      Email
                    </th>
                    <th
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        minWidth: '120px',
                      }}
                    >
                      Role
                    </th>
                    <th
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        minWidth: '100px',
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: '12px',
                        textAlign: 'right',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        minWidth: '100px',
                      }}
                    >
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottomWidth: '1px',
                        borderColor: '#e2e8f0',
                      }}
                    >
                      <Box as="td" p={3} minW="50px">
                        {((pagination?.current_page || 1) - 1) *
                          (pagination?.per_page || 10) +
                          (index + 1)}
                      </Box>
                      <Box as="td" p={3} minW="200px" fontWeight="500">
                        {user.name}
                      </Box>
                      <Box as="td" p={3} minW="200px" fontSize="0.875rem">
                        {user.email}
                      </Box>
                      <Box as="td" p={3} minW="120px">
                        <Badge colorScheme={getRoleBadgeColor(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </Box>
                      <Box as="td" p={3} minW="100px">
                        <Badge
                          colorScheme={user.is_active ? 'green' : 'red'}
                        >
                          {user.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </Box>
                      <Box as="td" p={3} textAlign="right" minW="100px">
                        <Flex gap={2} justify="flex-end">
                          <IconButton
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            aria-label="Edit user"
                            title="Edit user"
                            onClick={() => handleOpenForm(user)}
                          >
                            <FiEdit2 />
                          </IconButton>
                        </Flex>
                      </Box>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Box>
        )}

        {pagination && !loading && users.length > 0 && (
          <Box>
            <PaginationControls
              pagination={pagination}
              onPageChange={setCurrentPage}
            />
          </Box>
        )}
      </Stack>
    </WarehouseLayout>
  );
}
