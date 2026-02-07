import {
  Box,
  Flex,
  VStack,
  Button,
  Text,
  Icon,
  useBreakpointValue,
  IconButton,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  FiPackage,
  FiHome,
  FiTag,
  FiBox,
  FiActivity,
  FiMenu,
  FiX,
  FiChevronDown,
  FiBarChart2,
  FiArchive,
  FiLogOut,
  FiUsers,
} from 'react-icons/fi';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  children?: NavItem[];
}

/**
 * Sidebar navigation component untuk warehouse management
 * Dapat di-collapse dan responsive untuk mobile
 */
export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { url, props } = usePage();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const user = (props.auth as Record<string, unknown>)?.user;
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    router.post('/logout');
  };

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/warehouse/dashboard',
      icon: <FiHome size={20} />,
    },
    {
      label: 'Kategori',
      href: '/warehouse/categories',
      icon: <FiTag size={20} />,
    },
    {
      label: 'Produk',
      href: '/warehouse/products',
      icon: <FiBox size={20} />,
    },
    {
      label: 'Mutasi Stok',
      href: '/warehouse/transactions',
      icon: <FiActivity size={20} />,
    },
    {
      label: 'Laporan Stok',
      href: '/warehouse/reports/stock',
      icon: <FiBarChart2 size={20} />,
    },
    {
      label: 'Laporan Mutasi',
      href: '/warehouse/reports/transactions',
      icon: <FiBarChart2 size={20} />,
    },
    {
      label: 'Stock Snapshots',
      href: '/warehouse/reports/snapshots',
      icon: <FiArchive size={20} />,
    },
    // Manajemen User - hanya untuk admin
    ...(isAdmin ? [{
      label: 'Manajemen User',
      href: '/warehouse/users',
      icon: <FiUsers size={20} />,
    }] : []),
  ];

  const isActive = (href: string) => {
    return url.startsWith(href);
  };

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);

    return (
      <ChakraLink
        _hover={{ textDecoration: 'none' }}
        onClick={() => router.visit(item.href)}
      >
        <Box
          w="full"
          px={4}
          py={3}
          rounded="lg"
          cursor="pointer"
          bg={active ? 'teal.100' : 'transparent'}
          color={active ? 'teal.700' : 'gray.700'}
          borderLeft={active ? '4px solid' : '4px solid transparent'}
          borderLeftColor={active ? 'teal.500' : 'transparent'}
          _hover={{
            bg: active ? 'teal.100' : 'gray.100',
            color: active ? 'teal.700' : 'gray.900',
          }}
          transition="all 0.2s"
          display="flex"
          alignItems="center"
          gap={3}
          fontWeight={active ? 'semibold' : 'normal'}
        >
          <Icon>{item.icon}</Icon>
          {!isCollapsed && <Text fontSize="sm">{item.label}</Text>}
        </Box>
      </ChakraLink>
    );
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <IconButton
          aria-label="Toggle sidebar"
          position="fixed"
          top={4}
          left={4}
          zIndex={200}
          onClick={() => setIsCollapsed(!isCollapsed)}
          colorScheme="teal"
        >
          {isCollapsed ? <FiMenu /> : <FiX />}
        </IconButton>
      )}

      {/* Sidebar */}
      <Box
        as="aside"
        w={isCollapsed ? '80px' : '250px'}
        flexShrink={0}
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        shadow="sm"
        h="100vh"
        position={{ base: 'fixed', md: 'sticky' }}
        top={0}
        left={0}
        zIndex={150}
        transition="width 0.3s"
        display={{ base: isCollapsed ? 'none' : 'block', md: 'flex' }}
        flexDirection="column"
      >
        {/* Logo Section */}
        <Box p={4} borderBottom="1px" borderColor="gray.200" flexShrink={0}>
          <Flex align="center" gap={3} justify={isCollapsed ? 'center' : 'flex-start'}>
            <Icon color="teal.600" fontSize="24px">
              <FiPackage />
            </Icon>
            {!isCollapsed && (
              <Box>
                <Text fontSize="sm" fontWeight="bold" color="teal.600">
                  SmartWare
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Inventory
                </Text>
              </Box>
            )}
          </Flex>
        </Box>

        {/* Navigation Items - Scrollable */}
        <Box flex="1" overflowY="auto" py={4}>
          <VStack gap={1} align="stretch" px={4}>
            {navItems.map((item) => (
              <NavItemComponent key={item.href} item={item} />
            ))}
          </VStack>
        </Box>

        {/* Collapse Toggle Button - Fixed at bottom */}
        <Box p={4} borderTop="1px" borderColor="gray.200" flexShrink={0}>
          <Button
            w="full"
            size="sm"
            variant="ghost"
            colorScheme="gray"
            justifyContent="center"
            onClick={() => setIsCollapsed(!isCollapsed)}
            display={{ base: 'none', md: 'flex' }}
            gap={2}
          >
            {isCollapsed ? <FiChevronDown /> : <FiX />}
            {!isCollapsed && <Text fontSize="xs">Collapse</Text>}
          </Button>

          <Button
            w="full"
            mt={2}
            size="sm"
            variant="solid"
            colorScheme="red"
            justifyContent="center"
            onClick={handleLogout}
            gap={2}
          >
            <FiLogOut />
            {!isCollapsed && <Text fontSize="xs">Logout</Text>}
          </Button>
        </Box>
      </Box>
    </>
  );
}
