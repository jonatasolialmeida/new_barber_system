# Documentação Completa - Infraestrutura

## 1. Visão Geral

A infraestrutura do Sistema de Agendamento para Barbearia é totalmente containerizada usando Docker e Docker Compose, permitindo deployment consistente e escalável em múltiplos ambientes. O sistema oferece três ambientes isolados: Desenvolvimento (dev), Homologação (hml) e Produção (prod).

## 2. Tecnologias de Infraestrutura

### 2.1 Containerização

**Docker**
- Containerização de aplicações
- Isolamento de dependências
- Portabilidade entre ambientes
- Imagens otimizadas (Alpine Linux)

**Docker Compose**
- Orquestração de multi-containers
- Definição declarativa de serviços
- Redes e volumes gerenciados
- Variáveis de ambiente

### 2.2 Serviços Core

**PostgreSQL 16 Alpine**
- Banco de dados relacional principal
- Imagem Alpine (leve e segura)
- Persistência via volumes Docker
- Ports customizados por ambiente

**Redis 7 Alpine**
- Cache de dados
- Message broker para Celery
- Session storage (futuro)
- Persistência opcional

**pgAdmin 4**
- Interface web para PostgreSQL
- Gerenciamento de banco de dados
- Queries e backups
- Configurações por ambiente

**Portainer CE**
- Interface web para Docker
- Gerenciamento de containers
- Monitoramento de recursos
- Logs centralizados

### 2.3 Servidores de Aplicação

**Gunicorn (Produção)**
- WSGI HTTP Server
- Multi-worker (4 workers em prod)
- Timeout configurável
- Logging estruturado

**Django Development Server (Dev)**
- Hot reload automático
- Debug toolbar
- Mais verboso para desenvolvimento

**Next.js Server**
- Servidor SSR/SSG
- Hot Module Replacement (dev)
- Build otimizado (prod)

### 2.4 Proxy Reverso (Produção)

**Nginx Alpine**
- Proxy reverso
- Load balancing
- Servir arquivos estáticos
- SSL/TLS termination
- Gzip compression

### 2.5 Processamento Assíncrono (Produção)

**Celery Worker**
- Processamento de tarefas em background
- Múltiplas instâncias
- Retry automático
- Dead letter queue

**Celery Beat**
- Scheduler de tarefas periódicas
- Cron-like scheduling
- Persistência de agendamentos

## 3. Estrutura de Ambientes

```
infra/
├── dev/                          # Desenvolvimento
│   ├── docker-compose.yml        # Orquestração de containers
│   ├── .env.example              # Template de variáveis de ambiente
│   └── .env                      # Variáveis reais (git ignored)
│
├── hml/                          # Homologação
│   ├── docker-compose.yml
│   ├── .env.example
│   └── .env
│
└── prod/                         # Produção
    ├── docker-compose.yml
    ├── .env.example
    ├── .env
    ├── nginx/                    # Configurações Nginx
    │   ├── nginx.conf
    │   └── ssl/                  # Certificados SSL
    └── backups/                  # Backups do banco
```

## 4. Ambiente de Desenvolvimento (dev)

### 4.1 Características

- **DEBUG**: Ativado
- **Hot Reload**: Habilitado no backend e frontend
- **Volumes**: Código fonte montado (live editing)
- **Restart Policy**: unless-stopped
- **Networks**: barber_network_dev (bridge)

### 4.2 Serviços

| Serviço | Container | Porta Host | Porta Container |
|---------|-----------|------------|-----------------|
| PostgreSQL | barber_postgres_dev | 5432 | 5432 |
| Redis | barber_redis_dev | 6379 | 6379 |
| Backend | barber_backend_dev | 8000 | 8000 |
| Frontend | barber_frontend_dev | 3000 | 3000 |
| pgAdmin | barber_pgadmin_dev | 5050 | 80 |
| Portainer | barber_portainer_dev | 9000 | 9000 |

### 4.3 Docker Compose (dev)

