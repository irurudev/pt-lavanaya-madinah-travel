import { Box, Button, Input, Stack, Text, Textarea, Grid } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { NativeSelectField, NativeSelectRoot } from '@/components/ui/native-select';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import type {
  CreateInboundTransactionPayload,
  CreateOutboundTransactionPayload,
  Product,
} from '@/types/warehouse';

interface TransactionFormProps {
  type: 'inbound' | 'outbound';
  onSuccess?: () => void;
  products?: Product[];
  onCreateInbound?: (payload: CreateInboundTransactionPayload) => Promise<Transaction | Transaction[] | undefined>;
  onCreateOutbound?: (payload: CreateOutboundTransactionPayload) => Promise<Transaction | Transaction[] | undefined>;
  isLoading?: boolean;
  apiError?: string | null;
}

/**
 * Form untuk membuat transaksi masuk/keluar
 * Reference number dan harga di-generate otomatis oleh sistem
 */
export function TransactionForm({ 
  type, 
  onSuccess,
  products = [],
  onCreateInbound,
  onCreateOutbound,
  isLoading = false,
  apiError,
}: TransactionFormProps) {
  const { setUnsavedChanges } = useUnsavedChanges();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: '',
    notes: '',
  });
  const [initialFormData] = useState(formData);
  const isOutbound = type === 'outbound';
  const selectedProduct = products.find((prod) => prod.id === Number(formData.product_id));

  useEffect(() => {
    if (apiError) {
      setError(apiError);
    }
  }, [apiError]);

  // Track unsaved changes
  useEffect(() => {
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setUnsavedChanges(hasChanged);
  }, [formData, initialFormData, setUnsavedChanges]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
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
    if (!formData.product_id || !formData.quantity) {
      setError('Field yang ditandai wajib diisi');
      return;
    }

    if (Number(formData.quantity) < 1) {
      setError('Jumlah minimal adalah 1');
      return;
    }

    if (isOutbound && selectedProduct && Number(formData.quantity) > selectedProduct.stock) {
      setError('Jumlah tidak boleh melebihi stok tersedia');
      return;
    }

    try {
      const payload = {
        product_id: Number(formData.product_id),
        quantity: Number(formData.quantity),
        notes: formData.notes.trim() || undefined,
      };

      if (type === 'inbound') {
        if (onCreateInbound) {
          await onCreateInbound(payload as CreateInboundTransactionPayload);
        }
      } else {
        if (onCreateOutbound) {
          await onCreateOutbound(payload as CreateOutboundTransactionPayload);
        }
      }

      setFormData({
        product_id: '',
        quantity: '',
        notes: '',
      });
      setUnsavedChanges(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  const title = type === 'inbound' ? 'Transaksi Masuk' : 'Transaksi Keluar';

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={4}>
        {error && (
          <Box bg="red.50" border="1px" borderColor="red.200" p={3} rounded="md">
            <Text color="red.700" fontWeight="medium">{error}</Text>
          </Box>
        )}

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
          <Box>
            <Text mb={2} fontWeight="semibold">
              Produk <Text as="span" color="red.500">*</Text>
            </Text>
            <NativeSelectRoot>
              <NativeSelectField
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Pilih produk</option>
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.sku} - {prod.name} (Stok: {prod.stock})
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          </Box>

          <Box>
            <Text mb={2} fontWeight="semibold">
              Jumlah <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              type="number"
              name="quantity"
              placeholder="0"
              value={formData.quantity}
              onChange={handleChange}
              size="lg"
              disabled={isLoading || !formData.product_id}
              min="1"
              max={isOutbound && selectedProduct ? selectedProduct.stock : undefined}
            />
          </Box>
        </Grid>

        <Box>
          <Text mb={2} fontWeight="semibold">Catatan</Text>
          <Textarea
            name="notes"
            placeholder="Masukkan catatan transaksi (opsional)"
            value={formData.notes}
            onChange={handleChange}
            disabled={isLoading}
            rows={3}
          />
        </Box>

        <Button
          type="submit"
          colorScheme="teal"
          width="full"
          disabled={isLoading}
          loading={isLoading}
        >
          {`Buat ${title}`}
        </Button>
      </Stack>
    </form>
  );
}
