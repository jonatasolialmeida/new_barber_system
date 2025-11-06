'use client';

import { useRouter } from 'next/navigation';
import { Container, Box, Typography, Stack, Link as MuiLink, Alert } from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from '@/hooks/useForm';
import { loginSchema, LoginFormData } from '@/lib/validations/schemas';
import { FormField, CheckboxField, FormActions } from '@/components/form';
import { Card, Button } from '@/components/base';
import ThemeToggle from '@/components/ThemeToggle';
import { motion } from 'framer-motion';
import { colors } from '@/styles/designTokens';
import { LockOutlined } from '@mui/icons-material';

const MotionBox = motion(Box);

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    onSubmit: async (data: LoginFormData) => {
      await login(data.email, data.password);
      router.push('/dashboard');
    },
    successMessage: 'Login realizado com sucesso!',
    errorMessage: 'Erro ao fazer login. Verifique suas credenciais.',
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: colors.gradients.barber,
        position: 'relative',
      }}
    >
      {/* Theme Toggle no canto superior direito */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <ThemeToggle size="large" />
      </Box>

      {/* Decorative elements */}
      <MotionBox
        sx={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <MotionBox
        sx={{
          position: 'absolute',
          bottom: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card variant="glass" sx={{ p: 4 }}>
            {/* Logo/Icon */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1976D2 0%, #9C27B0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                }}
              >
                <LockOutlined sx={{ fontSize: 40, color: 'white' }} />
              </Box>
            </Box>

            {/* Header */}
            <Typography variant="h3" component="h1" align="center" fontWeight="bold" gutterBottom>
              Bem-vindo de volta
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
              Acesse sua conta para continuar
            </Typography>

            {/* Error Alert */}
            {form.formState.errors.root && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {form.formState.errors.root.message}
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={form.handleSubmit(form.onSubmit)}>
              <Stack spacing={3}>
                <FormField
                  name="email"
                  control={form.control}
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  autoFocus
                  required
                  showValidationIcon
                />

                <FormField
                  name="password"
                  control={form.control}
                  label="Senha"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  showPasswordToggle
                  required
                  showValidationIcon
                />

                <CheckboxField
                  name="rememberMe"
                  control={form.control}
                  label="Lembrar-me"
                />

                <FormActions align="center">
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    loading={form.formState.isSubmitting}
                    gradient
                    glow
                  >
                    Entrar
                  </Button>
                </FormActions>
              </Stack>
            </form>

            {/* Links */}
            <Stack spacing={2} sx={{ mt: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <MuiLink
                  component={Link}
                  href="/forgot-password"
                  underline="hover"
                  sx={{ fontWeight: 500 }}
                >
                  Esqueceu sua senha?
                </MuiLink>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Não tem uma conta?{' '}
                  <MuiLink
                    component={Link}
                    href="/register"
                    underline="hover"
                    fontWeight="bold"
                  >
                    Cadastre-se
                  </MuiLink>
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <MuiLink
                  component={Link}
                  href="/"
                  underline="hover"
                  variant="body2"
                  color="text.secondary"
                >
                  ← Voltar para a página inicial
                </MuiLink>
              </Box>
            </Stack>
          </Card>
        </MotionBox>
      </Container>
    </Box>
  );
}