**Arquivo:** `infra/dev/docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: barber_postgres_dev
    restart: unless-stopped
    environment:
      POSTGRES_DB: barber_db
      POSTGRES_USER: barber_user
      POSTGRES_PASSWORD: barber_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data_dev:/var/lib/postgresql/data
    networks:
      - barber_network_dev

  redis:
    image: redis:7-alpine
    container_name: barber_redis_dev
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data_dev:/data
    networks:
      - barber_network_dev

  backend:
    build:
      context: ../../backend
      dockerfile: Dockerfile
    container_name: barber_backend_dev
    restart: unless-stopped
    command: python manage.py runserver 0.0.0.0:8000
    environment:
      DEBUG: "True"
      SECRET_KEY: dev-secret-key-change-in-production
      ALLOWED_HOSTS: localhost,127.0.0.1,backend
      DB_ENGINE: django.db.backends.postgresql
      DB_NAME: barber_db
      DB_USER: barber_user
      DB_PASSWORD: barber_password
      DB_HOST: postgres
      DB_PORT: 5432
      CORS_ALLOWED_ORIGINS: http://localhost:3000,http://127.0.0.1:3000
      CELERY_BROKER_URL: redis://redis:6379/0
      CELERY_RESULT_BACKEND: redis://redis:6379/0
    ports:
      - "8000:8000"
    volumes:
      - ../../backend:/app
    networks:
      - barber_network_dev
    depends_on:
      - postgres
      - redis

  frontend:
    build:
      context: ../../frontend
      dockerfile: Dockerfile.dev
    container_name: barber_frontend_dev
    restart: unless-stopped
    command: npm run dev
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000/api
    ports:
      - "3000:3000"
    volumes:
      - ../../frontend:/app
      - /app/node_modules
      - /app/.next
    networks:
      - barber_network_dev
    depends_on:
      - backend

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: barber_pgadmin_dev
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@barber.com
      PGADMIN_DEFAULT_PASSWORD: admin123
      PGADMIN_CONFIG_SERVER_MODE: 'False'
    ports:
      - "5050:80"
    volumes:
      - pgadmin_data_dev:/var/lib/pgadmin
    networks:
      - barber_network_dev
    depends_on:
      - postgres

  portainer:
    image: portainer/portainer-ce:latest
    container_name: barber_portainer_dev
    restart: unless-stopped
    ports:
      - "9000:9000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data_dev:/data
    networks:
      - barber_network_dev

volumes:
  postgres_data_dev:
  pgadmin_data_dev:
  redis_data_dev:
  portainer_data_dev:

networks:
  barber_network_dev:
    driver: bridge
```

### 4.4 Variáveis de Ambiente (dev)

**Arquivo:** `infra/dev/.env.example`

```env
# PostgreSQL
POSTGRES_DB=barber_db
POSTGRES_USER=barber_user
POSTGRES_PASSWORD=barber_password

# pgAdmin
PGADMIN_DEFAULT_EMAIL=admin@barber.com
PGADMIN_DEFAULT_PASSWORD=admin123

# Backend
SECRET_KEY=dev-secret-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,backend

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4.5 Comandos (dev)

```bash
# Iniciar ambiente
make dev-up
# ou
cd infra/dev && docker-compose up -d

# Parar ambiente
make dev-down

# Ver logs
make dev-logs

# Rebuild containers
make dev-build

# Migrations
make dev-migrate
make dev-makemigrations

# Criar superusuário
make dev-createsuperuser

# Acessar shell do backend
make dev-shell-backend

# Acessar shell do frontend
make dev-shell-frontend
```

## 5. Ambiente de Homologação (hml)

### 5.1 Características

- **DEBUG**: Desativado
- **Build**: Otimizado (similar a produção)
- **Volumes**: Código montado para testes
- **Restart Policy**: unless-stopped
- **Networks**: barber_network_hml (bridge)

### 5.2 Serviços

| Serviço | Container | Porta Host | Porta Container |
|---------|-----------|------------|-----------------|
| PostgreSQL | barber_postgres_hml | 5433 | 5432 |
| Redis | barber_redis_hml | 6380 | 6379 |
| Backend | barber_backend_hml | 8001 | 8000 |
| Frontend | barber_frontend_hml | 3001 | 3000 |
| pgAdmin | barber_pgadmin_hml | 5051 | 80 |
| Portainer | barber_portainer_hml | 9001 | 9000 |

### 5.3 Diferenças do Dev

- Gunicorn ao invés de Django dev server
- DEBUG=False
- Portas diferentes para evitar conflitos
- Build de produção do Next.js
- Variáveis de ambiente via .env

### 5.4 Comandos (hml)

```bash
# Iniciar ambiente
make hml-up

# Parar ambiente
make hml-down

# Ver logs
make hml-logs

# Rebuild containers
make hml-build

