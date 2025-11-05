# Infraestrutura - Sistema de Agendamento de Barbearia

Documentação completa da infraestrutura Docker e deploy do sistema de agendamento de barbearia.

## 🏗️ Arquitetura

### Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer (Nginx)                 │
│                  HTTPS/SSL + Reverse Proxy               │
└───────────────────┬──────────────────┬──────────────────┘
                    │                  │
         ┌──────────▼────────┐  ┌─────▼──────────┐
         │   Frontend (Next)  │  │  Backend (Django)│
         │   Port: 3000       │  │  Port: 8000     │
         └──────────┬─────────┘  └─────┬───────────┘
                    │                  │
         ┌──────────▼────────┬─────────▼────────────┐
         │   PostgreSQL      │     Redis            │
         │   Port: 5432      │    Port: 6379        │
         └───────────────────┴──────────────────────┘
                         │
              ┌──────────┴──────────┐
              │  Celery Worker      │
              │  Celery Beat        │
              └─────────────────────┘
```

## 📋 Índice

- [Ambientes](#ambientes)
- [Serviços](#serviços)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Comandos Make](#comandos-make)
- [Docker Compose](#docker-compose)
- [Rede e Portas](#rede-e-portas)
- [Volumes](#volumes)
- [Health Checks](#health-checks)
- [Backup e Restore](#backup-e-restore)
- [Monitoramento](#monitoramento)
- [Troubleshooting](#troubleshooting)

## 🌍 Ambientes

### Development (`/infra/dev/`)

Ambiente para desenvolvimento local.

**Características:**
- Hot reload ativado
- Debug mode habilitado
- Console email backend
- Volumes montados diretamente
- Logs verbosos

**Portas:**
- Frontend: `3000`
- Backend: `8000`
- PostgreSQL: `5433`
- Redis: `6380`
- pgAdmin: `5050`
- Portainer: `9000`

### Homologation (`/infra/hml/`)

Ambiente para testes e validação.

**Características:**
- Configuração similar à produção
- Debug mode desabilitado
- Email configurável
- Dados de teste

**Portas:**
- Frontend: `3001`
- Backend: `8001`
- PostgreSQL: `5434`
- Redis: `6381`
- pgAdmin: `5051`
- Portainer: `9001`

### Production (`/infra/prod/`)

Ambiente de produção.

**Características:**
- Otimizado para performance
- Debug mode desabilitado
- HTTPS obrigatório
- Logs estruturados
- Backups automáticos
- Celery workers
- Nginx reverse proxy

**Portas:**
- HTTP: `80` (redirect para HTTPS)
- HTTPS: `443`
- Frontend (interno): `3002`
- Backend (interno): `8002`
- PostgreSQL: `5434`
- Redis: `6381`
- pgAdmin: `5052`
- Portainer: `9002`

## 🐳 Serviços

### 1. PostgreSQL

**Imagem:** `postgres:16-alpine`
**Função:** Banco de dados principal

**Características:**
- Armazenamento persistente
- Backups automáticos (produção)
- Health checks configurados
- pgAdmin para administração

**Configuração:**
```yaml
environment:
  POSTGRES_DB: barber_db
  POSTGRES_USER: barber_user
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

### 2. Redis

**Imagem:** `redis:7-alpine`
**Função:** Cache e broker para Celery

**Características:**
- Proteção por senha (produção)
- Armazenamento persistente
- Health checks

**Uso:**
- Cache de sessões
- Cache de dados da API
- Broker do Celery
- Result backend do Celery

### 3. Backend (Django)

**Imagem:** Custom (build do Dockerfile)
**Base:** `python:3.14.0-alpine`

**Características:**
- UV package manager (10-100x mais rápido)
- Gunicorn em produção
- Health checks em `/health/`
- Logs estruturados
- Rate limiting
- JWT authentication

**Workers:**
- Development: Django dev server
- Homologation: Gunicorn (3 workers, 2 threads)
- Production: Gunicorn (4 workers, 2 threads)

