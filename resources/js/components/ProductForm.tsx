import { useEffect, useState } from 'react';
import { Box, Button, Input, Stack, Text, Grid } from '@chakra-ui/react';
import { NativeSelectField, NativeSelectRoot } from '@/components/ui/native-select';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import type { CreateProductPayload, UpdateProductPayload, Product, Category } from '@/types/warehouse';

interface ProductFormProps {
  onSuccess?: () => void;
  initialData?: Product;
  categories?: Category[];
  onCreateProduct?: (payload: CreateProductPayload) => Promise<any>;
  onUpdateProduct?: (id: number, payload: UpdateProductPayload) => Promise<any>;
  isLoading?: boolean;
  apiError?: string | null;
}

/**
 * Form untuk membuat/mengupdate produk
 */
export function ProductForm({ 
  onSuccess, 
  initialData, 
  categories = [],
  onCreateProduct,
  onUpdateProduct,
  isLoading = false,
  apiError
}: ProductFormProps) {
  const { setUnsavedChanges } = useUnsavedChanges();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category_id: initialData?.category_id || '',
    name: initialData?.name || '',
    min_stock: initialData?.min_stock || '',
    buy_price: initialData?.buy_price || '',
    sell_price: initialData?.sell_price || '',
  });
  const [initialFormData, setInitialFormData] = useState(formData);

  // Update form data saat initialData berubah
  useEffect(() => {
    const nextFormData = {
      category_id: initialData?.category_id || '',
      name: initialData?.name || '',
      min_stock: initialData?.min_stock || '',
      buy_price: initialData?.buy_price || '',
      sell_price: initialData?.sell_price || '',
    };
    setFormData(nextFormData);
    setInitialFormData(nextFormData);
  }, [initialData]);

  // Track unsaved changes - cek apakah form data berubah dari awal
  useEffect(() => {
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setUnsavedChanges(hasChanged);
  }, [formData, initialFormData, setUnsavedChanges]);

  useEffect(() => {
    if (apiError) {
      setError(apiError);
    }
  }, [apiError]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi
    if (!formData.category_id || !formData.name || !formData.min_stock || !formData.buy_price || !formData.sell_price) {
      setError('Semua field wajib diisi');
      return;
    }

    try {
      const payload: CreateProductPayload = {
        category_id: Number(formData.category_id),
        name: formData.name.trim(),
        min_stock: Number(formData.min_stock),
        buy_price: formData.buy_price,
        sell_price: formData.sell_price,
      };

      if (initialData) {
        if (onUpdateProduct) {
          await onUpdateProduct(initialData.id, payload);
        }
      } else {
        if (onCreateProduct) {
          await onCreateProduct(payload);
        }
      }

      if (!initialData) {
        setFormData({
          category_id: '',
          name: '',
          min_stock: '',
          buy_price: '',
          sell_price: '',
        });
      }
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

        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
          <Box>
            <Text mb={2} fontWeight="semibold">Nama Produk</Text>
            <Input
              type="text"
              name="name"
              placeholder="Masukkan nama produk"
              value={formData.name}
              onChange={handleChange}
              size="lg"
              disabled={isLoading}
            />
          </Box>

          <Box>
            <Text mb={2} fontWeight="semibold">Kategori</Text>
            <NativeSelectRoot>
              <NativeSelectField
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Pilih kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          </Box>

          <Box>
            <Text mb={2} fontWeight="semibold">Stok Minimal</Text>
            <Input
              type="number"
              name="min_stock"
              placeholder="0"
              value={formData.min_stock}
              onChange={handleChange}
              size="lg"
              disabled={isLoading}
              min="0"
            />
          </Box>
        </Grid>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
          <Box>
            <Text mb={2} fontWeight="semibold">Harga Beli</Text>
            <Input
              type="number"
              name="buy_price"
              placeholder="0"
              value={formData.buy_price}
              onChange={handleChange}
              size="lg"
              disabled={isLoading}
              min="0"
              step="0.01"
            />
          </Box>
          <Box>
            <Text mb={2} fontWeight="semibold">Harga Jual</Text>
            <Input
              type="number"
              name="sell_price"
              placeholder="0"
              value={formData.sell_price}
              onChange={handleChange}
              size="lg"
              disabled={isLoading}
              min="0"
              step="0.01"
            />
          </Box>
        </Grid>

        <Button
          type="submit"
          colorScheme="teal"
          width="full"
          disabled={isLoading}
          loading={isLoading}
        >
          {initialData ? 'Perbarui Produk' : 'Buat Produk'}
        </Button>
      </Stack>
    </form>
  );
}
