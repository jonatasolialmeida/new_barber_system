# Documentação Completa - Sistema de Agendamento para Barbearia

## 1. Visão Geral do Sistema

O Sistema de Agendamento para Barbearia é uma aplicação web completa desenvolvida para modernizar e otimizar o processo de agendamento e gestão de serviços em barbearias. O sistema oferece uma plataforma integrada que conecta clientes, barbeiros e proprietários, facilitando o agendamento online, controle de agenda, e geração de relatórios gerenciais.

### 1.1 Objetivos do Sistema

- Facilitar o agendamento online de serviços para clientes
- Permitir que barbeiros gerenciem suas agendas e bloqueios
- Fornecer relatórios e métricas para tomada de decisão
- Automatizar notificações (preparado para e-mail, SMS e WhatsApp)
- Melhorar a experiência do cliente e eficiência operacional

### 1.2 Arquitetura Geral

O sistema utiliza uma arquitetura moderna baseada em:
- **Frontend**: Next.js 15 com React 19 e Material UI 6
- **Backend**: Django 5.2 com Django REST Framework 3.15+
- **Banco de Dados**: PostgreSQL 16
- **Cache/Broker**: Redis 7 (para Celery)
- **Containerização**: Docker e Docker Compose
- **Autenticação**: JWT (JSON Web Tokens)

## 2. Tecnologias Utilizadas

### 2.1 Backend
- **Python 3.13**: Linguagem de programação principal
- **Django 5.2**: Framework web full-stack
- **Django REST Framework 3.15+**: API RESTful
- **PostgreSQL 16**: Banco de dados relacional
- **Redis 7**: Cache e message broker
- **Celery**: Processamento assíncrono de tarefas
- **JWT**: Autenticação via tokens
- **Gunicorn**: Servidor WSGI (produção)
- **python-decouple**: Gerenciamento de variáveis de ambiente

### 2.2 Frontend
- **Next.js 15**: Framework React com SSR/SSG
- **React 19**: Biblioteca JavaScript para UI
- **TypeScript 5**: Superset JavaScript tipado
- **Material UI 6**: Biblioteca de componentes UI
- **Emotion**: CSS-in-JS para estilização
- **Axios**: Cliente HTTP
- **date-fns**: Manipulação de datas

### 2.3 Infraestrutura
- **Docker**: Containerização de aplicações
- **Docker Compose**: Orquestração de containers
- **Nginx**: Proxy reverso (produção)
- **Portainer**: Interface de gerenciamento Docker
- **pgAdmin**: Administração PostgreSQL

### 2.4 Ferramentas de Desenvolvimento
- **ESLint**: Linting para JavaScript/TypeScript
- **Make**: Automação de comandos
- **Git**: Controle de versão

## 3. Funcionalidades do Sistema

### 3.1 Funcionalidades por Tipo de Usuário

#### 3.1.1 Cliente (CLIENT)

**Capacidades:**
- Criar conta própria sem necessidade de aprovação
- Fazer login no sistema
- Visualizar lista de serviços disponíveis
- Agendar serviços escolhendo:
  - Serviço desejado
  - Barbeiro preferido
  - Data e horário disponíveis
- Visualizar histórico de agendamentos
- Cancelar agendamentos futuros
- Receber notificações (quando implementado)

**Restrições:**
- Só pode ver e gerenciar seus próprios agendamentos
- Não pode acessar relatórios
- Não pode criar barbeiros ou serviços

#### 3.1.2 Barbeiro (BARBER)

**Capacidades:**
- Fazer login no sistema (conta criada pelo proprietário)
- Visualizar agenda pessoal
- Ver lista de agendamentos do dia/semana/mês
- Bloquear dias inteiros ou horários específicos
- Marcar agendamentos como concluídos
- Visualizar relatórios individuais:
  - Atendimentos realizados
  - Ganhos totais
  - Agendamentos futuros
  - Taxa de cancelamento

**Restrições:**
- Só pode ver seus próprios agendamentos
- Não pode ver agendamentos de outros barbeiros
- Não pode acessar relatórios globais
- Não pode criar serviços

