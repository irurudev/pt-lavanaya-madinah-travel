import { useEffect, useState } from 'react';
import axios from 'axios';

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
  createUser: (data: any) => Promise<User>;
  updateUser: (id: number, data: any) => Promise<User>;
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
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal mengambil data user';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (data: any) => {
    try {
      const response = await axios.post('/users', data);
      await fetchUsers(currentPage);
      return response.data.data;
    } catch (err: any) {
      throw err;
    }
  };

  const updateUser = async (id: number, data: any) => {
    try {
      const response = await axios.put(`/users/${id}`, data);
      await fetchUsers(currentPage);
      return response.data.data;
    } catch (err: any) {
      throw err;
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