# Migrations
make hml-migrate
```

## 6. Ambiente de Produção (prod)

### 6.1 Características

- **DEBUG**: Desativado (obrigatório)
- **Build**: Otimizado e minificado
- **Restart Policy**: always
- **Gunicorn**: 4 workers, 2 threads
- **Celery**: Worker e Beat ativos
- **Nginx**: Proxy reverso
- **Backups**: Automatizados
- **Networks**: barber_network_prod (bridge)
- **Security**: Senhas fortes, variáveis via .env

### 6.2 Serviços

| Serviço | Container | Porta Host | Porta Container |
|---------|-----------|------------|-----------------|
| PostgreSQL | barber_postgres_prod | 5434 | 5432 |
| Redis | barber_redis_prod | 6381 | 6379 |
| Backend | barber_backend_prod | 8002 | 8000 |
| Frontend | barber_frontend_prod | 3002 | 3000 |
| Celery Worker | barber_celery_worker_prod | - | - |
| Celery Beat | barber_celery_beat_prod | - | - |
| pgAdmin | barber_pgadmin_prod | 5052 | 80 |
| Portainer | barber_portainer_prod | 9002 | 9000 |
| Nginx | barber_nginx_prod | 80, 443 | 80, 443 |

### 6.3 Docker Compose (prod)

**Arquivo:** `infra/prod/docker-compose.yml`

**Destaques:**

```yaml
backend:
  command: gunicorn barber_project.wsgi:application --bind 0.0.0.0:8000 --workers 4 --threads 2
  environment:
    DEBUG: "False"
    SECRET_KEY: ${SECRET_KEY}  # Deve ser forte!
  volumes:
    - static_files_prod:/app/staticfiles
    - media_files_prod:/app/mediafiles

celery_worker:
  command: celery -A barber_project worker --loglevel=info
  restart: always
  depends_on:
    - postgres
    - redis

celery_beat:
  command: celery -A barber_project beat --loglevel=info
  restart: always

redis:
  command: redis-server --requirepass ${REDIS_PASSWORD}

nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    - ./nginx/ssl:/etc/nginx/ssl:ro
    - static_files_prod:/usr/share/nginx/html/static:ro
    - media_files_prod:/usr/share/nginx/html/media:ro
```

### 6.4 Variáveis de Ambiente (prod)

**Arquivo:** `infra/prod/.env.example`

```env
# PostgreSQL
POSTGRES_DB=barber_db_prod
POSTGRES_USER=barber_user_prod
POSTGRES_PASSWORD=STRONG_PASSWORD_HERE

# Redis
REDIS_PASSWORD=STRONG_REDIS_PASSWORD

# Backend
SECRET_KEY=VERY_STRONG_SECRET_KEY_HERE
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,backend

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database
DB_NAME=barber_db_prod
DB_USER=barber_user_prod
DB_PASSWORD=STRONG_PASSWORD_HERE

# pgAdmin
PGADMIN_DEFAULT_EMAIL=admin@yourdomain.com
PGADMIN_DEFAULT_PASSWORD=STRONG_PGADMIN_PASSWORD

# Frontend
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### 6.5 Nginx Configuration

**Arquivo:** `infra/prod/nginx/nginx.conf`

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }

    upstream frontend {
        server frontend:3000;
    }

    # Redirecionar HTTP para HTTPS
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS
    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        # SSL certificates
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;

        # SSL settings
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Gzip
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        # Backend API
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_redirect off;
        }

        # Backend Admin
        location /admin/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files
        location /static/ {
            alias /usr/share/nginx/html/static/;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }

        # Media files
        location /media/ {
            alias /usr/share/nginx/html/media/;
            expires 30d;
            add_header Cache-Control "public";
        }

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
```

### 6.6 SSL/TLS com Let's Encrypt

**Obter certificado:**

```bash
# Instalar certbot
apt-get install certbot

# Obter certificado
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificados estarão em /etc/letsencrypt/live/yourdomain.com/
# Copiar para infra/prod/nginx/ssl/
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem infra/prod/nginx/ssl/
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem infra/prod/nginx/ssl/

# Renovação automática (cron)
0 0 1 * * certbot renew --quiet && docker-compose restart nginx
```

### 6.7 Comandos (prod)

```bash
# Iniciar ambiente (com confirmação)
make prod-up

# Parar ambiente
make prod-down

# Ver logs
make prod-logs

# Rebuild containers
make prod-build

# Migrations
make prod-migrate

