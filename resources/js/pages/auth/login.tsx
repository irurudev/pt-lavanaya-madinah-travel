import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Stack,
  Text,
  Heading,
  Grid,
} from '@chakra-ui/react';
import { router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { FiUser, FiTool, FiEye } from 'react-icons/fi';

interface DemoAccount {
  name: string;
  email: string;
  password: string;
  icon: React.ReactNode;
  description: string;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoAccounts: DemoAccount[] = [
    {
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password',
      icon: <FiUser size={32} />,
      description: 'Akses penuh ke semua fitur',
    },
    {
      name: 'Operator',
      email: 'operator@example.com',
      password: 'password',
      icon: <FiTool size={32} />,
      description: 'Kelola transaksi warehouse',
    },
    {
      name: 'Viewer',
      email: 'viewer@example.com',
      password: 'password',
      icon: <FiEye size={32} />,
      description: 'Lihat laporan dan statistik',
    },
  ];

  const handleLogin = (email: string, password: string) => {
    setError('');
    setLoading(true);

    // Gunakan Inertia router untuk POST - otomatis handle CSRF
    router.post('/login', 
      { email, password },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          // Login berhasil - redirect sudah ditangani server
          setLoading(false);
        },
        onError: (errors: Record<string, unknown>) => {
          // Handle validation errors dari Laravel
          setLoading(false);
          // Inertia errors bisa berupa string atau array
          const emailError = errors.email;
          const errorMsg = typeof emailError === 'string' 
            ? emailError 
            : (Array.isArray(emailError) ? emailError[0] : 'Email atau password salah');
          setError(errorMsg as string);
        },
      }
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const handleQuickLogin = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword(account.password);
    handleLogin(account.email, account.password);
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Container maxW="2xl" py={8}>
        <Stack gap={8}>
          {/* Header */}
          <Box textAlign="center">
            <Heading size="2xl" mb={2}>
              MySmartWarehouse
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Advanced Inventory Management System
            </Text>
          </Box>

          {/* Login Form */}
          <Box bg="white" shadow="md" rounded="lg" p={8}>
            <Heading size="md" mb={6}>
              Login Dengan Email
            </Heading>

            {error && (
              <Box bg="red.50" border="1px" borderColor="red.200" p={4} rounded="md" mb={6}>
                <Text color="red.700" fontSize="sm">{error}</Text>
              </Box>
            )}

            <form onSubmit={handleSubmit}>
              <Stack gap={4}>
                <Box>
                  <Text mb={2} fontWeight="medium">Email</Text>
                  <Input
                    type="email"
                    placeholder="Masukkan email Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    size="lg"
                  />
                </Box>

                <Box>
                  <Text mb={2} fontWeight="medium">Password</Text>
                  <Input
                    type="password"
                    placeholder="Masukkan password Anda"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    size="lg"
                  />
                </Box>

                <Button 
                  type="submit" 
                  colorScheme="teal"
                  width="full"
                  size="lg"
                  loading={loading}
                  mt={4}
                >
                  Login
                </Button>
              </Stack>
            </form>
          </Box>

          {/* Quick Access Cards */}
          <Box>
            <Text mb={4} fontWeight="bold" fontSize="sm" color="gray.600">
              ATAU GUNAKAN AKUN DEMO
            </Text>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
              {demoAccounts.map((account) => (
                <Box
                  key={account.email}
                  bg="white"
                  shadow="md"
                  rounded="lg"
                  p={6}
                  cursor="pointer"
                  transition="all 0.3s"
                  _hover={{
                    shadow: 'lg',
                    transform: 'translateY(-4px)',
                    borderColor: 'teal.500',
                    borderWidth: '2px',
                    bg: 'teal.50',
                  }}
                  borderWidth="2px"
                  borderColor="gray.200"
                  onClick={() => handleQuickLogin(account)}
                >
                  <Stack align="center" gap={4}>
                    <Box color="teal.500">
                      {account.icon}
                    </Box>
                    <Box textAlign="center">
                      <Heading size="sm" mb={1}>
                        {account.name}
                      </Heading>
                      <Text fontSize="xs" color="gray.600" mb={2}>
                        {account.description}
                      </Text>
                      <Text fontSize="xs" color="gray.500" fontFamily="mono">
                        {account.email}
                      </Text>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Grid>
          </Box>

          {/* Footer Info */}
          <Box textAlign="center" py={2}>
            <Text fontSize="xs" color="gray.500">
              Password untuk semua akun demo: <strong>password</strong>
            </Text>
          </Box>
        </Stack>
      </Container>
    </Flex>
  );
}
