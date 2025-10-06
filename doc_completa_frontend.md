# Documentação Completa - Frontend

## 1. Visão Geral

O frontend do Sistema de Agendamento para Barbearia é uma aplicação web moderna construída com Next.js 15, React 19 e Material UI 6. Utiliza TypeScript para garantir segurança de tipos e oferece uma interface responsiva e intuitiva para clientes, barbeiros e proprietários.

## 2. Tecnologias e Dependências

### 2.1 Frameworks e Bibliotecas Principais

**Next.js 15.1.4**
- Framework React com renderização híbrida (SSR/SSG/CSR)
- App Router (nova arquitetura de roteamento)
- Otimização automática de imagens e assets
- Hot Module Replacement (HMR) em desenvolvimento

**React 19.0.0**
- Biblioteca JavaScript para construção de interfaces
- Componentes funcionais com Hooks
- Context API para gerenciamento de estado global

**TypeScript 5**
- Superset JavaScript com tipagem estática
- Interfaces e tipos customizados
- IntelliSense e validação em tempo de desenvolvimento

### 2.2 UI e Estilização

**Material UI 6.3.0**
- Biblioteca de componentes baseada em Material Design
- Sistema de temas customizável
- Componentes acessíveis (ARIA compliant)
- Grid system responsivo

**@emotion/react e @emotion/styled**
- CSS-in-JS para estilização
- Suporte a temas dinâmicos
- Performance otimizada

**@mui/icons-material**
- Conjunto completo de ícones Material Design
- Mais de 2000 ícones disponíveis

**@mui/x-date-pickers**
- Componentes de seleção de data
- Integração com date-fns
- Localization em português

### 2.3 Utilitários

**Axios 1.7.9**
- Cliente HTTP para chamadas à API
- Interceptors para autenticação
- Tratamento centralizado de erros

**date-fns 4.1.0**
- Biblioteca de manipulação de datas
- Funções de formatação
- Leve e modular

### 2.4 Ferramentas de Desenvolvimento

**ESLint**
- Linting de código JavaScript/TypeScript
- Configuração next/core-web-vitals

**TypeScript Compiler**
- Verificação de tipos
- Transpilação para JavaScript

## 3. Estrutura de Diretórios

```
frontend/
├── src/
│   ├── app/                          # Pages (App Router)
│   │   ├── layout.tsx                # Layout raiz da aplicação
│   │   ├── page.tsx                  # Página inicial (/)
│   │   ├── login/
│   │   │   └── page.tsx              # Página de login
│   │   ├── register/
│   │   │   └── page.tsx              # Página de cadastro
│   │   ├── forgot-password/
│   │   │   └── page.tsx              # Solicitar reset de senha
│   │   ├── password-reset/
│   │   │   └── [uid]/
│   │   │       └── [token]/
│   │   │           └── page.tsx      # Reset de senha com token
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Dashboard do usuário
│   │   ├── appointments/
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Novo agendamento
│   │   │   └── history/
│   │   │       └── page.tsx          # Histórico de agendamentos
│   │   ├── barber/                   # Rotas exclusivas do barbeiro
│   │   │   ├── schedule/
│   │   │   │   └── page.tsx          # Agenda do barbeiro
│   │   │   ├── blocks/
│   │   │   │   └── page.tsx          # Bloqueios de agenda
│   │   │   └── reports/
│   │   │       └── page.tsx          # Relatórios do barbeiro
│   │   └── admin/                    # Rotas exclusivas do proprietário
│   │       ├── overview/
│   │       │   └── page.tsx          # Visão geral
│   │       ├── register-barber/
│   │       │   └── page.tsx          # Cadastrar barbeiro
│   │       ├── barbers/
│   │       │   └── page.tsx          # Lista de barbeiros
│   │       ├── services/
│   │       │   ├── page.tsx          # Lista de serviços
│   │       │   ├── new/
│   │       │   │   └── page.tsx      # Novo serviço
│   │       │   └── [id]/
│   │       │       └── page.tsx      # Editar serviço
│   │       ├── appointments/
│   │       │   └── page.tsx          # Todos agendamentos
│   │       └── reports/
│   │           ├── barbers/
│   │           │   └── page.tsx      # Relatório de barbeiros
│   │           └── services/
│   │               └── page.tsx      # Relatório de serviços
│   │
│   ├── components/                   # Componentes reutilizáveis
│   │   ├── ThemeRegistry.tsx         # Provider do tema Material UI
│   │   └── ProtectedRoute.tsx        # HOC para rotas protegidas
│   │
│   ├── contexts/                     # Context API
│   │   └── AuthContext.tsx           # Contexto de autenticação
│   │
│   ├── services/                     # Serviços e integrações
│   │   ├── api.ts                    # Cliente Axios configurado
│   │   └── auth.ts                   # Serviço de autenticação
│   │
│   ├── types/                        # Definições TypeScript
│   │   └── index.ts                  # Interfaces e tipos
│   │
│   └── utils/                        # Funções utilitárias
│       └── theme.ts                  # Configuração do tema MUI
│
├── public/                           # Arquivos públicos estáticos
│
├── package.json                      # Dependências e scripts
├── tsconfig.json                     # Configuração TypeScript
├── next.config.ts                    # Configuração Next.js
├── next-env.d.ts                     # Tipos Next.js
├── Dockerfile                        # Imagem Docker produção
└── Dockerfile.dev                    # Imagem Docker desenvolvimento
```

