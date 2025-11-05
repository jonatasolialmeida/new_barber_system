# Frontend - Sistema de Agendamento de Barbearia

Interface web moderna e responsiva desenvolvida com Next.js 15 e Material-UI para o sistema de agendamento de barbearia.

## 🚀 Tecnologias

- **Next.js 15.1.4** - Framework React com SSR
- **React 19** - Biblioteca UI
- **TypeScript 5** - Type safety
- **Material-UI (MUI) 6.3** - Component library
- **React Query (TanStack Query)** - Data fetching & caching
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Axios** - HTTP client
- **date-fns** - Manipulação de datas
- **Emotion** - CSS-in-JS

## 📋 Índice

- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Rotas](#rotas)
- [Componentes](#componentes)
- [State Management](#state-management)
- [Autenticação](#autenticação)
- [Testes](#testes)
- [Performance](#performance)
- [Build e Deploy](#build-e-deploy)

## ✨ Funcionalidades

### Para Clientes
- ✅ Registro e login
- ✅ Visualização de serviços disponíveis
- ✅ Agendamento de horários
- ✅ Seleção de barbeiro preferido
- ✅ Histórico de agendamentos
- ✅ Cancelamento de agendamentos
- ✅ Perfil do usuário

### Para Barbeiros
- ✅ Visualização de agenda
- ✅ Confirmação de agendamentos
- ✅ Marcação de atendimentos como concluídos
- ✅ Bloqueio de horários (férias, folgas)
- ✅ Relatórios de atendimentos

### Para Proprietários (Owner)
- ✅ Gestão completa de serviços
- ✅ Cadastro de barbeiros
- ✅ Visualização de todos os agendamentos
- ✅ Relatórios financeiros e operacionais
- ✅ Dashboard administrativo

## 💻 Instalação

### Requisitos

- Node.js 20+
- npm ou yarn

### Instalação das Dependências

```bash
# Com npm
npm install

# Com yarn
yarn install
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do frontend:

```bash
# API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Para diferentes ambientes:

```bash
# Development (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Homologation (.env.hml)
NEXT_PUBLIC_API_URL=http://api-hml.yourdomain.com/api

# Production (.env.production)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Layout raiz
│   │   ├── page.tsx             # Página inicial
│   │   ├── login/               # Página de login
│   │   ├── register/            # Página de registro
│   │   ├── forgot-password/     # Recuperação de senha
│   │   ├── dashboard/           # Dashboard do usuário
│   │   ├── appointments/        # Páginas de agendamento
│   │   │   ├── new/            # Novo agendamento
│   │   │   └── history/        # Histórico
│   │   ├── barber/             # Área do barbeiro
│   │   │   ├── schedule/       # Agenda
│   │   │   ├── reports/        # Relatórios
│   │   │   └── blocks/         # Bloqueios de agenda
│   │   └── admin/              # Área administrativa
│   │       ├── overview/       # Visão geral
│   │       ├── appointments/   # Gestão de agendamentos
│   │       ├── barbers/        # Gestão de barbeiros
│   │       ├── services/       # Gestão de serviços
│   │       └── reports/        # Relatórios gerenciais
│   ├── components/              # Componentes reutilizáveis
│   │   ├── ThemeRegistry.tsx   # Provider do tema
│   │   ├── QueryProvider.tsx   # Provider React Query
│   │   ├── ErrorBoundary.tsx   # Tratamento de erros
│   │   └── ProtectedRoute.tsx  # Proteção de rotas
│   ├── contexts/                # React Contexts
│   │   └── AuthContext.tsx     # Contexto de autenticação
│   ├── services/                # Serviços de API
│   │   ├── api.ts              # Cliente Axios configurado
│   │   └── auth.ts             # Serviço de autenticação
│   ├── types/                   # Definições TypeScript
│   │   └── index.ts            # Tipos compartilhados
│   └── utils/                   # Utilitários
│       └── theme.ts            # Configuração do tema MUI
├── public/                      # Arquivos públicos
├── .env.example                 # Exemplo de variáveis de ambiente
├── next.config.ts               # Configuração Next.js
├── tsconfig.json                # Configuração TypeScript
├── package.json                 # Dependências
├── Dockerfile                   # Build da imagem Docker
└── README.md                    # Este arquivo
```

## 🛣️ Rotas

### Públicas

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial |
| `/login` | Login de usuários |
| `/register` | Cadastro de novos usuários |
| `/forgot-password` | Recuperação de senha |
| `/password-reset/[uid]/[token]` | Reset de senha |

### Protegidas (Requerem autenticação)

#### Cliente

| Rota | Descrição |
|------|-----------|
| `/dashboard` | Dashboard do cliente |
| `/appointments/new` | Novo agendamento |
| `/appointments/history` | Histórico de agendamentos |

#### Barbeiro

| Rota | Descrição |
|------|-----------|
| `/barber/schedule` | Agenda do barbeiro |
| `/barber/reports` | Relatórios do barbeiro |
| `/barber/blocks` | Bloqueios de agenda |

#### Proprietário (Owner)

| Rota | Descrição |
|------|-----------|
| `/admin/overview` | Visão geral do negócio |
| `/admin/appointments` | Gestão de agendamentos |
| `/admin/barbers` | Gestão de barbeiros |
| `/admin/register-barber` | Cadastro de barbeiro |
| `/admin/services` | Gestão de serviços |
| `/admin/services/new` | Novo serviço |
| `/admin/services/[id]` | Editar serviço |
| `/admin/reports/services` | Relatório de serviços |
| `/admin/reports/barbers` | Relatório de barbeiros |

## 🧩 Componentes Principais

### ThemeRegistry

Provider global que configura:
- Material-UI Theme
- CSS Baseline
- AuthProvider
- QueryProvider
- ErrorBoundary

```tsx
<ThemeRegistry>
  {children}
</ThemeRegistry>
```

### QueryProvider

Configura React Query com:
- Cache de 1 minuto (staleTime)
- Garbage collection de 5 minutos
- Retry automático
- React Query Devtools (dev only)

### ErrorBoundary

Captura erros de React e exibe UI amigável:
- Mensagem de erro user-friendly
- Stack trace em desenvolvimento
- Opção para tentar novamente
- Integração futura com Sentry

### ProtectedRoute

HOC para proteger rotas que requerem autenticação:

```tsx
<ProtectedRoute>
  <PrivateContent />
</ProtectedRoute>
```

## 🗃️ State Management

### Server State (React Query)

Para dados do servidor (API):

```tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/services/api';

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['services'],
  queryFn: () => api.get('/services/').then(res => res.data)
});

// Mutate data
const mutation = useMutation({
  mutationFn: (newService) => api.post('/services/', newService),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['services'] });
  }
});
```

### Client State (React Context)

Para estado global do cliente:

#### AuthContext

Gerencia autenticação:

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();

  if (loading) return <Loading />;

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.full_name}!</p>
      ) : (
        <LoginForm onSubmit={login} />
      )}
    </div>
  );
}
```

## 🔐 Autenticação

### Fluxo de Autenticação

1. **Login** - Usuário envia credenciais
2. **Token JWT** - Backend retorna access + refresh tokens
3. **Storage** - Tokens salvos no localStorage
4. **Axios Interceptor** - Adiciona token automaticamente
5. **Refresh** - Token renovado automaticamente quando expira
6. **Logout** - Tokens removidos e usuário redirecionado

### Interceptors Axios

```typescript
// Request interceptor - Adiciona token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// Response interceptor - Refresh token automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Tenta refresh token
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await axios.post('/api/token/refresh/', {
        refresh: refreshToken
      });
      localStorage.setItem('access_token', response.data.access);
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

## 🧪 Testes

### Estrutura de Testes (A implementar)

```bash
# Executar testes
npm test

# Com cobertura
npm test -- --coverage

# Modo watch
npm test -- --watch
```

### Ferramentas Recomendadas

- **Jest** - Test runner
- **React Testing Library** - Testes de componentes
- **MSW (Mock Service Worker)** - Mock de API
- **Cypress** - Testes E2E

## ⚡ Performance

### Otimizações Implementadas

#### 1. Next.js Standalone Output

```typescript
// next.config.ts
export default {
  output: 'standalone',
  // Reduz tamanho da build drasticamente
}
```

#### 2. Multi-stage Docker Build

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
# ...

# Stage 2: Build
FROM node:20-alpine AS builder
# ...

# Stage 3: Production
FROM node:20-alpine AS runner
# Imagem final ~30% menor
```

#### 3. Image Optimization

```typescript
// next.config.ts
images: {
  formats: ['image/webp', 'image/avif'],
  minimumCacheTTL: 60,
}
```

#### 4. React Query Cache

- **StaleTime:** 1 minuto
- **GcTime:** 5 minutos
- Reduz chamadas desnecessárias à API

#### 5. Code Splitting

Next.js faz code splitting automático por rota:

```tsx
// Lazy loading manual para componentes pesados
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false
});
```

### Métricas de Performance

| Métrica | Target | Atual |
|---------|--------|-------|
| First Contentful Paint | < 1.8s | TBD |
| Time to Interactive | < 3.9s | TBD |
| Speed Index | < 4.0s | TBD |
| Lighthouse Score | > 90 | TBD |

## 🏗️ Build e Deploy

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Acessar em http://localhost:3000
```