# Backup do banco
make prod-backup-db
```

## 7. Makefile

O Makefile centraliza todos os comandos de gerenciamento da infraestrutura.

**Arquivo:** `Makefile` (raiz do projeto)

### 7.1 Comandos de Desenvolvimento

```makefile
dev-up: ## Iniciar ambiente de desenvolvimento
	cd infra/dev && docker-compose up -d

dev-down: ## Parar ambiente de desenvolvimento
	cd infra/dev && docker-compose down

dev-restart: dev-down dev-up ## Reiniciar ambiente

dev-logs: ## Ver logs
	cd infra/dev && docker-compose logs -f

dev-build: ## Rebuild containers
	cd infra/dev && docker-compose build --no-cache

dev-migrate: ## Executar migrations
	cd infra/dev && docker-compose exec backend python manage.py migrate

dev-makemigrations: ## Criar migrations
	cd infra/dev && docker-compose exec backend python manage.py makemigrations

dev-createsuperuser: ## Criar superusuário
	cd infra/dev && docker-compose exec backend python manage.py createsuperuser

dev-shell-backend: ## Acessar shell do backend
	cd infra/dev && docker-compose exec backend bash

dev-shell-frontend: ## Acessar shell do frontend
	cd infra/dev && docker-compose exec frontend sh
```

### 7.2 Comandos de Homologação

```makefile
hml-up: ## Iniciar ambiente de homologação
	cd infra/hml && docker-compose up -d

hml-down: ## Parar ambiente de homologação
	cd infra/hml && docker-compose down

hml-logs: ## Ver logs
	cd infra/hml && docker-compose logs -f

hml-build: ## Rebuild containers
	cd infra/hml && docker-compose build --no-cache

hml-migrate: ## Executar migrations
	cd infra/hml && docker-compose exec backend python manage.py migrate
```

### 7.3 Comandos de Produção

```makefile
prod-up: ## Iniciar ambiente de produção
	@echo "ATENÇÃO: Iniciando ambiente de PRODUÇÃO!"
	@read -p "Tem certeza? (y/N): " confirm && [ $$confirm = y ] || exit 1
	cd infra/prod && docker-compose up -d

prod-down: ## Parar ambiente de produção
	cd infra/prod && docker-compose down

prod-logs: ## Ver logs
	cd infra/prod && docker-compose logs -f

prod-build: ## Rebuild containers
	cd infra/prod && docker-compose build --no-cache

prod-migrate: ## Executar migrations
	cd infra/prod && docker-compose exec backend python manage.py migrate

prod-backup-db: ## Backup do banco de dados
	cd infra/prod && docker-compose exec postgres pg_dump -U barber_user_prod barber_db_prod > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
```

### 7.4 Comandos Utilitários

```makefile
clean: ## Limpar containers, volumes e imagens não utilizados
	docker system prune -af --volumes

setup-dev: ## Setup completo do ambiente de desenvolvimento
	cp infra/dev/.env.example infra/dev/.env
	cp backend/.env.example backend/.env
	cp frontend/.env.example frontend/.env

test-backend: ## Executar testes do backend
	cd infra/dev && docker-compose exec backend python manage.py test

help: ## Mostrar esta ajuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'
```

## 8. Volumes Docker

### 8.1 Tipos de Volumes

**Named Volumes (Persistência)**
```yaml
volumes:
  postgres_data_dev:  # Dados do PostgreSQL
  redis_data_dev:     # Dados do Redis
  pgadmin_data_dev:   # Configurações pgAdmin
  portainer_data_dev: # Dados do Portainer
```

**Bind Mounts (Desenvolvimento)**
```yaml
volumes:
  - ../../backend:/app  # Código do backend
  - ../../frontend:/app # Código do frontend
```

**Volumes para Static/Media (Produção)**
```yaml
volumes:
  static_files_prod:  # Arquivos estáticos Django
  media_files_prod:   # Uploads de usuários
```

### 8.2 Gerenciamento de Volumes

```bash
# Listar volumes
docker volume ls

# Inspecionar volume
docker volume inspect barber_postgres_data_dev

# Remover volume
docker volume rm barber_postgres_data_dev

# Remover volumes não utilizados
docker volume prune
```

## 9. Redes Docker

### 9.1 Redes por Ambiente

Cada ambiente possui sua própria rede bridge:
- `barber_network_dev`
- `barber_network_hml`
- `barber_network_prod`

### 9.2 Comunicação Entre Containers

Containers na mesma rede se comunicam pelo nome do serviço:

```python
# Backend conecta ao PostgreSQL
DB_HOST=postgres  # Nome do serviço no docker-compose.yml