## 4. Arquitetura e Padrões

### 4.1 App Router (Next.js 15)

O projeto utiliza o **App Router**, a nova arquitetura de roteamento do Next.js que substitui o Pages Router.

**Características:**
- Roteamento baseado em sistema de arquivos
- Layouts aninhados
- Server Components por padrão
- Client Components com `'use client'`
- Streaming e Suspense nativos

**Convenções de Arquivo:**
- `layout.tsx`: Layout compartilhado
- `page.tsx`: Página da rota
- `loading.tsx`: Estado de carregamento
- `error.tsx`: Tratamento de erros

### 4.2 Componentes Client vs Server

**Server Components (padrão):**
- Renderizados no servidor
- Acesso direto a dados backend
- Bundle JavaScript menor

**Client Components (`'use client'`):**
- Interatividade com useState, useEffect
- Event handlers
- Context API
- Hooks personalizados

**Nota:** Todas as páginas do projeto atual usam `'use client'` devido à necessidade de:
- Gerenciamento de estado (useState)
- Efeitos colaterais (useEffect)
- Context de autenticação
- Interações do usuário

### 4.3 Gerenciamento de Estado

**Context API (AuthContext)**
- Estado global de autenticação
- Informações do usuário logado
- Funções de login/logout
- Verificação de autenticação

**Estado Local (useState)**
- Formulários
- Dados específicos da página
- UI state (loading, errors)

### 4.4 Estilização

**Material UI Theme System:**
```typescript
// utils/theme.ts
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif'
  }
});
```

**Métodos de Estilização:**
1. **sx prop** (recomendado):
```tsx
<Box sx={{ mt: 2, p: 3, bgcolor: 'primary.main' }} />
```

2. **styled() API**:
```tsx
const StyledBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2)
}));
```

3. **CSS-in-JS com Emotion**:
```tsx
<div css={{ color: 'red' }} />
```

## 5. Principais Módulos e Funcionalidades

### 5.1 Autenticação (AuthContext)

**Arquivo:** `src/contexts/AuthContext.tsx`

**Responsabilidades:**
- Gerenciar estado de autenticação
- Persistir tokens no localStorage
- Carregar usuário atual
- Fornecer funções de login/logout

**Interface:**
```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

**Uso:**
```tsx
const { user, login, logout, isAuthenticated } = useAuth();
```

**Fluxo de Autenticação:**
1. Usuário insere credenciais
2. `login()` chama `authService.login()`
3. Backend retorna access token + refresh token
4. Tokens salvos no localStorage
5. `getCurrentUser()` busca dados do usuário
6. Estado `user` é atualizado
7. Aplicação redireciona para dashboard

### 5.2 Serviço de API (api.ts)

**Arquivo:** `src/services/api.ts`

**Configuração:**
```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Interceptor de Request:**
- Adiciona token JWT automaticamente
- Header: `Authorization: Bearer {token}`

**Interceptor de Response:**
- Detecta erros 401 (Unauthorized)
- Tenta renovar token com refresh token
- Se falhar, desloga usuário

**Uso:**
```typescript
// GET
const response = await api.get('/services/');

// POST
await api.post('/appointments/', data);

// PUT
await api.put(`/services/${id}/`, data);

// DELETE
await api.delete(`/appointments/${id}/`);
```

