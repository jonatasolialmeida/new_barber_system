'use client';

import { useRouter } from 'next/navigation';
import { Container, Box, Typography, Stack, Link as MuiLink, GridLegacy as Grid, Alert } from '@mui/material';
import Link from 'next/link';
import api from '@/services/api';
import { useForm } from '@/hooks/useForm';
import { registerSchema, RegisterFormData } from '@/lib/validations/schemas';
import { FormField, CheckboxField, FormActions } from '@/components/form';
import { Card, Button } from '@/components/base';
import ThemeToggle from '@/components/ThemeToggle';
import { motion } from 'framer-motion';
import { colors } from '@/styles/designTokens';
import { PersonAddOutlined } from '@mui/icons-material';

const MotionBox = motion(Box);

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm({
    schema: registerSchema,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    onSubmit: async (data: RegisterFormData) => {
      await api.post('/users/', {
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        role: 'CLIENT',
      });

      router.push('/login?registered=true');
    },
    successMessage: 'Conta criada com sucesso! Faça login para continuar.',
    errorMessage: 'Erro ao criar conta. Verifique os dados e tente novamente.',
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 4,
        background: colors.gradients.barber,
        position: 'relative',
      }}
    >
      {/* Theme Toggle */}
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

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
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
                <PersonAddOutlined sx={{ fontSize: 40, color: 'white' }} />
              </Box>
            </Box>

            {/* Header */}
            <Typography variant="h3" component="h1" align="center" fontWeight="bold" gutterBottom>
              Criar sua conta
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
              Preencha seus dados para começar
            </Typography>

            {/* Error Alert */}
            {form.formState.errors.root && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {form.formState.errors.root.message}
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={form.onSubmit}>
              <Stack spacing={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormField
                      name="firstName"
                      control={form.control}
                      label="Nome"
                      placeholder="João"
                      autoFocus
                      required
                      showValidationIcon
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormField
                      name="lastName"
                      control={form.control}
                      label="Sobrenome"
                      placeholder="Silva"
                      required
                      showValidationIcon
                    />
                  </Grid>
                </Grid>

                <FormField
                  name="email"
                  control={form.control}
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                  showValidationIcon
                />

                <FormField
                  name="phone"
                  control={form.control}
                  label="Telefone"
                  type="tel"
                  placeholder="(11) 98765-4321"
                  required
                  showValidationIcon
                  hint="Formato: (11) 98765-4321"
                />

                <FormField
                  name="password"
                  control={form.control}
                  label="Senha"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  showPasswordToggle
                  required
                  showValidationIcon
                  hint="Mínimo 8 caracteres, com maiúscula, minúscula e número"
                />

                <FormField
                  name="confirmPassword"
                  control={form.control}
                  label="Confirmar Senha"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  showPasswordToggle
                  required
                  showValidationIcon
                />

                <CheckboxField
                  name="acceptTerms"
                  control={form.control}
                  label={
                    <span>
                      Eu aceito os{' '}
                      <MuiLink href="/terms" target="_blank" underline="hover">
                        termos de uso
                      </MuiLink>{' '}
                      e{' '}
                      <MuiLink href="/privacy" target="_blank" underline="hover">
                        política de privacidade
                      </MuiLink>
                    </span>
                  }
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
                    Criar Conta
                  </Button>
                </FormActions>
              </Stack>
            </form>

            {/* Links */}
            <Stack spacing={2} sx={{ mt: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Já tem uma conta?{' '}
                  <MuiLink component={Link} href="/login" underline="hover" fontWeight="bold">
                    Faça login
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
