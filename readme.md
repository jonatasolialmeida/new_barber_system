# 💈 Sistema de Agendamento para Barbearia

Sistema web completo para gerenciamento de agendamentos de barbearia, com áreas específicas para clientes, barbeiros e proprietários.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Ambientes](#ambientes)
- [API Endpoints](#api-endpoints)
- [Funcionalidades](#funcionalidades)
- [Roadmap](#roadmap)

## 🎯 Sobre o Projeto

Sistema de agendamento online para barbearias com três níveis de acesso:

### 👤 Cliente
- Cadastro simples (nome, telefone, e-mail, aniversário)
- Agendamento de serviços escolhendo barbeiro, dia e horário
- Visualização dos próprios agendamentos
- Recebimento de notificações (preparado para e-mail, SMS, WhatsApp)

### ✂️ Barbeiro
- Visualização dos próprios agendamentos
- Bloqueio de dias ou horários específicos
- Relatórios individuais de ganhos
- Status da agenda (atendimentos realizados e futuros)

### 👨‍💼 Proprietário
- Visualização de todos os agendamentos
- Relatórios financeiros completos
- Previsibilidade de atendimentos
- Gerenciamento de barbeiros e serviços

## 🚀 Tecnologias

### Backend
- **Python** 3.13
- **Django** 5.2
- **Django REST Framework** 3.15+
- **PostgreSQL** 16
- **Celery** (para tarefas assíncronas)
- **Redis** (broker para Celery)
- **JWT** (autenticação)

### Frontend
- **Next.js** 15 (React)
- **TypeScript** 5
- **Material UI** 6
- **Axios** (cliente HTTP)

### Infraestrutura
- **Docker** & **Docker Compose**
- **Portainer** (gerenciamento de containers)
- **pgAdmin** (administração PostgreSQL)
- **Nginx** (proxy reverso - produção)

## 📁 Estrutura do Projeto

```
barber/
├── backend/                    # Django + DRF
│   ├── barber_project/        # Configurações do projeto
│   ├── core/                  # App core com modelos base
│   ├── apps/
│   │   ├── users/            # Gerenciamento de usuários
│   │   ├── services/         # Serviços da barbearia
│   │   ├── appointments/     # Sistema de agendamentos
│   │   └── reports/          # Relatórios e dashboards
│   ├── requirements.txt
│   ├── Dockerfile
│   └── entrypoint.sh
│
├── frontend/                  # Next.js + Material UI
│   ├── src/
│   │   ├── app/              # Pages (App Router)
│   │   ├── components/       # Componentes React
│   │   ├── contexts/         # Context API (Auth, etc)
│   │   ├── services/         # Serviços API
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utilidades
│   ├── package.json
│   ├── Dockerfile
│   └── Dockerfile.dev
│
├── infra/                     # Configurações Docker
│   ├── dev/                  # Ambiente de desenvolvimento
│   │   ├── docker-compose.yml
│   │   └── .env.example
│   ├── hml/                  # Ambiente de homologação
│   │   ├── docker-compose.yml
│   │   └── .env.example
│   └── prod/                 # Ambiente de produção
│       ├── docker-compose.yml
│       ├── .env.example
│       └── nginx/
│
├── scripts/                   # Scripts utilitários
│   ├── setup.sh
│   └── backup.sh
│
├── Makefile                   # Comandos facilitadores
└── README.md
```

## 📋 Pré-requisitos

- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Make** (opcional, mas recomendado)

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd barber
```

### 2. Configure o ambiente

#### Opção A: Usando script de setup (Linux/Mac)

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

#### Opção B: Manualmente

```bash
# Copie os arquivos de exemplo
cp infra/dev/.env.example infra/dev/.env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edite os arquivos .env conforme necessário
```

### 3. Inicie o ambiente

```bash
# Usando Make
make dev-up

# Ou usando Docker Compose diretamente
cd infra/dev
docker-compose up -d
```

## 🎮 Como Usar

### Comandos Make Disponíveis

```bash
make help                 # Ver todos os comandos disponíveis

# Desenvolvimento
make dev-up              # Iniciar ambiente de desenvolvimento
make dev-down            # Parar ambiente de desenvolvimento
make dev-logs            # Ver logs
make dev-build           # Rebuild containers
make dev-migrate         # Executar migrations
make dev-createsuperuser # Criar superusuário

# Homologação
make hml-up              # Iniciar ambiente de homologação
make hml-down            # Parar ambiente de homologação
make hml-logs            # Ver logs

# Produção
make prod-up             # Iniciar ambiente de produção
make prod-down           # Parar ambiente de produção
make prod-backup-db      # Backup do banco de dados

# Utilitários
make clean               # Limpar recursos Docker
make setup-dev           # Setup completo do ambiente
```

### Acessando os Serviços

#### Desenvolvimento (dev)
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Django**: http://localhost:8000/admin
- **pgAdmin**: http://localhost:5050
- **Portainer**: http://localhost:9000

#### Homologação (hml)
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8001
- **pgAdmin**: http://localhost:5051
- **Portainer**: http://localhost:9001

#### Produção (prod)
- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:8002
- **pgAdmin**: http://localhost:5052
- **Portainer**: http://localhost:9002
- **Nginx**: http://localhost:80

### Credenciais Padrão (Desenvolvimento)

**Superusuário Django**
- Email: admin@barber.com
- Senha: admin123

**pgAdmin**
- Email: admin@barber.com
- Senha: admin123

**PostgreSQL**
- Host: localhost
- Port: 5432 (dev), 5433 (hml), 5434 (prod)
- Database: barber_db
- User: barber_user
- Password: barber_password

## 🌍 Ambientes

### Development (dev)
- Debug ativado
- Hot reload (frontend e backend)
- Volumes montados para desenvolvimento
- Portas: 3000 (frontend), 8000 (backend)

### Homologação (hml)
- Debug desativado
- Build otimizado
- Ambiente para testes antes da produção
- Portas: 3001 (frontend), 8001 (backend)

### Produção (prod)
- Debug desativado
- Build otimizado e minificado
- Gunicorn (4 workers)
- Celery workers para tarefas assíncronas
- Nginx como proxy reverso
- Backups automatizados
- Portas: 3002 (frontend), 8002 (backend)

## 🔌 API Endpoints

### Autenticação
```
POST   /api/token/              # Login (obter tokens JWT)
POST   /api/token/refresh/      # Refresh token
```

### Usuários
```
GET    /api/users/              # Listar usuários
POST   /api/users/              # Criar usuário
GET    /api/users/{id}/         # Detalhes do usuário
PUT    /api/users/{id}/         # Atualizar usuário
DELETE /api/users/{id}/         # Deletar usuário
GET    /api/users/me/           # Usuário atual
GET    /api/users/barbers/      # Listar barbeiros
```

### Serviços
```
GET    /api/services/           # Listar serviços
POST   /api/services/           # Criar serviço
GET    /api/services/{id}/      # Detalhes do serviço
PUT    /api/services/{id}/      # Atualizar serviço
DELETE /api/services/{id}/      # Deletar serviço
```

### Agendamentos
```
GET    /api/appointments/                    # Listar agendamentos
POST   /api/appointments/                    # Criar agendamento
GET    /api/appointments/{id}/               # Detalhes
PUT    /api/appointments/{id}/               # Atualizar
DELETE /api/appointments/{id}/               # Deletar
GET    /api/appointments/available_slots/   # Horários disponíveis
POST   /api/appointments/{id}/cancel/       # Cancelar
POST   /api/appointments/{id}/confirm/      # Confirmar
POST   /api/appointments/{id}/complete/     # Concluir
```

### Bloqueios de Agenda
```
GET    /api/users/schedule-blocks/     # Listar bloqueios
POST   /api/users/schedule-blocks/     # Criar bloqueio
GET    /api/users/schedule-blocks/{id}/ # Detalhes
PUT    /api/users/schedule-blocks/{id}/ # Atualizar
DELETE /api/users/schedule-blocks/{id}/ # Deletar
```

### Relatórios
```
GET    /api/reports/barber/      # Relatório do barbeiro
GET    /api/reports/owner/       # Relatório do proprietário
GET    /api/reports/dashboard/   # Dashboard resumido
```

## ✨ Funcionalidades

### ✅ Implementadas

- [x] Sistema de autenticação JWT
- [x] Gerenciamento de usuários (Cliente, Barbeiro, Proprietário)
- [x] CRUD de serviços
- [x] Sistema de agendamentos
- [x] Bloqueio de agenda por barbeiros
- [x] Relatórios individuais (barbeiro)
- [x] Relatórios gerenciais (proprietário)
- [x] Dashboard com métricas
- [x] API RESTful completa
- [x] Interface web com Material UI
- [x] Sistema de autenticação no frontend
- [x] Docker multi-ambiente (dev/hml/prod)

### 🔄 Preparado para Implementação Futura

- [ ] Notificações por e-mail
- [ ] Notificações por SMS
- [ ] Notificações por WhatsApp
- [ ] Integração com WhatsApp Business API
- [ ] Sistema de pagamento online
- [ ] Cadastro de cartão de crédito
- [ ] Agendamento via WhatsApp
- [ ] Sistema de fidelidade/pontos
- [ ] Avaliações e comentários
- [ ] Upload de fotos de cortes

## 🗺️ Roadmap

### Fase 1 - MVP ✅
- [x] Setup da infraestrutura
- [x] Backend com Django + DRF
- [x] Frontend com Next.js + Material UI
- [x] Sistema de autenticação
- [x] CRUD básico de entidades
- [x] Sistema de agendamentos

### Fase 2 - Notificações 🚧
- [ ] Integração com serviço de e-mail (SendGrid/AWS SES)
- [ ] Integração com serviço de SMS (Twilio)
- [ ] Integração com WhatsApp Business API
- [ ] Sistema de templates de mensagens
- [ ] Agendamento de envios com Celery

### Fase 3 - Pagamentos 📅
- [ ] Integração com gateway de pagamento
- [ ] Sistema de assinaturas
- [ ] Histórico de pagamentos
- [ ] Relatórios financeiros detalhados

### Fase 4 - Melhorias 📅
- [ ] PWA (Progressive Web App)
- [ ] App mobile (React Native)
- [ ] Sistema de avaliações
- [ ] Gamificação e fidelidade

## 🛠️ Desenvolvimento

### Estrutura de Branches
- `main` - Produção
- `develop` - Desenvolvimento
- `feature/*` - Novas funcionalidades
- `hotfix/*` - Correções urgentes

### Executando Testes

```bash
# Backend
make test-backend

# Ou diretamente
cd infra/dev
docker-compose exec backend python manage.py test
```

### Migrações do Banco

```bash
# Criar migrações
make dev-makemigrations

# Aplicar migrações
make dev-migrate
```

### Acessar Shell dos Containers

```bash
# Backend
make dev-shell-backend

# Frontend
make dev-shell-frontend
```

## 📦 Backup e Restore

### Criar Backup

```bash
# Usando Make
make prod-backup-db

# Ou usando script
chmod +x scripts/backup.sh
./scripts/backup.sh
```

### Restaurar Backup

```bash
cd infra/prod
docker-compose exec postgres psql -U barber_user_prod barber_db_prod < backups/backup_YYYYMMDD_HHMMSS.sql
```

## 🔒 Segurança

### Práticas Implementadas
- Autenticação JWT com refresh tokens
- Senhas hasheadas com bcrypt
- CORS configurado
- Validação de dados no backend
- SQL injection protection (ORM)
- XSS protection

### Para Produção
- [ ] Configurar HTTPS/SSL
- [ ] Implementar rate limiting
- [ ] Configurar firewall
- [ ] Habilitar logs de auditoria
- [ ] Implementar 2FA
- [ ] Backup automatizado

## 📝 Licença

Este projeto é proprietário. Todos os direitos reservados.

## 👥 Equipe

- **Backend**: Django + DRF
- **Frontend**: Next.js + Material UI
- **DevOps**: Docker + Docker Compose

## 📞 Suporte

Para suporte e dúvidas, entre em contato através de:
- Email: suporte@barbearia.com
- WhatsApp: (11) 99999-9999

---

**Desenvolvido com ❤️ para modernizar o atendimento de barbearias**