#### 3.1.3 Proprietário (OWNER)

**Capacidades:**
- Todas as funcionalidades de cliente e barbeiro
- Cadastrar novos barbeiros
- Criar, editar e deletar serviços
- Visualizar todos os agendamentos do sistema
- Acessar relatórios gerenciais completos:
  - Faturamento total
  - Performance por barbeiro
  - Previsão de receita
  - Métricas de cancelamento
- Gerenciar usuários do sistema
- Cancelar qualquer agendamento

**Restrições:**
- Nenhuma restrição no sistema

### 3.2 Módulos Funcionais

#### 3.2.1 Autenticação e Autorização
- Login com e-mail e senha
- Geração de tokens JWT (access e refresh)
- Controle de acesso baseado em roles (RBAC)
- Reset de senha via e-mail (preparado)
- Logout com invalidação de token

#### 3.2.2 Gerenciamento de Usuários
- CRUD de usuários
- Perfis diferenciados (Cliente, Barbeiro, Proprietário)
- Campos de perfil: nome, sobrenome, e-mail, telefone, data de nascimento
- Preferências de notificações (preparado)

#### 3.2.3 Gerenciamento de Serviços
- CRUD de serviços
- Campos: nome, descrição, duração (minutos), preço, imagem
- Ativação/desativação de serviços
- Serviços inativos não aparecem para agendamento

#### 3.2.4 Sistema de Agendamentos
- Criação de agendamentos com validações
- Verificação de disponibilidade em tempo real
- Cálculo automático de horário de término
- Estados do agendamento:
  - SCHEDULED: Agendado
  - CONFIRMED: Confirmado
  - IN_PROGRESS: Em andamento
  - COMPLETED: Concluído
  - CANCELLED: Cancelado
  - NO_SHOW: Não compareceu
- Validação de conflitos de horário
- Respeito aos bloqueios de agenda

#### 3.2.5 Bloqueio de Agenda
- Barbeiros podem bloquear:
  - Dias inteiros
  - Horários específicos dentro de um dia
- Motivo do bloqueio (opcional)
- Validação automática nos agendamentos

#### 3.2.6 Sistema de Relatórios
- Relatórios individuais para barbeiros
- Relatórios gerenciais para proprietários
- Dashboard com métricas do dia/semana/mês
- Filtros por período de data
- Métricas incluem:
  - Quantidade de atendimentos
  - Faturamento/Ganhos
  - Agendamentos futuros
  - Taxa de cancelamento

#### 3.2.7 Sistema de Notificações (Preparado)
- Estrutura pronta para envio de:
  - E-mails
  - SMS
  - WhatsApp
- Notificações preparadas:
  - Confirmação de agendamento
  - Lembrete de agendamento
  - Cancelamento de agendamento
  - Avisos para barbeiros

## 4. Telas e Rotas

### 4.1 Rotas Públicas (Não Autenticadas)

| Rota | Tela | Descrição |
|------|------|-----------|
| `/login` | Login | Tela de autenticação |
| `/register` | Cadastro | Registro de novos clientes |
| `/forgot-password` | Esqueci a Senha | Solicitar reset de senha |
| `/password-reset/[uid]/[token]` | Reset de Senha | Redefinir senha via token |

### 4.2 Rotas de Cliente (CLIENT)

| Rota | Tela | Descrição |
|------|------|-----------|
| `/` | Home | Dashboard do cliente |
| `/appointments/new` | Novo Agendamento | Criar agendamento |
| `/appointments/history` | Histórico | Ver agendamentos passados e futuros |
| `/dashboard` | Dashboard | Resumo de agendamentos |

### 4.3 Rotas de Barbeiro (BARBER)

| Rota | Tela | Descrição |
|------|------|-----------|
| `/` | Home | Dashboard do barbeiro |
| `/barber/schedule` | Minha Agenda | Ver agendamentos pessoais |
| `/barber/blocks` | Bloqueios | Gerenciar bloqueios de agenda |
| `/barber/reports` | Relatórios | Relatórios individuais |
| `/dashboard` | Dashboard | Métricas pessoais |