# Backend conecta ao Redis
CELERY_BROKER_URL=redis://redis:6379/0
```

### 9.3 Comandos de Rede

```bash
# Listar redes
docker network ls

# Inspecionar rede
docker network inspect barber_network_dev

# Remover rede
docker network rm barber_network_dev
```

## 10. Backup e Restore

### 10.1 Backup do Banco de Dados

**Backup Manual:**
```bash
# Usando Makefile
make prod-backup-db

# Ou diretamente
cd infra/prod
docker-compose exec postgres pg_dump -U barber_user_prod barber_db_prod > backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

**Backup Automatizado (Cron):**
```bash
# Adicionar ao crontab
0 2 * * * cd /path/to/barber && make prod-backup-db
```

### 10.2 Restore do Banco de Dados

```bash
# Parar aplicação
make prod-down

# Restaurar backup
cd infra/prod
cat backups/backup_20251006_020000.sql | docker-compose exec -T postgres psql -U barber_user_prod barber_db_prod

# Reiniciar aplicação
make prod-up
```

### 10.3 Backup de Volumes

```bash
# Backup de volume named
docker run --rm -v barber_postgres_data_prod:/data -v $(pwd)/backups:/backup alpine tar czf /backup/postgres_volume_$(date +%Y%m%d).tar.gz /data
```

## 11. Monitoramento e Logs

### 11.1 Logs de Containers

```bash
# Ver logs de todos containers
make dev-logs

# Logs de container específico
docker logs -f barber_backend_dev

# Logs com timestamp
docker logs -f --timestamps barber_backend_dev

# Últimas 100 linhas
docker logs --tail 100 barber_backend_dev
```

### 11.2 Monitoramento com Portainer

Portainer oferece interface web para:
- Status de containers
- Uso de CPU/RAM
- Logs em tempo real
- Gerenciamento de volumes
- Gerenciamento de redes
- Stacks (docker-compose)

**Acesso:**
- Dev: http://localhost:9000
- Hml: http://localhost:9001
- Prod: http://localhost:9002

### 11.3 Métricas de Recursos

```bash
# Ver uso de recursos
docker stats

# Stats de container específico
docker stats barber_backend_prod
```

## 12. Escalabilidade

### 12.1 Escalar Serviços

```bash
# Escalar celery workers (produção)
cd infra/prod
docker-compose up -d --scale celery_worker=3

# Escalar backend (com load balancer)
docker-compose up -d --scale backend=2
```

### 12.2 Load Balancing com Nginx

Para múltiplas instâncias do backend:

```nginx
upstream backend {
    least_conn;  # Algoritmo de balanceamento
    server backend_1:8000;
    server backend_2:8000;
    server backend_3:8000;
}
```

## 13. Segurança

### 13.1 Práticas Implementadas

- **Variáveis de Ambiente**: Senhas não commitadas
- **Redes Isoladas**: Cada ambiente tem sua rede
- **Restart Policies**: Containers reiniciam em falha
- **Redis com Senha**: Em produção
- **Non-root User**: Containers rodam com usuário limitado

### 13.2 Recomendações Adicionais

**Firewall (UFW):**
```bash
# Permitir apenas portas necessárias
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

**Docker Security:**
```bash
# Limitar recursos de container
docker-compose.yml:
  services:
    backend:
      mem_limit: 512m
      cpus: 0.5
```

**Atualização de Imagens:**
```bash
# Atualizar imagens base
docker-compose pull
docker-compose up -d --build
```

## 14. CI/CD (Futuro)

### 14.1 GitHub Actions Exemplo

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/barber
            git pull origin main
            make prod-build
            make prod-migrate
            make prod-up
```

### 14.2 GitLab CI/CD Exemplo

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - docker-compose -f infra/prod/docker-compose.yml build

deploy:
  stage: deploy
  only:
    - main
  script:
    - ssh user@server "cd /var/www/barber && make prod-up"
```

## 15. Troubleshooting

### 15.1 Problemas Comuns

**Container não inicia:**
```bash
# Ver logs
docker logs barber_backend_dev

# Inspecionar container
docker inspect barber_backend_dev

# Verificar saúde
docker ps -a
```

**Erro de permissão em volumes:**
```bash
# Ajustar permissões
sudo chown -R $USER:$USER backend/
```

**Porta já em uso:**
```bash
# Ver o que está usando a porta
lsof -i :8000