### 4. Frontend (Next.js)

**Imagem:** Custom (multi-stage build)
**Base:** `node:20-alpine`

**Características:**
- Output standalone
- Multi-stage build otimizado
- Usuário não-root
- Servido via Node.js server

**Otimizações:**
- Apenas dependencies de produção
- Build cache eficiente
- Imagem final ~30% menor

### 5. Celery Worker

**Função:** Processamento de tarefas assíncronas

**Tarefas:**
- Envio de emails
- Notificações
- Processamento de relatórios
- Tarefas agendadas

### 6. Celery Beat

**Função:** Agendador de tarefas periódicas

**Tarefas:**
- Lembretes de agendamento
- Limpeza de dados antigos
- Relatórios periódicos

### 7. Nginx (Produção)

**Imagem:** `nginx:alpine`
**Função:** Reverse proxy e load balancer

**Características:**
- SSL/TLS termination
- Compressão gzip
- Cache de arquivos estáticos
- Rate limiting

### 8. pgAdmin

**Imagem:** `dpage/pgadmin4:latest`
**Função:** Administração do PostgreSQL

**Acesso:**
- Dev: `http://localhost:5050`
- HML: `http://localhost:5051`
- Prod: `http://localhost:5052`

### 9. Portainer

**Imagem:** `portainer/portainer-ce:latest`
**Função:** Gerenciamento de containers Docker

**Acesso:**
- Dev: `http://localhost:9000`
- HML: `http://localhost:9001`
- Prod: `http://localhost:9002`

## 🚀 Instalação

### Pré-requisitos

- Docker 24+
- Docker Compose 2.20+
- Make (opcional, mas recomendado)

### Instalação do Docker

#### Linux (Ubuntu/Debian)

```bash
# Atualizar repositórios
sudo apt-get update

# Instalar dependências
sudo apt-get install ca-certificates curl gnupg

# Adicionar chave GPG do Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Adicionar repositório
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

#### macOS

```bash
# Com Homebrew
brew install --cask docker
```

#### Windows

Download do Docker Desktop: https://www.docker.com/products/docker-desktop

## ⚙️ Configuração

### 1. Configurar Variáveis de Ambiente

Cada ambiente tem seu próprio arquivo `.env`.

#### Development

```bash
cd infra/dev
cp .env.example .env

# Editar .env
nano .env
```

**Variáveis principais:**
```bash
# PostgreSQL
POSTGRES_DB=barber_db
POSTGRES_USER=barber_user
POSTGRES_PASSWORD=dev_password_123

# Backend
SECRET_KEY=dev-secret-key-change-in-production-123456789
DEBUG=True

# Redis
REDIS_PASSWORD=

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### Production

```bash
cd infra/prod
cp .env.example .env

# Editar .env com valores seguros
nano .env
```

**Variáveis principais:**
```bash
# PostgreSQL
POSTGRES_DB=barber_db_prod
POSTGRES_USER=barber_user_prod
POSTGRES_PASSWORD=SECURE_PASSWORD_HERE_CHANGE_ME

# Backend
SECRET_KEY=SUPER_SECURE_SECRET_KEY_MINIMUM_50_CHARACTERS_HERE
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Redis
REDIS_PASSWORD=SECURE_REDIS_PASSWORD_HERE

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Email (produção)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### 2. SSL/TLS (Produção)

Para produção, configure certificados SSL:

```bash
cd infra/prod/nginx/ssl

# Com Let's Encrypt
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copiar certificados
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./key.pem
```

## 🛠️ Comandos Make

O projeto inclui um `Makefile` para facilitar operações comuns.

### Development

```bash
# Iniciar ambiente
make dev-up

# Parar ambiente
make dev-down

# Ver logs
make dev-logs

# Ver logs de um serviço específico
make dev-logs service=backend

# Executar migrations
make dev-migrate