### 4.4 Rotas de Proprietário (OWNER)

| Rota | Tela | Descrição |
|------|------|-----------|
| `/` | Home | Dashboard geral |
| `/admin/overview` | Visão Geral | Overview do negócio |
| `/admin/register-barber` | Cadastrar Barbeiro | Registrar novo barbeiro |
| `/admin/barbers` | Gerenciar Barbeiros | Lista e gestão de barbeiros |
| `/admin/services` | Gerenciar Serviços | Lista de serviços |
| `/admin/services/new` | Novo Serviço | Criar serviço |
| `/admin/services/[id]` | Editar Serviço | Editar serviço existente |
| `/admin/appointments` | Todos Agendamentos | Ver todos agendamentos |
| `/admin/reports/barbers` | Relatório de Barbeiros | Performance individual |
| `/admin/reports/services` | Relatório de Serviços | Análise de serviços |
| `/dashboard` | Dashboard | Métricas gerais |

### 4.5 Rotas da API (Backend)

#### Autenticação
```
POST   /api/token/                    # Login (obter tokens JWT)
POST   /api/token/refresh/            # Refresh token
```

#### Usuários
```
GET    /api/users/                    # Listar usuários
POST   /api/users/                    # Criar usuário (cliente)
GET    /api/users/{id}/               # Detalhes do usuário
PUT    /api/users/{id}/               # Atualizar usuário
PATCH  /api/users/{id}/               # Atualizar parcialmente
DELETE /api/users/{id}/               # Deletar usuário
GET    /api/users/me/                 # Perfil do usuário autenticado
GET    /api/users/barbers/            # Listar barbeiros ativos
POST   /api/users/password-reset/     # Solicitar reset de senha
POST   /api/users/password-reset-confirm/ # Confirmar reset
```

#### Bloqueios de Agenda
```
GET    /api/users/schedule-blocks/    # Listar bloqueios
POST   /api/users/schedule-blocks/    # Criar bloqueio
GET    /api/users/schedule-blocks/{id}/ # Detalhes
PUT    /api/users/schedule-blocks/{id}/ # Atualizar
DELETE /api/users/schedule-blocks/{id}/ # Deletar
```

#### Serviços
```
GET    /api/services/                 # Listar serviços
POST   /api/services/                 # Criar serviço (owner)
GET    /api/services/{id}/            # Detalhes do serviço
PUT    /api/services/{id}/            # Atualizar (owner)
PATCH  /api/services/{id}/            # Atualizar parcialmente
DELETE /api/services/{id}/            # Deletar (owner)
```

#### Agendamentos
```
GET    /api/appointments/             # Listar agendamentos
POST   /api/appointments/             # Criar agendamento
GET    /api/appointments/{id}/        # Detalhes
PUT    /api/appointments/{id}/        # Atualizar
DELETE /api/appointments/{id}/        # Deletar
GET    /api/appointments/available_slots/ # Horários disponíveis
POST   /api/appointments/{id}/cancel/ # Cancelar
POST   /api/appointments/{id}/confirm/ # Confirmar
POST   /api/appointments/{id}/complete/ # Concluir
```

#### Relatórios
```
GET    /api/reports/barber/           # Relatório do barbeiro
GET    /api/reports/owner/            # Relatório do proprietário
GET    /api/reports/dashboard/        # Dashboard resumido
```

## 5. Permissões e Controle de Acesso

### 5.1 Matriz de Permissões

