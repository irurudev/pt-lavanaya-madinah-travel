import { Flex, Box, Container, Text } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';
import { Sidebar } from '@/components/Sidebar';

/**
 * Layout utama untuk halaman warehouse
 * Menyediakan navigasi sidebar dan struktur page yang konsisten
 */
export default function WarehouseLayout({ children }: PropsWithChildren) {
  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <Flex direction="column" flex="1" overflow="hidden">
        {/* Top Bar */}
        <Box bg="white" borderBottom="1px" borderColor="gray.200" shadow="sm" px={6} py={4}>
          <Text fontSize="sm" color="gray.600" fontWeight="medium">
            Warehouse Management System
          </Text>
        </Box>

        {/* Page Content */}
        <Box flex="1" overflowY="auto" p={{ base: 4, md: 8 }}>
          <Container maxW="7xl" mx="0">
            {children}
          </Container>
        </Box>

        {/* Footer */}
        <Box bg="white" borderTop="1px" borderColor="gray.200" py={4} px={6}>
          <Text textAlign="center" fontSize="xs" color="gray.500">
            Copyright © 2026 - MySmartWarehouse | Advanced Inventory Management System
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}