# Matar processo
kill -9 <PID>

# Ou mudar porta no docker-compose.yml
```

**Banco de dados não conecta:**
```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Verificar logs do PostgreSQL
docker logs barber_postgres_dev

# Testar conexão
docker-compose exec backend python manage.py dbshell
```

**Celery não processa tarefas:**
```bash
# Ver logs do worker
docker logs -f barber_celery_worker_prod

# Ver status do Redis
docker-compose exec redis redis-cli ping

# Listar tarefas pendentes
docker-compose exec backend python manage.py shell
>>> from celery.task.control import inspect
>>> i = inspect()
>>> i.active()
```

### 15.2 Reset Completo

```bash
# Parar tudo
make dev-down

# Remover volumes (CUIDADO: perde dados!)
docker-compose down -v

# Limpar tudo
make clean

# Rebuild e restart
make dev-build
make dev-up
```

## 16. Performance

### 16.1 Otimizações Implementadas

- **Alpine Images**: Imagens menores e mais rápidas
- **Multi-stage Builds**: Reduz tamanho de imagens
- **Gunicorn Workers**: Múltiplos processos
- **Nginx Gzip**: Compressão de respostas
- **Static Files**: Servidos diretamente pelo Nginx

### 16.2 Melhorias Futuras

- CDN para static/media files
- Caching com Redis
- Database connection pooling
- Read replicas do PostgreSQL
- Kubernetes para orquestração

## 17. Disaster Recovery

### 17.1 Plano de Recuperação

1. **Backup Regular**: Diário às 2h da manhã
2. **Backup Offsite**: Copiar para S3/GCS
3. **Teste de Restore**: Mensal
4. **Documentação**: Procedimentos atualizados
5. **Monitoramento**: Alertas de falhas

### 17.2 Procedimento de Restore

```bash
# 1. Provisionar novo servidor
# 2. Instalar Docker e Docker Compose
# 3. Clonar repositório
git clone <repo-url>
cd barber

# 4. Configurar variáveis de ambiente
cp infra/prod/.env.example infra/prod/.env
# Editar .env com valores corretos

# 5. Restaurar backup do banco
cat backup.sql | docker-compose exec -T postgres psql -U user db

# 6. Iniciar serviços
make prod-up
```

## 18. Custos Estimados

### 18.1 Servidor VPS (Produção)

**Especificações Mínimas:**
- CPU: 2 vCPUs
- RAM: 4 GB
- Disco: 80 GB SSD
- Tráfego: 4 TB/mês

**Provedores:**
- DigitalOcean: ~$24/mês
- Linode: ~$24/mês
- AWS EC2 t3.medium: ~$30/mês
- Hetzner: ~€15/mês (~$16)

### 18.2 Serviços Adicionais

- **Domínio**: ~$12/ano
- **SSL (Let's Encrypt)**: Grátis
- **Backup S3**: ~$5/mês (100GB)
- **Monitoramento (Sentry)**: Grátis até 5k eventos/mês

**Total Estimado:** ~$40-50/mês

## 19. Checklist de Deploy

### 19.1 Pré-Deploy

- [ ] Testes passando
- [ ] Migrations criadas
- [ ] .env configurado
- [ ] SECRET_KEY forte
- [ ] Senhas de banco fortes
- [ ] ALLOWED_HOSTS correto
- [ ] CORS_ALLOWED_ORIGINS correto
- [ ] SSL configurado
- [ ] Backup do banco atual

### 19.2 Deploy

- [ ] Build das imagens
- [ ] Push para registry (se usar)
- [ ] Pull no servidor
- [ ] Parar aplicação
- [ ] Executar migrations
- [ ] Collectstatic
- [ ] Iniciar aplicação
- [ ] Verificar saúde

### 19.3 Pós-Deploy

- [ ] Testar endpoints principais
- [ ] Verificar logs
- [ ] Monitorar métricas
- [ ] Backup pós-deploy

## 20. Contatos e Suporte

Para dúvidas sobre infraestrutura:
- Documentação Docker: https://docs.docker.com/
- Documentação Docker Compose: https://docs.docker.com/compose/
- Issues do projeto
- E-mail: suporte@barbearia.com

---

**Documento gerado em:** 2025-10-06
**Versão:** 1.0.0
**Docker:** 20.10+
**Docker Compose:** 2.0+
**Última atualização:** 2025-10-06
