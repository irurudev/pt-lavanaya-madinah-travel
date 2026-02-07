import {
  Button,
  Box,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { NativeSelectField, NativeSelectRoot } from '@/components/ui/native-select';

interface UserFormProps {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
  } | null;
  onSuccess: () => void;
  onCancel: () => void;
  onSubmit: (data: any) => Promise<any>;
}

export const UserForm = ({
  user,
  onSuccess,
  onCancel,
  onSubmit,
}: UserFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'operator',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Jika edit, isi form dengan data user dan kosongkan password
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        is_active: user.is_active,
      });
      setError(null);
    } else {
      // Jika create, reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'operator',
        is_active: true,
      });
      setError(null);
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const finalValue =
      type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : name === 'is_active'
          ? value === 'active'
          : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Nama dan email wajib diisi');
      return;
    }

    if (!user && !formData.password.trim()) {
      setError('Password wajib diisi saat membuat user baru');
      return;
    }

    try {
      setLoading(true);

      const submitData = { ...formData };

      // Jika edit dan password kosong, jangan kirim password
      if (user && !submitData.password) {
        delete (submitData as any).password;
      }

      await onSubmit(submitData);
      onSuccess();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Terjadi kesalahan saat menyimpan user';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={4}>
        {error && (
          <Box bg="red.50" border="1px" borderColor="red.200" p={3} rounded="md">
            <Text color="red.700" fontWeight="medium">{error}</Text>
          </Box>
        )}

        <Box>
          <Text mb={2} fontWeight="semibold">Nama User</Text>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nama lengkap user"
            disabled={loading}
          />
        </Box>

        <Box>
          <Text mb={2} fontWeight="semibold">Email</Text>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
            disabled={loading}
          />
        </Box>

        <Box>
          <Text mb={2} fontWeight="semibold">
            Password
            {user && (
              <span style={{ fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                (Kosongkan jika tidak diubah)
              </span>
            )}
          </Text>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={user ? 'Kosongkan jika tidak diubah' : 'Minimal 8 karakter'}
            disabled={loading}
          />
        </Box>

        <NativeSelectRoot>
          <NativeSelectField
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="operator">Operator Gudang</option>
            <option value="viewer">Viewer (Read-Only)</option>
          </NativeSelectField>
        </NativeSelectRoot>

        <NativeSelectRoot>
          <NativeSelectField
            name="is_active"
            value={formData.is_active ? 'active' : 'inactive'}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                is_active: e.target.value === 'active',
              }))
            }
            disabled={loading}
          >
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </NativeSelectField>
        </NativeSelectRoot>

        <Stack direction="row" gap={2} justify="flex-end">
          <Button
            colorScheme="gray"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