### 5.3 Serviço de Autenticação (auth.ts)

**Arquivo:** `src/services/auth.ts`

**Funções Principais:**

**login(credentials):**
```typescript
await authService.login({ email, password });
```
- Envia credenciais para `/api/token/`
- Salva tokens no localStorage
- Retorna dados da resposta

**logout():**
```typescript
authService.logout();
```
- Remove tokens do localStorage
- Limpa estado de autenticação

**getCurrentUser():**
```typescript
const user = await authService.getCurrentUser();
```
- Busca `/api/users/me/`
- Retorna dados do usuário autenticado

**isAuthenticated():**
```typescript
if (authService.isAuthenticated()) { ... }
```
- Verifica se existe access token
- Retorna boolean

**refreshToken():**
```typescript
await authService.refreshToken();
```
- Usa refresh token para obter novo access token
- Atualiza localStorage

### 5.4 Tipos TypeScript (types/index.ts)

**Arquivo:** `src/types/index.ts`

**Interfaces Principais:**

```typescript
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  birth_date?: string;
  role: 'CLIENT' | 'BARBER' | 'OWNER';
  is_active: boolean;
  receive_email_notifications: boolean;
  receive_sms_notifications: boolean;
  receive_whatsapp_notifications: boolean;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: string;
  image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  client: User;
  barber: User;
  service: Service;
  date: string;
  start_time: string;
  end_time: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
  price_charged: string;
  confirmation_sent: boolean;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScheduleBlock {
  id: number;
  barber: number;
  date: string;
  start_time?: string;
  end_time?: string;
  all_day: boolean;
  reason?: string;
}
```

### 5.5 Tema Material UI (utils/theme.ts)

**Arquivo:** `src/utils/theme.ts`

**Configuração:**
```typescript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
```

**ThemeRegistry:**
```tsx
// components/ThemeRegistry.tsx
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/utils/theme';

export default function ThemeRegistry({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

## 6. Páginas e Rotas Detalhadas

### 6.1 Páginas Públicas

#### Login (`/login`)
**Arquivo:** `src/app/login/page.tsx`

**Funcionalidades:**
- Formulário de login (e-mail e senha)
- Validação de campos obrigatórios
- Tratamento de erros
- Links para cadastro e recuperação de senha
- Redirecionamento após login bem-sucedido

**Componentes MUI Utilizados:**
- Container, Box, Paper
- TextField (email, password)
- Button
- Alert (erros)
- Link/Typography

**Fluxo:**
1. Usuário preenche e-mail e senha
2. Submit chama `useAuth().login()`
3. Se sucesso: redireciona para `/dashboard`
4. Se erro: exibe mensagem de erro

#### Cadastro (`/register`)
**Arquivo:** `src/app/register/page.tsx`

**Funcionalidades:**
- Formulário de cadastro de cliente
- Campos: nome, sobrenome, e-mail, telefone, data de nascimento, senha
- Validação de formato de e-mail
- Validação de senha (mínimo de caracteres)
- Criação automática com role='CLIENT'

**Fluxo:**
1. Usuário preenche dados
2. POST para `/api/users/`
3. Se sucesso: redireciona para `/login` com mensagem
4. Se erro: exibe erros de validação

#### Esqueci a Senha (`/forgot-password`)
**Arquivo:** `src/app/forgot-password/page.tsx`

**Funcionalidades:**
- Campo de e-mail
- Envio de link de reset (quando e-mail configurado)
- Mensagem de confirmação

**Fluxo:**
1. Usuário insere e-mail
2. POST para `/api/users/password-reset/`
3. Backend envia e-mail com link
4. Exibe mensagem de sucesso

#### Reset de Senha (`/password-reset/[uid]/[token]`)
**Arquivo:** `src/app/password-reset/[uid]/[token]/page.tsx`

**Funcionalidades:**
- Campos de nova senha e confirmação
- Validação de senha
- Token válido por tempo limitado

**Fluxo:**
1. Usuário acessa link do e-mail
2. Preenche nova senha
3. POST para `/api/users/password-reset-confirm/`
4. Se sucesso: redireciona para login

### 6.2 Páginas de Cliente

#### Dashboard (`/dashboard`)
**Arquivo:** `src/app/dashboard/page.tsx`

**Funcionalidades:**
- Resumo de agendamentos
- Próximos agendamentos
- Histórico recente
- Ações rápidas (novo agendamento)
- Métricas personalizadas por role

**Componentes:**
- Cards com estatísticas
- Lista de próximos agendamentos
- Botão de ação flutuante

#### Novo Agendamento (`/appointments/new`)
**Arquivo:** `src/app/appointments/new/page.tsx`

**Funcionalidades:**
- Wizard de 4 passos (Stepper)
- Seleção de serviço (cards visuais)
- Seleção de barbeiro (dropdown)
- Escolha de data e horário
- Confirmação com resumo

**Passo 1: Selecione o Serviço**
- Grid de cards com serviços
- Informações: nome, descrição, duração, preço
- Imagem do serviço (se disponível)
- Seleção via clique no card

**Passo 2: Escolha o Barbeiro**
- Select com lista de barbeiros ativos
- Nome completo exibido
- Botões: Voltar, Continuar

**Passo 3: Data e Horário**
- Date picker (input type="date")
- Consulta automática de horários disponíveis
- Grid de botões com horários
- Validação de disponibilidade em tempo real
- Alerta se nenhum horário disponível

**Passo 4: Confirmação**
- Paper com resumo completo:
  - Serviço
  - Barbeiro
  - Data (formatada)
  - Horário
  - Duração
  - Valor
- Botão "Confirmar Agendamento"
- Loading state durante submissão
- Tratamento de erros

**API Calls:**
```typescript
// Carregar serviços
GET /api/services/?is_active=true

