import axios from 'axios';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  role_label: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: PaginationData | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  refetch: () => void;
  createUser: (data: Record<string, unknown>) => Promise<User>;
  updateUser: (id: number, data: Record<string, unknown>) => Promise<User>;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/users', {
        params: { page, per_page: 10 },
      });
      setUsers(response.data.data);
      setPagination(response.data.pagination);
      setCurrentPage(page);
    } catch (err: unknown) {
      const message = err instanceof Error && 'response' in err
        ? (err as Record<string, unknown>).response as Record<string, unknown>
        : null;
      setError((message?.data as Record<string, unknown>)?.message as string || 'Gagal mengambil data user');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (data: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/users', data);
      await fetchUsers(currentPage);
      return response.data.data;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, data: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/users/${id}`, data);
      await fetchUsers(currentPage);
      return response.data.data;
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => fetchUsers(currentPage);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  return {
    users,
    loading,
    error,
    pagination,
    currentPage,
    setCurrentPage,
    refetch,
    createUser,
    updateUser,
  };
};
