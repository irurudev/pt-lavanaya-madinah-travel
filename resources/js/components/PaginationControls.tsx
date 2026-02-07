import { ButtonGroup, Flex, IconButton, Pagination, Text } from '@chakra-ui/react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import type { PaginationMeta } from '@/types/warehouse';

interface PaginationControlsProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

/**
 * Komponen pagination reusable untuk tabel
 */
export function PaginationControls({ pagination, onPageChange }: PaginationControlsProps) {
  if (pagination.total <= pagination.per_page) {
    return null;
  }

  const startItem = (pagination.current_page - 1) * pagination.per_page + 1;
  const endItem = Math.min(pagination.current_page * pagination.per_page, pagination.total);

  return (
    <Flex justify="space-between" align="center" mt={4} gap={4} flexWrap="wrap">
      <Text fontSize="sm" color="gray.600">
        Menampilkan {startItem}-{endItem} dari {pagination.total} data
      </Text>

      <Pagination.Root
        count={pagination.total}
        pageSize={pagination.per_page}
        page={pagination.current_page}
        onPageChange={(details) => onPageChange(details.page)}
      >
        <ButtonGroup variant="ghost" size="sm">
          <Pagination.PrevTrigger asChild>
            <IconButton aria-label="Previous page">
              <HiChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(page) => (
              <IconButton
                aria-label={`Page ${page.value}`}
                variant={{ base: 'ghost', _selected: 'outline' }}
              >
                {page.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton aria-label="Next page">
              <HiChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </Flex>
  );
}