// Carregar barbeiros
GET /api/users/barbers/

// Consultar horários
GET /api/appointments/available_slots/?barber={id}&date={date}&service={id}

// Criar agendamento
POST /api/appointments/
{
  service: serviceId,
  barber: barberId,
  date: "2025-10-10",
  start_time: "10:00"
}
```

#### Histórico de Agendamentos (`/appointments/history`)
**Arquivo:** `src/app/appointments/history/page.tsx`

**Funcionalidades:**
- Lista de todos agendamentos do cliente
- Filtros por status e data
- Ações: Ver detalhes, Cancelar (se futuro)
- Chips de status coloridos
- Paginação

**Componentes:**
- Table/List de agendamentos
- Filtros (Select, DateRange)
- Dialog de confirmação de cancelamento
- Chips de status

### 6.3 Páginas de Barbeiro

#### Minha Agenda (`/barber/schedule`)
**Arquivo:** `src/app/barber/schedule/page.tsx`

**Funcionalidades:**
- Calendário/lista de agendamentos
- Filtros por data e status
- Visualização diária/semanal/mensal
- Ações: Confirmar, Concluir, Cancelar
- Informações do cliente

**Componentes:**
- Calendar view ou Timeline
- Cards de agendamento
- Dialogs de confirmação
- Badge com status

#### Bloqueios de Agenda (`/barber/blocks`)
**Arquivo:** `src/app/barber/blocks/page.tsx`

**Funcionalidades:**
- Lista de bloqueios existentes
- Criar novo bloqueio
- Editar/deletar bloqueio
- Opções: dia inteiro ou horário específico
- Campo de motivo (opcional)

**Formulário de Bloqueio:**
- Date picker
- Checkbox "Dia inteiro"
- Time pickers (início/fim) - condicional
- TextField (motivo)
- Validação: end_time > start_time

**API Calls:**
```typescript
// Listar bloqueios
GET /api/users/schedule-blocks/