| Funcionalidade | Cliente | Barbeiro | Proprietário |
|----------------|---------|----------|--------------|
| **Usuários** |
| Criar conta própria | ✅ | ❌ | ✅ |
| Cadastrar barbeiro | ❌ | ❌ | ✅ |
| Ver perfil próprio | ✅ | ✅ | ✅ |
| Editar perfil próprio | ✅ | ✅ | ✅ |
| Ver outros usuários | ❌ | ❌ | ✅ |
| **Serviços** |
| Ver serviços ativos | ✅ | ✅ | ✅ |
| Criar serviços | ❌ | ❌ | ✅ |
| Editar serviços | ❌ | ❌ | ✅ |
| Deletar serviços | ❌ | ❌ | ✅ |
| **Agendamentos** |
| Criar agendamento | ✅ | ✅ | ✅ |
| Ver agendamentos próprios | ✅ | ✅ | ✅ |
| Ver todos agendamentos | ❌ | ❌ | ✅ |
| Cancelar próprio agendamento | ✅ | ✅ | ✅ |
| Cancelar qualquer agendamento | ❌ | ❌ | ✅ |
| Confirmar agendamento | ❌ | ✅ | ✅ |
| Concluir agendamento | ❌ | ✅ | ✅ |
| **Bloqueios de Agenda** |
| Criar bloqueio próprio | ❌ | ✅ | ✅ |
| Ver bloqueios próprios | ❌ | ✅ | ✅ |
| Ver todos bloqueios | ❌ | ❌ | ✅ |
| **Relatórios** |
| Ver relatório próprio | ❌ | ✅ | ✅ |
| Ver relatórios gerais | ❌ | ❌ | ✅ |
| Dashboard pessoal | ✅ | ✅ | ✅ |
| Dashboard geral | ❌ | ❌ | ✅ |

### 5.2 Autenticação e Autorização

**Método de Autenticação:**
- JWT (JSON Web Tokens) via Django REST Framework SimpleJWT
- Access Token: Tempo de vida configurável (padrão: 60 minutos)
- Refresh Token: Tempo de vida configurável (padrão: 24 horas)
- Token Rotation: Habilitado (novo refresh token a cada renovação)

**Fluxo de Autenticação:**
1. Cliente envia credenciais (e-mail/senha) para `/api/token/`
2. Backend valida e retorna access token + refresh token
3. Cliente armazena tokens (localStorage/sessionStorage)
4. Requisições subsequentes incluem `Authorization: Bearer {access_token}`
5. Quando access token expira, usa refresh token em `/api/token/refresh/`
6. Logout: Cliente descarta tokens localmente

**Controle de Autorização:**
- Baseado em roles (RBAC) através do campo `role` no modelo User
- Verificações no backend através de:
  - Propriedades do modelo: `is_client`, `is_barber`, `is_owner`
  - Filtros em ViewSets: `get_queryset()` personalizado
  - Verificações em actions: validação manual de permissões

## 6. Ambientes de Deployment

### 6.1 Ambiente de Desenvolvimento (dev)

**Características:**
- DEBUG ativado
- Hot reload no frontend e backend
- Volumes montados para desenvolvimento
- Banco de dados local
- Console backend para e-mails

**Portas:**
- Frontend: 3000
- Backend: 8000
- PostgreSQL: 5432
- Redis: 6379
- pgAdmin: 5050
- Portainer: 9000

**Comando:** `make dev-up`

### 6.2 Ambiente de Homologação (hml)

**Características:**
- DEBUG desativado
- Build otimizado
- Testes antes da produção
- Dados separados de dev e prod

**Portas:**
- Frontend: 3001
- Backend: 8001
- PostgreSQL: 5433
- Redis: 6380
- pgAdmin: 5051
- Portainer: 9001

**Comando:** `make hml-up`

### 6.3 Ambiente de Produção (prod)

**Características:**
- DEBUG desativado
- Build otimizado e minificado
- Gunicorn com 4 workers
- Celery workers ativos
- Nginx como proxy reverso
- Backups automatizados
- Logs estruturados
- Monitoramento via Portainer

**Portas:**
- Frontend: 3002
- Backend: 8002
- PostgreSQL: 5434
- Redis: 6381
- pgAdmin: 5052
- Portainer: 9002
- Nginx: 80

**Comando:** `make prod-up`

## 7. Fluxos Principais do Sistema

### 7.1 Fluxo de Cadastro de Cliente
1. Cliente acessa `/register`
2. Preenche: nome, sobrenome, e-mail, telefone, senha, data de nascimento
3. Sistema envia POST para `/api/users/`
4. Backend cria usuário com role='CLIENT'
5. Cliente é redirecionado para login