# Criar superuser
make dev-createsuperuser

# Acessar shell do backend
make dev-shell

# Executar testes
make dev-test

# Rebuild containers
make dev-rebuild
```

### Homologation

```bash
# Iniciar ambiente
make hml-up

# Parar ambiente
make hml-down

# Ver logs
make hml-logs

# Executar migrations
make hml-migrate

# Rebuild containers
make hml-rebuild
```

### Production

```bash
# Iniciar ambiente
make prod-up

# Parar ambiente
make prod-down

# Ver logs
make prod-logs

# Executar migrations
make prod-migrate

# Backup do banco de dados
make prod-backup-db

# Restore do banco de dados
make prod-restore-db file=backup.sql

# Rebuild containers
make prod-rebuild
```

### Comandos Gerais

```bash
# Limpar todos os ambientes
make clean

# Limpar completamente (incluindo volumes)
make clean-all

# Verificar status
make status

# Instalar dependências do backend
make install-backend

# Instalar dependências do frontend
make install-frontend
```

## 📦 Docker Compose

### Iniciar Ambiente

```bash
# Development
cd infra/dev
docker compose up -d

# Homologation
cd infra/hml
docker compose up -d

# Production
cd infra/prod
docker compose up -d
```

### Parar Ambiente

```bash
docker compose down
```

### Ver Logs

```bash
# Todos os serviços
docker compose logs -f

# Serviço específico
docker compose logs -f backend
```

### Rebuild e Restart

```bash
# Rebuild imagens
docker compose build --no-cache

# Restart serviços
docker compose restart

# Rebuild e restart
docker compose up -d --build
```

## 🌐 Rede e Portas

### Development

| Serviço | Porta Externa | Porta Interna |
|---------|---------------|---------------|
| Frontend | 3000 | 3000 |
| Backend | 8000 | 8000 |
| PostgreSQL | 5433 | 5432 |
| Redis | 6380 | 6379 |
| pgAdmin | 5050 | 80 |
| Portainer | 9000 | 9000 |

### Homologation

| Serviço | Porta Externa | Porta Interna |
|---------|---------------|---------------|
| Frontend | 3001 | 3000 |
| Backend | 8001 | 8000 |
| PostgreSQL | 5434 | 5432 |
| Redis | 6381 | 6379 |
| pgAdmin | 5051 | 80 |
| Portainer | 9001 | 9000 |

### Production

| Serviço | Porta Externa | Porta Interna |
|---------|---------------|---------------|
| Nginx | 80, 443 | 80, 443 |
| Frontend (interno) | - | 3000 |
| Backend (interno) | - | 8000 |
| PostgreSQL | 5434 | 5432 |
| Redis | 6381 | 6379 |
| pgAdmin | 5052 | 80 |
| Portainer | 9002 | 9000 |

### Redes Docker

Cada ambiente tem sua própria rede isolada:
- Development: `barber_network_dev`
- Homologation: `barber_network_hml`
- Production: `barber_network_prod`

## 💾 Volumes

### Volumes Nomeados

#### Development
- `postgres_data_dev` - Dados do PostgreSQL
- `redis_data_dev` - Dados do Redis
- `pgadmin_data_dev` - Configurações do pgAdmin
- `portainer_data_dev` - Dados do Portainer

#### Production
- `postgres_data_prod` - Dados do PostgreSQL
- `redis_data_prod` - Dados do Redis
- `static_files_prod` - Arquivos estáticos do Django
- `media_files_prod` - Uploads de mídia
- `pgadmin_data_prod` - Configurações do pgAdmin
- `portainer_data_prod` - Dados do Portainer

### Bind Mounts (Development)

```yaml
# Backend - hot reload
volumes:
  - ../../backend:/app

# Frontend - hot reload
volumes:
  - ../../frontend:/app
  - /app/node_modules  # Prevent overwrite