// Criar bloqueio
POST /api/users/schedule-blocks/
{
  date: "2025-10-15",
  all_day: false,
  start_time: "12:00",
  end_time: "14:00",
  reason: "Almoço"
}
```

#### Relatórios do Barbeiro (`/barber/reports`)
**Arquivo:** `src/app/barber/reports/page.tsx`

**Funcionalidades:**
- Filtros de período
- Métricas:
  - Atendimentos concluídos
  - Ganhos totais
  - Agendamentos futuros
  - Previsão de ganhos
  - Taxa de cancelamento
- Gráficos (opcional)
- Exportar relatório (futuro)

**Componentes:**
- Date range picker
- Cards de métricas
- Charts (se implementado)
- Table com detalhamento

### 6.4 Páginas de Proprietário (Admin)

#### Visão Geral (`/admin/overview`)
**Arquivo:** `src/app/admin/overview/page.tsx`

**Funcionalidades:**
- Dashboard executivo
- KPIs principais:
  - Faturamento do mês
  - Agendamentos do dia/semana
  - Performance por barbeiro
  - Taxa de ocupação
- Gráficos de tendência
- Acesso rápido a funcionalidades

#### Cadastrar Barbeiro (`/admin/register-barber`)
**Arquivo:** `src/app/admin/register-barber/page.tsx`

**Funcionalidades:**
- Formulário específico para barbeiro
- Campos: nome, sobrenome, e-mail, telefone, senha
- Role automaticamente setado como 'BARBER'
- Validação de permissão (só owner pode)

**API Call:**
```typescript
POST /api/users/
{
  first_name: "João",
  last_name: "Silva",
  email: "joao@barber.com",
  phone: "11999999999",
  password: "senha123",
  role: "BARBER"
}
```

#### Gerenciar Barbeiros (`/admin/barbers`)
**Arquivo:** `src/app/admin/barbers/page.tsx`

**Funcionalidades:**
- Lista de todos barbeiros
- Filtros: ativos/inativos
- Ações: Editar, Desativar/Ativar
- Ver agendamentos do barbeiro
- Ver relatório individual

**Componentes:**
- DataGrid/Table
- Switch (ativo/inativo)
- Buttons (ações)
- Dialog de edição

#### Gerenciar Serviços (`/admin/services`)
**Arquivo:** `src/app/admin/services/page.tsx`

**Funcionalidades:**
- Lista de todos serviços
- Grid ou lista
- Ações: Editar, Deletar, Ativar/Desativar
- Botão "Novo Serviço"
- Visualização de imagem

**Componentes:**
- Grid de cards
- FAB (Floating Action Button) para novo
- Dialog de confirmação de delete

#### Novo Serviço (`/admin/services/new`)
**Arquivo:** `src/app/admin/services/new/page.tsx`

**Funcionalidades:**
- Formulário de criação
- Campos:
  - Nome
  - Descrição
  - Duração (minutos)
  - Preço
  - Imagem (upload)
  - Status ativo
- Validações

**API Call:**
```typescript
POST /api/services/
{
  name: "Corte + Barba",
  description: "Corte de cabelo e barba completa",
  duration: 60,
  price: "50.00",
  is_active: true
}
```

#### Editar Serviço (`/admin/services/[id]`)
**Arquivo:** `src/app/admin/services/[id]/page.tsx`

**Funcionalidades:**
- Formulário preenchido com dados existentes
- Mesmos campos do novo serviço
- Botão "Salvar Alterações"
- Opção de deletar

**API Calls:**
```typescript
// Carregar serviço
GET /api/services/{id}/

// Atualizar
PUT /api/services/{id}/
{...dados}
```

#### Todos Agendamentos (`/admin/appointments`)
**Arquivo:** `src/app/admin/appointments/page.tsx`

**Funcionalidades:**
- Lista de TODOS agendamentos (todos barbeiros)
- Filtros avançados:
  - Barbeiro
  - Cliente
  - Serviço
  - Status
  - Período
- Ações: Ver, Cancelar, Editar
- Exportar (futuro)

**Componentes:**
- DataGrid com paginação
- Filters (múltiplos selects e date range)
- Badge de status
- Menu de ações

#### Relatório de Barbeiros (`/admin/reports/barbers`)
**Arquivo:** `src/app/admin/reports/barbers/page.tsx`

**Funcionalidades:**
- Comparação de performance entre barbeiros
- Filtros de período
- Métricas por barbeiro:
  - Atendimentos realizados
  - Faturamento
  - Média de valor por atendimento
  - Taxa de cancelamento
- Ranking
- Gráficos comparativos

**API Call:**
```typescript
GET /api/reports/owner/?start_date={date}&end_date={date}
```

#### Relatório de Serviços (`/admin/reports/services`)
**Arquivo:** `src/app/admin/reports/services/page.tsx`

**Funcionalidades:**
- Análise por tipo de serviço
- Serviços mais populares
- Receita por serviço
- Tempo médio de execução
- Sugestões de preço

## 7. Componentes Reutilizáveis

### 7.1 ThemeRegistry

**Arquivo:** `src/components/ThemeRegistry.tsx`

**Propósito:**
- Envolver aplicação com ThemeProvider
- Aplicar CssBaseline (reset CSS)
- Fornecer tema Material UI globalmente

**Uso:**
```tsx
// app/layout.tsx
<ThemeRegistry>
  <AuthProvider>
    {children}
  </AuthProvider>