### 7.2 Fluxo de Criação de Agendamento
1. Cliente faz login
2. Acessa `/appointments/new`
3. Seleciona serviço (carrega lista de `/api/services/`)
4. Seleciona barbeiro (carrega de `/api/users/barbers/`)
5. Seleciona data
6. Sistema consulta `/api/appointments/available_slots/` com parâmetros
7. Cliente escolhe horário disponível
8. Sistema envia POST para `/api/appointments/`
9. Backend valida:
   - Disponibilidade do barbeiro
   - Conflitos com outros agendamentos
   - Bloqueios de agenda
10. Se válido, cria agendamento e envia notificações
11. Cliente vê confirmação e é redirecionado

### 7.3 Fluxo de Bloqueio de Agenda (Barbeiro)
1. Barbeiro faz login
2. Acessa `/barber/blocks`
3. Clica em criar novo bloqueio
4. Escolhe:
   - Data
   - Se dia inteiro ou horário específico
   - Horário inicial e final (se não for dia inteiro)
   - Motivo (opcional)
5. Sistema envia POST para `/api/users/schedule-blocks/`
6. Backend valida e cria bloqueio
7. Bloqueio passa a ser respeitado em novos agendamentos

### 7.4 Fluxo de Visualização de Relatórios (Proprietário)
1. Proprietário faz login
2. Acessa `/admin/reports/barbers`
3. Pode filtrar por:
   - Barbeiro específico
   - Período de data (início/fim)
4. Sistema consulta `/api/reports/owner/` com filtros
5. Backend processa dados e retorna métricas
6. Frontend exibe gráficos e tabelas

## 8. Preparação para Funcionalidades Futuras

### 8.1 Sistema de Notificações

**E-mail:**
- Backend configurado com variáveis EMAIL_*
- Módulo `apps.appointments.notifications` pronto
- Funções implementadas:
  - `send_appointment_confirmation_to_client()`
  - `send_appointment_notification_to_barber()`
  - `send_appointment_cancellation_notification()`

**SMS e WhatsApp:**
- Campos no modelo User: `receive_sms_notifications`, `receive_whatsapp_notifications`
- Celery configurado para processamento assíncrono
- Pronto para integração com Twilio (SMS) e WhatsApp Business API

### 8.2 Sistema de Pagamentos
- Campo `price_charged` em Appointment para registrar valor
- Preparado para integração com gateways (Stripe, PagSeguro, Mercado Pago)

### 8.3 Outras Integrações Planejadas
- Sistema de fidelidade
- Avaliações e comentários
- Upload de fotos de cortes
- App mobile (React Native)
- PWA (Progressive Web App)

## 9. Segurança

### 9.1 Medidas Implementadas
- Autenticação JWT com refresh tokens
- Senhas hasheadas com algoritmo PBKDF2
- CORS configurado (whitelist de origins)
- Validação de dados no backend (serializers)
- Proteção contra SQL Injection (Django ORM)
- Proteção XSS (React sanitization)
- CSRF protection habilitado