### Build de Produção

```bash
# Build otimizado
npm run build

# Iniciar servidor de produção
npm start
```

### Docker

```bash
# Build da imagem
docker build -t barber-frontend .

# Executar container
docker run -p 3000:3000 --env NEXT_PUBLIC_API_URL=http://api:8000/api barber-frontend
```

### Deploy

#### Vercel (Recomendado para Next.js)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Docker Compose

Já configurado nos arquivos:
- `/infra/dev/docker-compose.yml`
- `/infra/hml/docker-compose.yml`
- `/infra/prod/docker-compose.yml`

### Variáveis de Build

```bash
# Production
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api

# Standalone output habilitado
# Gera arquivo server.js otimizado
```

## 🔒 Segurança

### Headers de Segurança

Configurados em `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ];
}
```

### Boas Práticas

- ✅ Tokens JWT no localStorage (considerar httpOnly cookies)
- ✅ Validação client-side + server-side
- ✅ Sanitização de inputs
- ✅ HTTPS obrigatório em produção
- ✅ Content Security Policy (CSP)
- ✅ Sem secrets no código fonte

## 📦 Dependências Principais

### Produção

```json
{
  "@mui/material": "^6.3.0",
  "@tanstack/react-query": "^5.17.19",
  "axios": "^1.7.9",
  "next": "15.1.4",
  "react": "^19.0.0",
  "react-hook-form": "^7.49.3",
  "zod": "^3.22.4"
}
```

### Desenvolvimento

```json
{
  "@types/node": "^22",
  "@types/react": "^19",
  "eslint": "^9",
  "typescript": "^5"
}
```

## 🎨 Customização do Tema

O tema pode ser customizado em `src/utils/theme.ts`:

```typescript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;
```

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [React Query Documentation](https://tanstack.com/query)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

## 👥 Autores

- **Barber System Team**

## 📞 Suporte

Para suporte, entre em contato através de: support@barbersystem.com