</ThemeRegistry>
```

### 7.2 ProtectedRoute

**Arquivo:** `src/components/ProtectedRoute.tsx`

**Propósito:**
- HOC (Higher-Order Component) para proteger rotas
- Verificar autenticação
- Verificar role/permissões
- Redirecionar se não autorizado

**Uso:**
```tsx
<ProtectedRoute requiredRole="OWNER">
  <AdminContent />
</ProtectedRoute>
```

**Implementação (exemplo):**
```tsx
export default function ProtectedRoute({
  children,
  requiredRole
}: {
  children: React.ReactNode;
  requiredRole?: 'CLIENT' | 'BARBER' | 'OWNER';
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (requiredRole && user.role !== requiredRole) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading) return <CircularProgress />;
  if (!user) return null;
  if (requiredRole && user.role !== requiredRole) return null;

  return <>{children}</>;
}
```

## 8. Fluxos de Dados

### 8.1 Fluxo de Autenticação

```
┌─────────────┐
│ Login Page  │
└──────┬──────┘
       │ login(email, password)
       ↓
┌─────────────────┐
│  AuthContext    │
└────────┬────────┘
         │ authService.login()
         ↓
┌─────────────────┐
│   auth.ts       │
└────────┬────────┘
         │ POST /api/token/
         ↓
┌─────────────────┐
│  Backend API    │
└────────┬────────┘
         │ { access, refresh }
         ↓
┌─────────────────┐
│  localStorage   │ tokens salvos
└─────────────────┘
         ↓
┌─────────────────┐
│ getCurrentUser  │
└────────┬────────┘
         │ GET /api/users/me/
         ↓
┌─────────────────┐
│  AuthContext    │ user state updated
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Redirect        │ → /dashboard
└─────────────────┘
```

### 8.2 Fluxo de Criação de Agendamento

```
┌──────────────────┐
│  New Appointment │
│      Page        │
└────────┬─────────┘
         │ useEffect
         ↓
┌──────────────────┐
│  Load Services   │ GET /api/services/
└────────┬─────────┘
         │
┌──────────────────┐
│  Load Barbers    │ GET /api/users/barbers/
└────────┬─────────┘
         │ User selects
         ↓
┌──────────────────┐
│ Select Service   │
└────────┬─────────┘
         │
┌──────────────────┐
│ Select Barber    │
└────────┬─────────┘
         │
┌──────────────────┐
│  Select Date     │
└────────┬─────────┘
         │ onChange
         ↓
┌──────────────────────────┐
│ Load Available Slots     │ GET /api/appointments/available_slots/
└────────┬─────────────────┘
         │ { available_slots: [...] }
         ↓
┌──────────────────┐
│  Display Slots   │ buttons com horários
└────────┬─────────┘
         │ User selects time
         ↓
┌──────────────────┐
│  Confirmation    │ resumo
└────────┬─────────┘
         │ Confirm button
         ↓
┌──────────────────┐
│ POST /api/       │
│  appointments/   │
└────────┬─────────┘
         │ Success
         ↓
┌──────────────────┐
│  Redirect to     │ /dashboard?appointment=success
│   Dashboard      │
└──────────────────┘
```

### 8.3 Fluxo de Interceptor de Token

```
┌──────────────────┐
│  API Request     │ api.get('/services/')
└────────┬─────────┘
         │ Request Interceptor
         ↓
┌──────────────────────────┐
│ Add Authorization Header │ Bearer {access_token}
└────────┬─────────────────┘
         │
         ↓
┌──────────────────┐
│   Backend API    │
└────────┬─────────┘
         │
    ┌────┴─────┐
    │          │
   200        401
    │          │
    ↓          ↓
Success   ┌────────────────┐
Response  │ Response       │
          │ Interceptor    │
          └────┬───────────┘
               │ Token expirado
               ↓
          ┌────────────────┐
          │ Refresh Token  │ POST /api/token/refresh/
          └────┬───────────┘
               │
          ┌────┴────┐
          │         │
       Success    Fail
          │         │
          ↓         ↓
    ┌──────────┐ ┌────────┐
    │ Retry    │ │ Logout │
    │ Original │ │ User   │
    │ Request  │ └────────┘
    └──────────┘
