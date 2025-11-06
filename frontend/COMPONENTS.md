# 📚 Guia de Componentes - Barber System

Documentação completa dos componentes customizados do sistema de barbearia.

## 📋 Índice

1. [Componentes Base](#componentes-base)
2. [Componentes de Formulário](#componentes-de-formulário)
3. [Empty States](#empty-states)
4. [Navegação](#navegação)
5. [Animações](#animações)
6. [Validação](#validação)
7. [Tema](#tema)

---

## 🎨 Componentes Base

### Card

Card customizado com múltiplas variantes e animações.

```tsx
import { Card } from '@/components/base';

// Variantes disponíveis
<Card variant="elevated">Padrão com sombra</Card>
<Card variant="outlined">Com borda</Card>
<Card variant="gradient" gradient={colors.gradients.barber}>Com gradiente</Card>
<Card variant="glass">Glassmorphism</Card>
<Card variant="hover" glowColor={colors.primary[500]}>Hover intenso</Card>

// Interativo com animação
<Card interactive onClick={() => console.log('clicked')}>
  Clicável
</Card>
```

**Props:**
- `variant`: 'elevated' | 'outlined' | 'gradient' | 'glass' | 'hover'
- `interactive`: boolean - Adiciona animação scale ao hover/tap
- `gradient`: string - Gradiente customizado (requer variant="gradient")
- `glowColor`: string - Cor do glow (opcional)

---

### Button

Botão customizado com estados de loading e efeitos visuais.

```tsx
import { Button, IconButton, ButtonGroup } from '@/components/base';

// Button básico
<Button variant="contained">Clique aqui</Button>

// Com loading
<Button loading variant="contained">Salvando...</Button>

// Com gradiente
<Button gradient variant="contained">Gradiente animado</Button>

// Com glow
<Button glow variant="contained">Com brilho</Button>

// Combinado
<Button gradient glow loading={isSubmitting}>Enviar</Button>

// IconButton
<IconButton icon={<AddIcon />} ariaLabel="Adicionar" />

// ButtonGroup
<ButtonGroup orientation="horizontal">
  <Button>Opção 1</Button>
  <Button>Opção 2</Button>
  <Button>Opção 3</Button>
</ButtonGroup>
```

**Props:**
- `loading`: boolean - Mostra CircularProgress e desabilita botão
- `gradient`: boolean - Aplica gradiente animado
- `glow`: boolean - Adiciona efeito glow no hover
- `icon`: ReactNode - Ícone antes do texto

---

### Input

Input customizado com validação visual e variantes.

```tsx
import { Input, TextArea, SearchInput } from '@/components/base';

// Input básico
<Input label="Nome" placeholder="Digite seu nome" />

// Com validação visual
<Input
  label="Email"
  type="email"
  showValidationIcon
  success={isValid}
  error={hasError}
  helperText="Email inválido"
/>

// Input de senha com toggle
<Input
  label="Senha"
  type="password"
  showPasswordToggle
  showValidationIcon
  hint="Mínimo 8 caracteres"
/>

// Variantes
<Input variant="outlined" label="Padrão" />
<Input variant="filled" label="Preenchido" />
<Input variant="glass" label="Glassmorphism" />

// TextArea
<TextArea label="Observações" rows={4} />

// SearchInput
<SearchInput onSearch={(value) => console.log(value)} />
```

**Props:**
- `variant`: 'outlined' | 'filled' | 'glass'
- `showPasswordToggle`: boolean - Toggle de visibilidade (type="password")
- `showValidationIcon`: boolean - Ícones CheckCircle/Error
- `hint`: string - Texto de dica animado
- `success`: boolean - Estado de sucesso (ícone verde)

---

## 📝 Componentes de Formulário

### FormField

Input integrado com React Hook Form e validação Zod.

```tsx
import { useForm } from '@/hooks/useForm';
import { FormField, FormActions } from '@/components/form';
import { loginSchema } from '@/lib/validations/schemas';

function LoginForm() {
  const form = useForm({
    schema: loginSchema,
    onSubmit: async (data) => {
      await api.login(data);
    },
  });

  return (
    <form onSubmit={form.handleSubmit(form.onSubmit)}>
      <FormField
        name="email"
        control={form.control}
        label="Email"
        type="email"
        required
        showValidationIcon
      />

      <FormField
        name="password"
        control={form.control}
        label="Senha"
        type="password"
        showPasswordToggle
        required
      />

      <FormActions>
        <Button type="submit" loading={form.formState.isSubmitting}>
          Entrar
        </Button>
      </FormActions>
    </form>
  );
}
```

---

### SelectField

```tsx
import { SelectField } from '@/components/form';

<SelectField
  name="service"
  control={form.control}
  label="Serviço"
  options={[
    { value: '1', label: 'Corte' },
    { value: '2', label: 'Barba' },
    { value: '3', label: 'Corte + Barba' },
  ]}
  required
/>
```

---

### CheckboxField

```tsx
import { CheckboxField } from '@/components/form';

<CheckboxField
  name="acceptTerms"
  control={form.control}
  label="Aceito os termos de uso"
  helperText="Obrigatório para continuar"
/>
```

---

### RadioField

```tsx
import { RadioField } from '@/components/form';

<RadioField
  name="paymentMethod"
  control={form.control}
  label="Forma de Pagamento"
  options={[
    { value: 'credit', label: 'Cartão de Crédito' },
    { value: 'debit', label: 'Cartão de Débito' },
    { value: 'cash', label: 'Dinheiro' },
  ]}
  row
/>
```

---

### SwitchField

```tsx
import { SwitchField } from '@/components/form';

<SwitchField
  name="notifications"
  control={form.control}
  label="Receber notificações"
  helperText="Enviaremos lembretes de agendamento"
/>
```

---

## 📭 Empty States

### EmptyState Base

```tsx
import EmptyState from '@/components/EmptyState';

<EmptyState
  illustration="appointments"
  title="Nenhum agendamento"
  description="Você ainda não tem agendamentos"
  size="medium"
  variant="card"
  action={{
    label: "Novo Agendamento",
    onClick: () => router.push('/appointments/new'),
    icon: <AddIcon />
  }}
  secondaryAction={{
    label: "Ver Histórico",
    onClick: () => router.push('/history')
  }}
/>
```

**Ilustrações disponíveis:**
- `search` - Busca sem resultados
- `appointments` - Agendamentos vazios
- `inbox` - Caixa de entrada vazia
- `error` - Erro genérico
- `offline` - Sem conexão
- `folder` - Pasta vazia
- `notifications` - Sem notificações

**Variantes:**
- `default` - Padrão sem container
- `card` - Dentro de um Card
- `minimal` - Minimalista

**Tamanhos:**
- `small` - Ícone 60px
- `medium` - Ícone 80px (padrão)
- `large` - Ícone 120px

---

### Estados Pré-configurados

```tsx
import {
  NoAppointments,
  NoSearchResults,
  NoServices,
  NoBarbers,
  NoRevenue,
  NoReports,
  ErrorState,
  OfflineState,
} from '@/components/EmptyState';

// Lista de agendamentos vazia
<NoAppointments
  onAction={() => router.push('/appointments/new')}
  actionLabel="Fazer Agendamento"
/>

// Busca sem resultados
<NoSearchResults />

// Lista de serviços vazia
<NoServices
  onAction={() => router.push('/admin/services/new')}
/>

// Equipe vazia
<NoBarbers
  onAction={() => router.push('/admin/barbers/new')}
/>

// Sem receita
<NoRevenue />

// Dados insuficientes
<NoReports />

// Erro com retry
<ErrorState
  title="Erro ao carregar"
  description="Não foi possível carregar os dados"
  onRetry={() => refetch()}
/>

// Offline
<OfflineState onRetry={() => reconnect()} />
```

---

## 🧭 Navegação

### Navbar

Barra de navegação com menu de usuário e theme toggle.

```tsx
import Navbar from '@/components/Navbar';

// Uso básico
<Navbar />

// Com título customizado
<Navbar title="Dashboard" />
```

**Features:**
- Logo animada clicável (vai para dashboard)
- ThemeToggle integrado
- Menu de usuário com:
  - Avatar com iniciais
  - Nome e email
  - Link para Dashboard
  - Link para Perfil
  - Botão Sair
- Glassmorphism design
- Sticky position

---

### ThemeToggle

Botão para alternar entre tema claro e escuro.

```tsx
import ThemeToggle from '@/components/ThemeToggle';

// Básico
<ThemeToggle />

// Com tamanho customizado
<ThemeToggle size="large" />

// Com label
<ThemeToggle showLabel />
```

**Props:**
- `size`: 'small' | 'medium' | 'large'
- `showLabel`: boolean - Mostra texto "Claro"/"Escuro"

**Hook de tema:**
```tsx
import { useThemeMode } from '@/contexts/ThemeContext';

const { mode, toggleTheme, setTheme } = useThemeMode();

// Modo atual
console.log(mode); // 'light' ou 'dark'

// Alternar
toggleTheme();

// Definir específico
setTheme('dark');
```

---

## 🎭 Animações

### PageTransition

Transições de página com Framer Motion.

```tsx
import { PageTransition } from '@/components/PageTransition';

<PageTransition variant="slideUp">
  <YourPageContent />
</PageTransition>
```

**Variantes disponíveis:**
- `fade` - Fade simples
- `slideRight` - Desliza da direita
- `slideLeft` - Desliza da esquerda
- `slideUp` - Desliza de baixo (padrão)
- `scale` - Scale com fade
- `blur` - Blur e fade
- `rotate3D` - Rotação 3D

---

### StaggerTransition

Animação escalonada para listas.

```tsx
import { StaggerTransition, StaggerItem } from '@/components/PageTransition';

<StaggerTransition staggerDelay={0.1}>
  <Grid container>
    {items.map((item) => (
      <StaggerItem key={item.id}>
        <Card>{item.name}</Card>
      </StaggerItem>
    ))}
  </Grid>
</StaggerTransition>
```

---

### RevealTransition

Animação de revelação ao scroll.

```tsx
import { RevealTransition } from '@/components/PageTransition';

<RevealTransition direction="bottom" delay={0.2}>
  <Card>Aparece ao entrar na viewport</Card>
</RevealTransition>
```

**Direções:**
- `left` - Vem da esquerda
- `right` - Vem da direita
- `top` - Vem de cima
- `bottom` - Vem de baixo

---

### LoadingTransition

Transição entre loading e conteúdo.

```tsx
import { LoadingTransition } from '@/components/PageTransition';
import { DashboardCardSkeleton } from '@/components/SkeletonLoaders';

<LoadingTransition
  isLoading={loading}
  loader={<DashboardCardSkeleton />}
>
  <DashboardCard data={data} />
</LoadingTransition>
```

---

## ✅ Validação

### Schemas Zod

```tsx
import {
  loginSchema,
  registerSchema,
  appointmentSchema,
  profileSchema,
  serviceSchema,
  contactSchema,
  emailSchema,
  passwordSchema,
  phoneSchema,
  cpfSchema,
  cepSchema,
} from '@/lib/validations/schemas';

// Uso direto
const result = loginSchema.safeParse(data);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}

// Com useForm
const form = useForm({
  schema: registerSchema,
  // ...
});
```

---

### useForm Hook

Hook customizado com Zod + React Hook Form.

```tsx
import { useForm } from '@/hooks/useForm';
import { loginSchema, LoginFormData } from '@/lib/validations/schemas';

const form = useForm({
  schema: loginSchema,
  defaultValues: {
    email: '',
    password: '',
    rememberMe: false,
  },
  onSubmit: async (data: LoginFormData) => {
    await api.login(data);
    router.push('/dashboard');
  },
  successMessage: 'Login realizado!',
  errorMessage: 'Erro ao fazer login',
  onSuccess: (data) => {
    console.log('Success!', data);
  },
  onError: (error) => {
    console.error('Error!', error);
  },
});

// Estados disponíveis
form.formState.isSubmitting
form.formState.errors
form.formState.isValid

// Métodos
form.handleSubmit(form.onSubmit)
form.reset()
form.setValue('email', 'test@test.com')
form.watch('email')
```

---

### useMultiStepForm

Para formulários de múltiplas etapas.

```tsx
import { useMultiStepForm } from '@/hooks/useForm';

const form = useMultiStepForm({
  schema: profileSchema,
  steps: 3,
  onSubmit: async (data) => {
    await api.updateProfile(data);
  },
});

// Estados adicionais
form.currentStep // 0, 1, 2
form.isFirstStep // boolean
form.isLastStep // boolean
form.progress // 33, 66, 100

// Métodos adicionais
form.nextStep()
form.prevStep()
form.goToStep(1)
```

---

## 🎨 Tema

### Design Tokens

```tsx
import { colors, typography, borderRadius, shadows, transitions } from '@/styles/designTokens';

// Cores
colors.primary[500]
colors.secondary[600]
colors.success[700]
colors.gradients.barber
colors.gradients.sunset

// Tipografia
typography.fontSize.xl
typography.fontWeight.bold
typography.fontFamily.primary

// Border radius
borderRadius.base // 8px
borderRadius.lg // 16px
borderRadius.full // 9999px

// Sombras
shadows.sm
shadows.md
shadows.lg
shadows.primaryGlow

// Transições
transitions.duration.fast // 0.15s
transitions.easing.smooth // cubic-bezier
```

---

## 🏗️ Skeleton Loaders

```tsx
import {
  CardSkeleton,
  ServiceCardSkeleton,
  TableRowSkeleton,
  DashboardCardSkeleton,
  ListItemSkeleton,
  ProfileSkeleton,
  FormSkeleton,
  PageSkeleton,
  AnimatedSkeleton,
  AppointmentCardSkeleton,
  ChartSkeleton,
  GridSkeleton,
} from '@/components/SkeletonLoaders';

// Uso básico
{loading && <DashboardCardSkeleton />}

// Grid de skeletons
<GridSkeleton count={6} columns={3} />

// Tabela
{[...Array(5)].map((_, i) => (
  <TableRowSkeleton key={i} columns={4} />
))}
```

---

## 📖 Exemplos Completos

### Página de Login Completa

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { Container, Box, Typography, Stack } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from '@/hooks/useForm';
import { loginSchema } from '@/lib/validations/schemas';
import { FormField, CheckboxField, FormActions } from '@/components/form';
import { Card, Button } from '@/components/base';
import ThemeToggle from '@/components/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm({
    schema: loginSchema,
    onSubmit: async (data) => {
      await login(data.email, data.password);
      router.push('/dashboard');
    },
    successMessage: 'Login realizado!',
  });

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <ThemeToggle />
      </Box>

      <Container maxWidth="sm">
        <Card variant="glass" sx={{ p: 4 }}>
          <Typography variant="h3" align="center" gutterBottom>
            Login
          </Typography>

          <form onSubmit={form.handleSubmit(form.onSubmit)}>
            <Stack spacing={3}>
              <FormField
                name="email"
                control={form.control}
                label="Email"
                type="email"
                required
                showValidationIcon
              />

              <FormField
                name="password"
                control={form.control}
                label="Senha"
                type="password"
                showPasswordToggle
                required
              />

              <CheckboxField
                name="rememberMe"
                control={form.control}
                label="Lembrar-me"
              />

              <FormActions>
                <Button
                  type="submit"
                  fullWidth
                  gradient
                  glow
                  loading={form.formState.isSubmitting}
                >
                  Entrar
                </Button>
              </FormActions>
            </Stack>
          </form>
        </Card>
      </Container>
    </Box>
  );
}
```

---

### Lista com Empty State

```tsx
'use client';

import { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import Navbar from '@/components/Navbar';
import { LoadingTransition } from '@/components/PageTransition';
import { NoAppointments } from '@/components/EmptyState';
import { AppointmentCardSkeleton } from '@/components/SkeletonLoaders';
import AppointmentCard from './AppointmentCard';
import api from '@/services/api';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const { data } = await api.get('/appointments/');
      setAppointments(data.results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar title="Agendamentos" />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LoadingTransition
          isLoading={loading}
          loader={
            <Grid container spacing={2}>
              {[...Array(6)].map((_, i) => (
                <Grid item xs={12} md={6} key={i}>
                  <AppointmentCardSkeleton />
                </Grid>
              ))}
            </Grid>
          }
        >
          {appointments.length === 0 ? (
            <NoAppointments
              onAction={() => router.push('/appointments/new')}
            />
          ) : (
            <Grid container spacing={2}>
              {appointments.map((appointment) => (
                <Grid item xs={12} md={6} key={appointment.id}>
                  <AppointmentCard appointment={appointment} />
                </Grid>
              ))}
            </Grid>
          )}
        </LoadingTransition>
      </Container>
    </>
  );
}
```

---

## 🚀 Dicas e Boas Práticas

1. **Sempre use componentes base** ao invés dos do MUI diretamente
2. **Valide todos os formulários** com Zod
3. **Adicione empty states** em todas as listagens
4. **Use skeleton loaders** para estados de loading
5. **Aplique animações** com PageTransition
6. **Mantenha consistência** com design tokens
7. **Teste dark mode** em todos os componentes
8. **Documente** componentes novos seguindo este padrão

---

## 📚 Referências

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Zod Documentation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Material-UI](https://mui.com/)

---

**Última atualização:** 2025-11-06
**Versão:** 1.0.0