```

## 🏥 Health Checks

Todos os serviços em produção têm health checks configurados.

### PostgreSQL

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Redis

```yaml
healthcheck:
  test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 30s
```

### Backend

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/health/alive/"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 60s
```

### Verificar Health Status

```bash
# Via Docker
docker ps

# Via API
curl http://localhost:8000/health/
```

## 💾 Backup e Restore

### Backup Manual

```bash
# PostgreSQL
docker exec barber_postgres_prod pg_dump -U barber_user_prod barber_db_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Com Makefile
make prod-backup-db
```

### Backup Automático

Em produção, backups são criados automaticamente:

```bash
# Diariamente às 3h AM
# Configurado via cron ou serviço de backup
```

### Restore

```bash
# PostgreSQL
docker exec -i barber_postgres_prod psql -U barber_user_prod -d barber_db_prod < backup.sql

# Com Makefile
make prod-restore-db file=backup.sql
```

### Estratégia de Backup Recomendada

1. **Diário:** Backup completo do banco
2. **Semanal:** Backup de volumes Docker
3. **Mensal:** Backup offsite (S3, etc.)
4. **Retenção:** 7 dias diários, 4 semanais, 12 mensais

## 📊 Monitoramento

### Portainer

Interface web para gerenciar containers:

```
Development: http://localhost:9000
Homologation: http://localhost:9001
Production: http://localhost:9002
```

**Recursos:**
- Visualização de containers
- Logs em tempo real
- Estatísticas de recursos
- Terminal interativo
- Gestão de volumes e redes

### Logs

```bash
# Ver logs de todos os serviços
docker compose logs -f

# Logs de um serviço específico
docker compose logs -f backend

# Últimas 100 linhas
docker compose logs --tail=100 backend

# Filtrar por timestamp
docker compose logs --since 2024-01-01T10:00:00
```

### Métricas de Recursos

```bash
# Uso de recursos por container
docker stats

# Informações do sistema
docker system df

# Inspecionar container
docker inspect barber_backend_prod
```

### Ferramentas Recomendadas (Produção)

- **Prometheus + Grafana** - Métricas
- **ELK Stack** - Logs centralizados
- **Sentry** - Error tracking
- **Uptime Robot** - Monitoring de uptime

## 🔧 Troubleshooting

### Container não inicia

```bash
# Ver logs do container
docker logs barber_backend_prod

# Verificar configuração
docker inspect barber_backend_prod

# Testar comando manualmente
docker run -it --rm barber-backend sh
```

### Problemas de Conexão

```bash
# Verificar redes
docker network ls
docker network inspect barber_network_prod

# Testar conectividade
docker exec barber_backend_prod ping postgres
docker exec barber_backend_prod nc -zv postgres 5432
```

### Problemas de Permissão

```bash
# Verificar permissões de volumes
docker exec barber_backend_prod ls -la /app

# Ajustar ownership
docker exec barber_backend_prod chown -R app:app /app
```

### Banco de Dados não Conecta

```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Testar conexão
docker exec -it barber_postgres_prod psql -U barber_user_prod -d barber_db_prod

# Verificar logs
docker logs barber_postgres_prod
```

### Memória/CPU Alto

```bash
# Ver uso de recursos
docker stats

# Limpar recursos não utilizados
docker system prune -a --volumes

# Ajustar limites de recursos no docker-compose.yml
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 2G
```

### Reset Completo

```bash
# ATENÇÃO: Isso apaga TODOS os dados!
cd infra/dev  # ou hml/prod
docker compose down -v
docker compose up -d
```

## 📚 Recursos Adicionais

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

## 🤝 Contribuindo

Ao contribuir com infraestrutura:

1. Teste em development primeiro
2. Valide em homologation
3. Documente mudanças
4. Atualize este README
5. Crie PR com descrição detalhada

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

## 📞 Suporte

Para questões de infraestrutura:
- Email: infrastructure@barbersystem.com
- Slack: #infrastructure