```

## 9. Boas Práticas Implementadas

### 9.1 TypeScript

- Interfaces para todos os tipos de dados
- Tipagem de props de componentes
- Uso de generics quando apropriado
- Evitar `any` (usar `unknown` se necessário)

### 9.2 React

- Componentes funcionais com Hooks
- Custom Hooks para lógica reutilizável
- useCallback/useMemo para otimização
- Lazy loading de componentes (futuro)
- Error boundaries (recomendado)

### 9.3 Next.js

- App Router para roteamento
- Metadata API para SEO
- Loading states
- Error handling
- Environment variables

### 9.4 Material UI

- Uso consistente do sistema de temas
- Componentes acessíveis
- Responsividade (Grid, breakpoints)
- sx prop para estilização inline
- Palette colors do tema

### 9.5 Segurança

- Tokens armazenados em localStorage (considerar httpOnly cookies)
- Validação de inputs
- Sanitização de dados
- HTTPS em produção (recomendado)
- CSP Headers (recomendado)

### 9.6 Performance

- Code splitting automático do Next.js
- Otimização de imagens (next/image)
- Lazy loading de rotas
- Memoização de componentes pesados
- Debounce em buscas

## 10. Scripts NPM

**Arquivo:** `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

**Comandos:**

```bash
# Desenvolvimento (hot reload)
npm run dev

# Build de produção
npm run build

# Iniciar servidor de produção
npm run start

# Linting
npm run lint

# Instalar dependências
npm install
```

## 11. Variáveis de Ambiente

**Arquivo:** `.env.local` (desenvolvimento)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Uso no código:**
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

**Nota:** Variáveis com prefixo `NEXT_PUBLIC_` são expostas ao browser.

## 12. Dockerização

### 12.1 Dockerfile.dev (Desenvolvimento)

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### 12.2 Dockerfile (Produção)

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
```

## 13. Melhorias Futuras

### 13.1 Funcionalidades

- [ ] Notificações push (Web Push API)
- [ ] PWA (Service Workers)
- [ ] Tema dark mode
- [ ] Internacionalização (i18n)
- [ ] Calendário visual interativo
- [ ] Upload de imagens (avatar, serviços)
- [ ] Chat/mensagens entre cliente e barbeiro
- [ ] Sistema de avaliações

### 13.2 Performance

- [ ] Implementar React.lazy() para rotas
- [ ] Image optimization completa
- [ ] Caching de requisições (SWR ou React Query)
- [ ] Virtualização de listas longas
- [ ] Preload de dados críticos

### 13.3 UX/UI

- [ ] Animações e transições
- [ ] Skeleton loaders
- [ ] Toast notifications (Snackbar)
- [ ] Confirmações de ações
- [ ] Onboarding para novos usuários
- [ ] Tutorial interativo

### 13.4 Técnico

- [ ] Testes unitários (Jest)
- [ ] Testes de integração (Cypress)
- [ ] Storybook para componentes
- [ ] Documentação com JSDoc
- [ ] Logs estruturados
- [ ] Analytics (Google Analytics, Mixpanel)
- [ ] Error tracking (Sentry)

## 14. Troubleshooting

### 14.1 Problemas Comuns

**Erro: Module not found**
```bash
npm install
# ou
rm -rf node_modules package-lock.json
npm install
```

**Erro: Port 3000 já em uso**
```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Ou usar outra porta
PORT=3001 npm run dev
```

**Erro: Cannot read property of undefined**
- Verificar se dados foram carregados (loading state)
- Usar optional chaining: `user?.email`

**Erro: 401 Unauthorized**
- Token expirado: fazer logout e login novamente
- Verificar se backend está rodando
- Verificar CORS no backend

**Erro de CORS**
- Verificar `CORS_ALLOWED_ORIGINS` no backend
- Verificar URL da API no frontend

## 15. Contatos e Suporte

Para dúvidas sobre o frontend:
- Consultar documentação oficial: [Next.js](https://nextjs.org/docs), [Material UI](https://mui.com/)
- Issues do projeto
- E-mail: suporte@barbearia.com

---

**Documento gerado em:** 2025-10-06
**Versão:** 1.0.0
**Framework:** Next.js 15.1.4
**Última atualização:** 2025-10-06
