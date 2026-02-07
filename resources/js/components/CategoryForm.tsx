import { useEffect, useState } from 'react';
import { Box, Button, Input, Stack, Text } from '@chakra-ui/react';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from '@/types/warehouse';

interface CategoryFormProps {
  onSuccess?: () => void;
  initialData?: Category;
  onCreateCategory?: (payload: CreateCategoryPayload) => Promise<any>;
  onUpdateCategory?: (id: number, payload: UpdateCategoryPayload) => Promise<any>;
  isLoading?: boolean;
  apiError?: string | null;
}

/**
 * Form untuk membuat/mengupdate kategori
 */
export function CategoryForm({ 
  onSuccess, 
  initialData, 
  onCreateCategory,
  onUpdateCategory,
  isLoading = false,
  apiError 
}: CategoryFormProps) {
  const { setUnsavedChanges } = useUnsavedChanges();
  const [name, setName] = useState(initialData?.name || '');
  const [initialName, setInitialName] = useState(initialData?.name || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const nextName = initialData?.name || '';
    setName(nextName);
    setInitialName(nextName);
  }, [initialData]);

  useEffect(() => {
    if (apiError) {
      setError(apiError);
    }
  }, [apiError]);

  // Track unsaved changes
  useEffect(() => {
    const hasChanged = name !== initialName;
    setUnsavedChanges(hasChanged);
  }, [name, initialName, setUnsavedChanges]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Nama kategori harus diisi');
      return;
    }

    try {
      const payload: CreateCategoryPayload = { name: name.trim() };

      if (initialData) {
        if (onUpdateCategory) {
          await onUpdateCategory(initialData.id, payload);
        }
      } else {
        if (onCreateCategory) {
          await onCreateCategory(payload);
        }
      }

      setName('');
      setUnsavedChanges(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
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
          <Text mb={2} fontWeight="semibold">Nama Kategori</Text>
          <Input
            type="text"
            placeholder="Masukkan nama kategori"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="lg"
            disabled={isLoading}
          />
        </Box>

        <Button
          type="submit"
          colorScheme="teal"
          disabled={isLoading}
          loading={isLoading}
        >
          {initialData ? 'Perbarui' : 'Buat'}
        </Button>
      </Stack>
    </form>
  );
}
