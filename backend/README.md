# Backend - Sistema de Agendamento de Barbearia

API REST desenvolvida com Django REST Framework para gerenciamento completo de agendamentos, usuários, serviços e relatórios de uma barbearia.

## 🚀 Tecnologias

- **Python 3.14** (Alpine Linux)
- **Django 5.2** - Framework web
- **Django REST Framework 3.15+** - API REST
- **PostgreSQL 16** - Banco de dados
- **Redis 7** - Cache e fila de tarefas
- **Celery** - Tarefas assíncronas
- **JWT (Simple JWT)** - Autenticação
- **UV** - Gerenciador de pacotes (10-100x mais rápido que pip)
- **Pytest** - Framework de testes
- **Gunicorn** - WSGI server (produção)

## 📋 Índice

- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Modelos de Dados](#modelos-de-dados)
- [API Endpoints](#api-endpoints)
- [Autenticação](#autenticação)
- [Testes](#testes)
- [Cache](#cache)
- [Logging](#logging)
- [Segurança](#segurança)
- [Deploy](#deploy)

## 🏗️ Arquitetura

### Aplicações Django

O backend está organizado em aplicações modulares:

```
apps/
├── users/          # Gerenciamento de usuários e autenticação
├── services/       # Serviços oferecidos pela barbearia
├── appointments/   # Sistema de agendamentos
└── reports/        # Relatórios e analytics
```

### Camadas

1. **Models** - Camada de dados (ORM Django)
2. **Serializers** - Serialização/validação de dados
3. **Views** - Lógica de negócio (ViewSets)
4. **URLs** - Roteamento de endpoints

## 💻 Instalação

### Requisitos

- Python 3.14+
- PostgreSQL 16+
- Redis 7+
- UV (opcional, mas recomendado)

### Instalação com UV (Recomendado)

```bash
# Instalar UV
curl -LsSf https://astral.sh/uv/install.sh | sh

# Criar ambiente virtual
uv venv

# Ativar ambiente virtual
source .venv/bin/activate  # Linux/Mac
# ou
.venv\Scripts\activate  # Windows

# Instalar dependências (10-100x mais rápido!)
uv pip install -r requirements.txt
```

### Instalação com pip (Tradicional)

```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
source venv/bin/activate  # Linux/Mac

# Instalar dependências
pip install -r requirements.txt
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend:

```bash
# Django Settings
SECRET_KEY=your-super-secret-key-here-change-in-production
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=barber_db
DB_USER=barber_user
DB_PASSWORD=secure_password_here
DB_HOST=localhost
DB_PORT=5432

# Redis & Cache
REDIS_PASSWORD=redis_password_here
REDIS_CACHE_URL=redis://:redis_password_here@localhost:6379/1
CELERY_BROKER_URL=redis://:redis_password_here@localhost:6379/0
CELERY_RESULT_BACKEND=redis://:redis_password_here@localhost:6379/0

# JWT
JWT_ACCESS_TOKEN_LIFETIME=60  # minutes
JWT_REFRESH_TOKEN_LIFETIME=1440  # minutes (24 hours)

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Rate Limiting
THROTTLE_RATE_ANON=100/hour
THROTTLE_RATE_USER=1000/hour
THROTTLE_RATE_LOGIN=5/minute

# Email (para produção)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@barbershop.com
ADMIN_EMAIL=admin@barbershop.com

# Logging
DJANGO_LOG_LEVEL=INFO
```

### 2. Banco de Dados

```bash
# Criar migrações
python manage.py makemigrations

# Executar migrações
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser
```

### 3. Coletar arquivos estáticos

```bash
python manage.py collectstatic --no-input
```

## 📁 Estrutura do Projeto

```
backend/
├── barber_project/          # Configurações do projeto
│   ├── settings.py         # Configurações Django
│   ├── urls.py             # URLs principais
│   ├── wsgi.py             # WSGI entry point
│   ├── asgi.py             # ASGI entry point
│   └── celery.py           # Configuração Celery
├── core/                    # App core (base models, views comuns)
│   ├── models.py           # TimeStampedModel
│   └── views.py            # Health checks
├── apps/
│   ├── users/              # Gestão de usuários
│   │   ├── models.py       # User, BarberScheduleBlock
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tests/
│   ├── services/           # Serviços da barbearia
│   │   ├── models.py       # Service
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── appointments/       # Sistema de agendamentos
│   │   ├── models.py       # Appointment
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── notifications.py
│   │   ├── urls.py
│   │   └── tests/
│   └── reports/            # Relatórios
│       ├── views.py
│       └── urls.py
├── logs/                    # Arquivos de log
├── mediafiles/              # Uploads (imagens de serviços, etc.)
├── staticfiles/             # Arquivos estáticos
├── requirements.txt         # Dependências Python
├── pytest.ini              # Configuração de testes
├── conftest.py             # Fixtures compartilhadas
├── Dockerfile              # Build da imagem Docker
├── entrypoint.sh           # Script de inicialização
└── manage.py               # CLI Django
```

## 📊 Modelos de Dados

### User

Modelo customizado de usuário com autenticação por email.

**Campos:**
- `email` - Email único (usado para login)
- `first_name` - Primeiro nome
- `last_name` - Sobrenome
- `phone` - Telefone
- `birth_date` - Data de nascimento
- `role` - Papel: CLIENT, BARBER, OWNER
- `is_active` - Usuário ativo
- Campos de notificação: `notify_email`, `notify_sms`, `notify_whatsapp`

**Métodos:**
- `full_name` - Retorna nome completo

### Service

Serviços oferecidos pela barbearia.

**Campos:**
- `name` - Nome do serviço
- `description` - Descrição
- `duration` - Duração em minutos
- `price` - Preço
- `image` - Imagem do serviço (opcional)
- `is_active` - Serviço ativo

### Appointment

Agendamentos de clientes.

**Campos:**
- `client` - FK para User (cliente)
- `barber` - FK para User (barbeiro)
- `service` - FK para Service
- `date` - Data do agendamento
- `start_time` - Horário de início
- `price_charged` - Preço cobrado
- `status` - Status: SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW
- Campos de notificação: `confirmed_at`, `cancelled_at`, etc.

### BarberScheduleBlock

Bloqueios de agenda dos barbeiros (férias, folgas).

**Campos:**
- `barber` - FK para User (barbeiro)
- `start_date` - Data inicial
- `end_date` - Data final
- `start_time` - Horário inicial (opcional)
- `end_time` - Horário final (opcional)
- `is_all_day` - Bloqueio de dia inteiro
- `reason` - Motivo do bloqueio

## 🌐 API Endpoints

### Base URL

```
http://localhost:8000/api/
```

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/token/` | Obter token JWT |
| POST | `/api/token/refresh/` | Atualizar token JWT |

### Usuários

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/users/` | Registrar usuário | Não |
| GET | `/api/users/me/` | Dados do usuário atual | Sim |
| GET | `/api/users/barbers/` | Listar barbeiros | Sim |
| GET | `/api/users/{id}/` | Detalhes do usuário | Sim |
| PATCH | `/api/users/{id}/` | Atualizar usuário | Sim |

### Serviços

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/services/` | Listar serviços | Sim |
| POST | `/api/services/` | Criar serviço | Sim (OWNER) |
| GET | `/api/services/{id}/` | Detalhes do serviço | Sim |
| PATCH | `/api/services/{id}/` | Atualizar serviço | Sim (OWNER) |
| DELETE | `/api/services/{id}/` | Deletar serviço | Sim (OWNER) |

### Agendamentos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/appointments/` | Listar agendamentos | Sim |
| POST | `/api/appointments/` | Criar agendamento | Sim |
| GET | `/api/appointments/{id}/` | Detalhes do agendamento | Sim |
| GET | `/api/appointments/available_slots/` | Horários disponíveis | Sim |
| POST | `/api/appointments/{id}/cancel/` | Cancelar agendamento | Sim |
| POST | `/api/appointments/{id}/confirm/` | Confirmar agendamento | Sim (BARBER) |
| POST | `/api/appointments/{id}/complete/` | Completar agendamento | Sim (BARBER) |

### Health Checks

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/health/` | Health check completo | Não |
| GET | `/health/ready/` | Readiness check | Não |
| GET | `/health/alive/` | Liveness check | Não |

## 🔐 Autenticação

O sistema usa **JWT (JSON Web Tokens)** para autenticação.

### Obter Token

```bash
POST /api/token/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Resposta:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Usar Token

Inclua o token no header Authorization:

```bash
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### Atualizar Token

```bash
POST /api/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
pytest

# Com relatório de cobertura
pytest --cov

# Relatório HTML de cobertura
pytest --cov --cov-report=html

# Testes específicos
pytest apps/users/tests/
pytest apps/appointments/tests/test_api.py

# Testes por marcador
pytest -m unit  # apenas testes unitários
pytest -m integration  # apenas testes de integração
```

### Estrutura de Testes

- `conftest.py` - Fixtures compartilhadas
- `apps/*/tests/` - Testes por aplicação
- `test_models.py` - Testes de modelos
- `test_api.py` - Testes de API
- `test_serializers.py` - Testes de serializers

### Cobertura Mínima

- **Objetivo:** 70%+
- Configurado em `pytest.ini`
- Build falha se cobertura < 70%

## 💾 Cache

O sistema usa **Redis** para cache.

### Configuração

```python
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://localhost:6379/1',
        'TIMEOUT': 300,  # 5 minutos
    }
}
```

### Uso

```python
from django.core.cache import cache

# Definir cache
cache.set('key', 'value', timeout=300)

# Obter cache
value = cache.get('key')

# Cache com decorator
from django.views.decorators.cache import cache_page

@cache_page(60 * 5)  # 5 minutos
def my_view(request):
    ...
```

## 📝 Logging

### Configuração

Logs estruturados em JSON para produção:

- **Console:** Todos os logs INFO+
- **File (django.log):** WARNING+ (rotativo, 15MB, 10 backups)
- **File (errors.log):** ERROR+ (rotativo, 15MB, 10 backups)

### Níveis de Log

- **DEBUG:** Informações detalhadas de debugging
- **INFO:** Eventos gerais informativos
- **WARNING:** Situações inesperadas mas não críticas
- **ERROR:** Erros que causaram falha em funcionalidade
- **CRITICAL:** Erros críticos do sistema

### Uso

```python
import logging

logger = logging.getLogger('apps.appointments')

logger.info('Appointment created', extra={'appointment_id': appointment.id})
logger.warning('Slot almost full')
logger.error('Failed to send notification', exc_info=True)
```

## 🔒 Segurança

### Implementações

✅ **JWT Authentication** - Tokens com rotação e blacklist
✅ **Rate Limiting** - Throttling por usuário e IP
✅ **CORS** - Configuração restritiva de origens
✅ **HTTPS/SSL** - Redirect forçado em produção
✅ **HSTS** - HTTP Strict Transport Security
✅ **Secure Cookies** - HttpOnly, Secure, SameSite
✅ **Security Headers** - XSS, Content-Type, Frame protection
✅ **Password Validation** - Regras fortes de senha
✅ **SQL Injection** - Proteção via ORM Django
✅ **CSRF Protection** - Tokens CSRF em forms

### Rate Limiting

```python
# Configuração padrão
THROTTLE_RATES = {
    'anon': '100/hour',      # Usuários anônimos
    'user': '1000/hour',     # Usuários autenticados
    'login': '5/minute',     # Tentativas de login
}
```

### Boas Práticas

- ❌ Nunca commitar `.env` ou `SECRET_KEY`
- ✅ Usar variáveis de ambiente para secrets
- ✅ `DEBUG=False` em produção
- ✅ Manter dependências atualizadas
- ✅ Logs de auditoria para ações sensíveis

## 🚀 Deploy

### Com Docker (Recomendado)

```bash
# Build da imagem
docker build -t barber-backend .

# Run container
docker run -p 8000:8000 --env-file .env barber-backend
```

### Produção com Gunicorn

```bash
# Instalar gunicorn
pip install gunicorn

# Executar
gunicorn barber_project.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 4 \
    --threads 2 \
    --timeout 60
```

### Celery Worker & Beat

```bash
# Worker (tarefas assíncronas)
celery -A barber_project worker --loglevel=info

# Beat (tarefas agendadas)
celery -A barber_project beat --loglevel=info
```

### Checklist Pré-Deploy

- [ ] `DEBUG=False`
- [ ] `SECRET_KEY` segura e única
- [ ] Configurar `ALLOWED_HOSTS`
- [ ] Configurar banco de dados de produção
- [ ] Configurar Redis de produção
- [ ] Executar migrações
- [ ] Coletar static files
- [ ] Configurar logs
- [ ] Configurar backups automáticos
- [ ] Configurar monitoring (Sentry, etc.)
- [ ] Testar health checks
- [ ] Configurar SSL/HTTPS

## 📚 Recursos Adicionais

- [Django Documentation](https://docs.djangoproject.com/)
- [DRF Documentation](https://www.django-rest-framework.org/)
- [Celery Documentation](https://docs.celeryproject.org/)
- [Redis Documentation](https://redis.io/documentation)
- [JWT Documentation](https://django-rest-framework-simplejwt.readthedocs.io/)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

## 👥 Autores

- **Barber System Team**

## 📞 Suporte

Para suporte, entre em contato através de: support@barbersystem.com