### 9.2 Recomendações para Produção
- Configurar HTTPS/SSL (Let's Encrypt)
- Implementar rate limiting
- Configurar firewall (UFW, iptables)
- Habilitar logs de auditoria
- Implementar 2FA (Two-Factor Authentication)
- Backups automatizados diários
- Monitoramento com alertas (Sentry, New Relic)
- Atualização regular de dependências

## 10. Manutenção e Operação

### 10.1 Comandos Make Principais

```bash
# Desenvolvimento
make dev-up              # Subir ambiente dev
make dev-down            # Parar ambiente dev
make dev-logs            # Ver logs
make dev-migrate         # Executar migrations
make dev-createsuperuser # Criar superusuário

# Produção
make prod-up             # Subir ambiente prod
make prod-down           # Parar ambiente prod
make prod-backup-db      # Backup do banco

# Utilitários
make clean               # Limpar recursos Docker
```

### 10.2 Backup e Restore

**Backup:**
```bash
make prod-backup-db
# Ou
docker-compose exec postgres pg_dump -U barber_user_prod barber_db_prod > backup.sql
```

**Restore:**
```bash
docker-compose exec postgres psql -U barber_user_prod barber_db_prod < backup.sql
```

### 10.3 Logs

**Ver logs de todos os serviços:**
```bash
make dev-logs
# Ou
docker-compose logs -f
```

**Ver logs de serviço específico:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 11. Estrutura de Diretórios

```
barber/
├── backend/                    # Django + DRF
│   ├── barber_project/        # Configurações do projeto
│   │   ├── settings.py        # Configurações Django
│   │   ├── urls.py            # URLs principais
│   │   ├── celery.py          # Configuração Celery
│   │   ├── wsgi.py            # WSGI para produção
│   │   └── asgi.py            # ASGI para async
│   ├── core/                  # App core
│   │   └── models.py          # TimeStampedModel base
│   ├── apps/
│   │   ├── users/             # Gerenciamento de usuários
│   │   │   ├── models.py      # User, BarberScheduleBlock
│   │   │   ├── serializers.py # Serializers
│   │   │   ├── views.py       # ViewSets
│   │   │   └── urls.py        # Rotas
│   │   ├── services/          # Serviços da barbearia
│   │   │   ├── models.py      # Service
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   ├── appointments/      # Sistema de agendamentos
│   │   │   ├── models.py      # Appointment
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── notifications.py # Funções de notificação
│   │   │   └── urls.py
│   │   └── reports/           # Relatórios e dashboards
│   │       ├── views.py       # BarberReportView, OwnerReportView
│   │       └── urls.py
│   ├── staticfiles/           # Arquivos estáticos coletados
│   ├── mediafiles/            # Arquivos de mídia (uploads)
│   ├── requirements.txt       # Dependências Python
│   ├── Dockerfile             # Imagem Docker backend
│   └── entrypoint.sh          # Script de entrada

├── frontend/                  # Next.js + Material UI
│   ├── src/
│   │   ├── app/               # Pages (App Router Next.js 15)
│   │   │   ├── layout.tsx     # Layout principal
│   │   │   ├── page.tsx       # Página inicial
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── dashboard/
│   │   │   ├── appointments/
│   │   │   ├── barber/        # Rotas do barbeiro
│   │   │   └── admin/         # Rotas do proprietário
│   │   ├── components/        # Componentes React
│   │   │   ├── ThemeRegistry.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/          # Context API
│   │   │   └── AuthContext.tsx
│   │   ├── services/          # Serviços API
│   │   │   ├── api.ts         # Cliente Axios
│   │   │   └── auth.ts        # Funções de autenticação
│   │   ├── types/             # TypeScript types
│   │   │   └── index.ts       # Interfaces e tipos
│   │   └── utils/             # Utilidades
│   │       └── theme.ts       # Tema Material UI
│   ├── public/                # Arquivos públicos
│   ├── package.json           # Dependências Node
│   ├── tsconfig.json          # Configuração TypeScript
│   ├── next.config.ts         # Configuração Next.js
│   ├── Dockerfile             # Imagem Docker produção
│   └── Dockerfile.dev         # Imagem Docker dev

├── infra/                     # Configurações Docker
│   ├── dev/                   # Ambiente de desenvolvimento
│   │   ├── docker-compose.yml
│   │   └── .env.example
│   ├── hml/                   # Ambiente de homologação
│   │   ├── docker-compose.yml
│   │   └── .env.example
│   └── prod/                  # Ambiente de produção
│       ├── docker-compose.yml
│       ├── .env.example
│       └── nginx/             # Configurações Nginx
│           └── nginx.conf

├── scripts/                   # Scripts utilitários
│   ├── setup.sh              # Setup inicial
│   └── backup.sh             # Script de backup

├── Makefile                   # Comandos facilitadores
└── README.md                  # Documentação principal
```

## 12. Contatos e Suporte

Para suporte técnico e dúvidas:
- **E-mail**: suporte@barbearia.com
- **WhatsApp**: (11) 99999-9999

---

**Documento gerado em:** 2025-10-06
**Versão do sistema:** 1.0.0
**Última atualização:** 2025-10-06
