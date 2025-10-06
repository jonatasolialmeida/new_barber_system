# Documentação Completa - Backend

## 1. Visão Geral

O backend do Sistema de Agendamento para Barbearia é uma API RESTful construída com Django 5.2 e Django REST Framework 3.15+. Utiliza PostgreSQL 16 como banco de dados, Redis para cache/broker, e Celery para processamento assíncrono de tarefas. A arquitetura é modular, seguindo o padrão MTV (Model-Template-View) do Django com foco em APIs.

## 2. Tecnologias e Dependências

### 2.1 Framework Core

**Django 5.2**
- Framework web full-stack Python
- ORM poderoso para banco de dados
- Sistema de autenticação robusto
- Admin panel integrado
- Middleware para segurança
- Sistema de migrations

**Django REST Framework 3.15+**
- Serializers para validação e transformação de dados
- ViewSets para endpoints CRUD
- Autenticação e permissões
- Browsable API
- Paginação automática
- Content negotiation

### 2.2 Autenticação e Segurança

**djangorestframework-simplejwt 5.3.1**
- JSON Web Tokens (JWT)
- Access e Refresh tokens
- Token rotation
- Blacklist de tokens

**django-cors-headers 4.3.1**
- Configuração de CORS
- Whitelist de origins
- Suporte a credenciais

### 2.3 Banco de Dados

**psycopg2-binary 2.9.9**
- Adaptador PostgreSQL para Python
- Suporte completo ao PostgreSQL
- Performance otimizada

**PostgreSQL 16**
- Banco de dados relacional
- ACID compliant
- JSON/JSONB support
- Full-text search

### 2.4 Processamento Assíncrono

**Celery 5.3.4**
- Processamento de tarefas em background
- Scheduled tasks
- Retry automático
- Monitoramento

**Redis 5.0.1**
- Message broker para Celery
- Cache de dados
- Pub/Sub

**django-celery-beat 2.5.0**
- Periodic tasks
- Cron-like scheduling
- Admin integration

### 2.5 Servidor de Produção

**Gunicorn 21.2.0**
- WSGI HTTP Server
- Multi-worker
- Pre-fork worker model
- Graceful restarts

### 2.6 Utilitários

**python-decouple 3.8**
- Gerenciamento de variáveis de ambiente
- Separação de configurações
- Type casting

**python-dateutil 2.8.2**
- Manipulação avançada de datas
- Parser de datas flexível

**pytz 2024.1**
- Timezone support
- Conversão de fusos horários

**Pillow 10.0.0**
- Processamento de imagens
- Upload e resize
- Múltiplos formatos

**django-extensions 3.2.3**
- Shell plus
- Comandos adicionais
- Ferramentas de desenvolvimento

## 3. Estrutura de Diretórios

```
backend/
├── barber_project/                 # Projeto Django principal
│   ├── __init__.py
│   ├── settings.py                 # Configurações do Django
│   ├── urls.py                     # URLs principais
│   ├── wsgi.py                     # WSGI application (produção)
│   ├── asgi.py                     # ASGI application (async)
│   └── celery.py                   # Configuração Celery
│
├── core/                           # App core (modelos base)
│   ├── __init__.py
│   ├── apps.py
│   └── models.py                   # TimeStampedModel
│
├── apps/                           # Aplicações do projeto
│   ├── users/                      # Gerenciamento de usuários
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py               # User, BarberScheduleBlock
│   │   ├── serializers.py          # Serializers de usuário
│   │   ├── views.py                # ViewSets de usuário
│   │   ├── urls.py                 # URLs de usuário
│   │   ├── admin.py                # Admin customizado
│   │   └── migrations/             # Migrações do banco
│   │
│   ├── services/                   # Serviços da barbearia
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py               # Service
│   │   ├── serializers.py          # Serializers de serviço
│   │   ├── views.py                # ViewSets de serviço
│   │   ├── urls.py                 # URLs de serviço
│   │   ├── admin.py                # Admin customizado
│   │   └── migrations/             # Migrações do banco
│   │
│   ├── appointments/               # Sistema de agendamentos
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py               # Appointment
│   │   ├── serializers.py          # Serializers de agendamento
│   │   ├── views.py                # ViewSets de agendamento
│   │   ├── notifications.py        # Sistema de notificações
│   │   ├── urls.py                 # URLs de agendamento
│   │   ├── admin.py                # Admin customizado
│   │   └── migrations/             # Migrações do banco
│   │
│   └── reports/                    # Relatórios e dashboards
│       ├── __init__.py
│       ├── apps.py
│       ├── views.py                # APIViews de relatórios
│       └── urls.py                 # URLs de relatórios
│
├── staticfiles/                    # Arquivos estáticos coletados
│   ├── admin/                      # Admin do Django
│   └── ...
│
├── mediafiles/                     # Arquivos de mídia (uploads)
│   └── services/                   # Imagens de serviços
│
├── manage.py                       # CLI do Django
├── requirements.txt                # Dependências Python
├── Dockerfile                      # Imagem Docker
├── entrypoint.sh                   # Script de entrada
├── test_email.py                   # Script de teste de email
└── test_cancel_email.py            # Script de teste de cancelamento
```

## 4. Configurações (settings.py)

### 4.1 Configurações Principais

```python
# SECRET_KEY
SECRET_KEY = config('SECRET_KEY', default='django-insecure-change-this')

# DEBUG
DEBUG = config('DEBUG', default=True, cast=bool)

# ALLOWED_HOSTS
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

# LANGUAGE & TIMEZONE
LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True
```

### 4.2 Aplicações Instaladas

```python
INSTALLED_APPS = [
    # Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_extensions',

    # Local apps
    'core',
    'apps.users',
    'apps.services',
    'apps.appointments',
    'apps.reports',
]
```

### 4.3 Middleware

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # CORS
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

### 4.4 Banco de Dados

```python
DATABASES = {
    'default': {
        'ENGINE': config('DB_ENGINE', default='django.db.backends.postgresql'),
        'NAME': config('DB_NAME', default='barber_db'),
        'USER': config('DB_USER', default='barber_user'),
        'PASSWORD': config('DB_PASSWORD', default='barber_password'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}
```

### 4.5 Modelo de Usuário Customizado

```python
AUTH_USER_MODEL = 'users.User'
```

### 4.6 Django REST Framework

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
}
```

### 4.7 JWT Settings

```python
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=config('JWT_ACCESS_TOKEN_LIFETIME', default=60, cast=int)),
    'REFRESH_TOKEN_LIFETIME': timedelta(minutes=config('JWT_REFRESH_TOKEN_LIFETIME', default=1440, cast=int)),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}
```

### 4.8 CORS Settings

```python
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000,http://127.0.0.1:3000'
).split(',')

CORS_ALLOW_CREDENTIALS = True
```

### 4.9 Celery Configuration

```python
CELERY_BROKER_URL = config('CELERY_BROKER_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = config('CELERY_RESULT_BACKEND', default='redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE
```

### 4.10 Email Configuration

```python
EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@barbershop.com')
ADMIN_EMAIL = config('ADMIN_EMAIL', default='admin@barbershop.com')
```

### 4.11 Static e Media Files

```python
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'mediafiles'
```

## 5. Modelos (Models)

### 5.1 Core - TimeStampedModel

**Arquivo:** `core/models.py`

```python
class TimeStampedModel(models.Model):
    """
    Abstract base model com campos de timestamp.
    Todos os modelos herdam deste.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']
```

**Uso:**
- Herdar em todos os modelos
- Tracking automático de criação e atualização
- Ordering padrão por data de criação

### 5.2 Users - User Model

**Arquivo:** `apps/users/models.py`

**Campos:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| email | EmailField | E-mail (único, usado como username) |
| first_name | CharField(150) | Nome |
| last_name | CharField(150) | Sobrenome |
| phone | CharField(20) | Telefone (opcional) |
| birth_date | DateField | Data de nascimento (opcional) |
| role | CharField(10) | Tipo: CLIENT, BARBER, OWNER |
| is_active | BooleanField | Usuário ativo |
| is_staff | BooleanField | Acesso ao admin |
| receive_email_notifications | BooleanField | Receber e-mails |
| receive_sms_notifications | BooleanField | Receber SMS (futuro) |
| receive_whatsapp_notifications | BooleanField | Receber WhatsApp (futuro) |

**Métodos:**

```python
def get_full_name(self):
    """Retorna nome completo."""
    return f"{self.first_name} {self.last_name}".strip()

def get_short_name(self):
    """Retorna primeiro nome."""
    return self.first_name

@property
def is_client(self):
    """Verifica se é cliente."""
    return self.role == 'CLIENT'

@property
def is_barber(self):
    """Verifica se é barbeiro."""
    return self.role == 'BARBER'

@property
def is_owner(self):
    """Verifica se é proprietário."""
    return self.role == 'OWNER'
```

**Manager Customizado:**

```python
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Cria usuário regular."""
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Cria superusuário com role OWNER."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'OWNER')
        return self.create_user(email, password, **extra_fields)
```

### 5.3 Users - BarberScheduleBlock Model

**Arquivo:** `apps/users/models.py`

**Campos:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| barber | ForeignKey(User) | Barbeiro (role=BARBER) |
| date | DateField | Data do bloqueio |
| start_time | TimeField | Hora inicial (se não all_day) |
| end_time | TimeField | Hora final (se não all_day) |
| all_day | BooleanField | Bloquear dia inteiro |
| reason | CharField(255) | Motivo (opcional) |

**Validações:**
- Se `all_day=False`, `start_time` e `end_time` são obrigatórios
- `end_time` deve ser maior que `start_time`

### 5.4 Services - Service Model

**Arquivo:** `apps/services/models.py`

**Campos:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| name | CharField(100) | Nome do serviço |
| description | TextField | Descrição detalhada |
| duration | IntegerField | Duração em minutos |
| price | DecimalField(10,2) | Preço |
| image | ImageField | Imagem do serviço (opcional) |
| is_active | BooleanField | Serviço ativo |

**Meta:**
```python
class Meta:
    verbose_name = 'Serviço'
    verbose_name_plural = 'Serviços'
    ordering = ['name']
```

**__str__:**
```python
def __str__(self):
    return f"{self.name} - R$ {self.price} ({self.duration}min)"
```

### 5.5 Appointments - Appointment Model

**Arquivo:** `apps/appointments/models.py`

**Campos:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| client | ForeignKey(User) | Cliente |
| barber | ForeignKey(User) | Barbeiro |
| service | ForeignKey(Service) | Serviço |
| date | DateField | Data do agendamento |
| start_time | TimeField | Horário de início |
| end_time | TimeField | Horário de término |
| status | CharField(15) | Status do agendamento |
| notes | TextField | Observações (opcional) |
| price_charged | DecimalField(10,2) | Valor cobrado |
| confirmation_sent | BooleanField | Confirmação enviada |
| reminder_sent | BooleanField | Lembrete enviado |

**Status Choices:**

```python
STATUS_CHOICES = [
    ('SCHEDULED', 'Agendado'),
    ('CONFIRMED', 'Confirmado'),
    ('IN_PROGRESS', 'Em Andamento'),
    ('COMPLETED', 'Concluído'),
    ('CANCELLED', 'Cancelado'),
    ('NO_SHOW', 'Não Compareceu'),
]
```

**Métodos:**

```python
def clean(self):
    """Validações customizadas."""
    # Valida end_time > start_time
    if self.start_time >= self.end_time:
        raise ValidationError('End time must be after start time.')

    # Verifica conflitos com outros agendamentos
    overlapping = Appointment.objects.filter(
        barber=self.barber,
        date=self.date,
        status__in=['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']
    ).exclude(pk=self.pk)

    for appointment in overlapping:
        if (self.start_time < appointment.end_time and
            self.end_time > appointment.start_time):
            raise ValidationError('Barber already has an appointment.')

def save(self, *args, **kwargs):
    """Override save para definir price_charged."""
    if not self.price_charged:
        self.price_charged = self.service.price
    self.full_clean()
    super().save(*args, **kwargs)

@property
def duration_minutes(self):
    """Calcula duração em minutos."""
    from datetime import datetime
    start = datetime.combine(self.date, self.start_time)
    end = datetime.combine(self.date, self.end_time)
    return int((end - start).total_seconds() / 60)
```

## 6. Serializers

### 6.1 Princípios dos Serializers

- Validação de dados de entrada
- Transformação de modelos em JSON
- Relacionamentos aninhados
- Campos read-only e write-only
- Validações customizadas

### 6.2 Users Serializers

**UserSerializer:**
```python
class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'birth_date', 'role', 'is_active',
            'receive_email_notifications', 'receive_sms_notifications',
            'receive_whatsapp_notifications', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
```

**UserCreateSerializer:**
```python
class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            'email', 'password', 'first_name', 'last_name',
            'phone', 'birth_date', 'role'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
```

**BarberSerializer:**
```python
class BarberSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'full_name', 'first_name', 'last_name', 'email', 'phone']
```

**BarberScheduleBlockSerializer:**
```python
class BarberScheduleBlockSerializer(serializers.ModelSerializer):
    barber_name = serializers.CharField(source='barber.get_full_name', read_only=True)

    class Meta:
        model = BarberScheduleBlock
        fields = [
            'id', 'barber', 'barber_name', 'date',
            'start_time', 'end_time', 'all_day', 'reason', 'created_at'
        ]
        read_only_fields = ['id', 'barber', 'created_at']

    def validate(self, data):
        """Valida horários se não for all_day."""
        if not data.get('all_day', False):
            if not data.get('start_time') or not data.get('end_time'):
                raise serializers.ValidationError(
                    "Start time and end time are required when not blocking all day."
                )
            if data['start_time'] >= data['end_time']:
                raise serializers.ValidationError(
                    "End time must be after start time."
                )
        return data
```

### 6.3 Services Serializers

**ServiceSerializer:**
```python
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id', 'name', 'description', 'duration',
            'price', 'image', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
```

### 6.4 Appointments Serializers

**AppointmentSerializer:**
```python
class AppointmentSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    barber_name = serializers.CharField(source='barber.get_full_name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    duration_minutes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'client', 'client_name', 'barber', 'barber_name',
            'service', 'service_name', 'date', 'start_time', 'end_time',
            'duration_minutes', 'status', 'notes', 'price_charged',
            'confirmation_sent', 'reminder_sent', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
```

**AppointmentDetailSerializer:**
```python
class AppointmentDetailSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    barber = BarberSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)
    duration_minutes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'client', 'barber', 'service', 'date', 'start_time',
            'end_time', 'duration_minutes', 'status', 'notes',
            'price_charged', 'confirmation_sent', 'reminder_sent',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
```

**AppointmentCreateSerializer:**
```python
class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['barber', 'service', 'date', 'start_time', 'notes']

    def validate(self, data):
        """Valida disponibilidade do barbeiro."""
        service = data['service']
        start_time = data['start_time']

        # Calcula end_time
        start_datetime = datetime.combine(datetime.today(), start_time)
        end_datetime = start_datetime + timedelta(minutes=service.duration)
        end_time = end_datetime.time()

        # Verifica conflitos
        overlapping = Appointment.objects.filter(
            barber=data['barber'],
            date=data['date'],
            status__in=['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']
        )

        for appointment in overlapping:
            if (start_time < appointment.end_time and
                end_time > appointment.start_time):
                raise serializers.ValidationError(
                    f"Barbeiro já possui agendamento das "
                    f"{appointment.start_time.strftime('%H:%M')} às "
                    f"{appointment.end_time.strftime('%H:%M')}."
                )

        return data
```

## 7. Views e ViewSets

### 7.1 Users - UserViewSet

**Arquivo:** `apps/users/views.py`

```python
class UserViewSet(viewsets.ModelViewSet):
    """ViewSet para CRUD de usuários."""
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

    def get_permissions(self):
        """Permite criação sem autenticação (registro de clientes)."""
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        """Restringe criação de barbeiros e owners."""
        role = serializer.validated_data.get('role', 'CLIENT')

        if role in ['BARBER', 'OWNER']:
            if not self.request.user.is_authenticated:
                raise PermissionDenied("Você precisa estar autenticado.")
            if not self.request.user.is_owner:
                raise PermissionDenied("Apenas proprietários podem cadastrar barbeiros.")

        serializer.save()

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Retorna perfil do usuário autenticado."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def barbers(self, request):
        """Lista todos barbeiros ativos."""
        barbers = User.objects.filter(role='BARBER', is_active=True)
        serializer = BarberSerializer(barbers, many=True)
        return Response(serializer.data)
```

**Endpoints Gerados:**
- `GET /api/users/` - Listar usuários
- `POST /api/users/` - Criar usuário
- `GET /api/users/{id}/` - Detalhes
- `PUT /api/users/{id}/` - Atualizar
- `PATCH /api/users/{id}/` - Atualizar parcialmente
- `DELETE /api/users/{id}/` - Deletar
- `GET /api/users/me/` - Perfil atual
- `GET /api/users/barbers/` - Listar barbeiros

### 7.2 Users - BarberScheduleBlockViewSet

```python
class BarberScheduleBlockViewSet(viewsets.ModelViewSet):
    """ViewSet para bloqueios de agenda."""
    queryset = BarberScheduleBlock.objects.all()
    serializer_class = BarberScheduleBlockSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filtra bloqueios por role."""
        user = self.request.user

        if user.is_owner:
            return BarberScheduleBlock.objects.all()

        if user.is_barber:
            return BarberScheduleBlock.objects.filter(barber=user)

        # Clientes veem todos (para saber indisponibilidade)
        return BarberScheduleBlock.objects.all()

    def perform_create(self, serializer):
        """Seta barbeiro como usuário atual."""
        serializer.save(barber=self.request.user)
```

### 7.3 Services - ServiceViewSet

**Arquivo:** `apps/services/views.py`

```python
class ServiceViewSet(viewsets.ModelViewSet):
    """ViewSet para CRUD de serviços."""
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filtra por is_active se fornecido."""
        queryset = Service.objects.all()
        is_active = self.request.query_params.get('is_active')

        if is_active is not None:
            is_active_bool = is_active.lower() == 'true'
            queryset = queryset.filter(is_active=is_active_bool)

        return queryset
```

### 7.4 Appointments - AppointmentViewSet

**Arquivo:** `apps/appointments/views.py`

```python
class AppointmentViewSet(viewsets.ModelViewSet):
    """ViewSet para CRUD de agendamentos."""
    queryset = Appointment.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return AppointmentCreateSerializer
        if self.action == 'retrieve':
            return AppointmentDetailSerializer
        return AppointmentSerializer

    def perform_create(self, serializer):
        """Cria agendamento com validações."""
        service = serializer.validated_data['service']
        barber = serializer.validated_data['barber']
        date = serializer.validated_data['date']
        start_time = serializer.validated_data['start_time']

        # Calcula end_time
        start_datetime = datetime.combine(datetime.today(), start_time)
        end_datetime = start_datetime + timedelta(minutes=service.duration)
        end_time = end_datetime.time()

        # Verifica bloqueios
        blocks = BarberScheduleBlock.objects.filter(barber=barber, date=date)

        for block in blocks:
            if block.all_day:
                raise ValidationError(
                    f"O barbeiro {barber.get_full_name()} não está disponível neste dia."
                )

            if block.start_time and block.end_time:
                if start_time < block.end_time and end_time > block.start_time:
                    raise ValidationError(
                        f"Horário indisponível. O barbeiro está bloqueado das "
                        f"{block.start_time.strftime('%H:%M')} às {block.end_time.strftime('%H:%M')}."
                    )

        # Salva agendamento
        appointment = serializer.save(
            client=self.request.user,
            end_time=end_time,
            price_charged=service.price
        )

        # Envia notificações
        try:
            send_appointment_confirmation_to_client(appointment)
            send_appointment_notification_to_barber(appointment)
        except Exception as e:
            print(f"Warning: Failed to send notifications: {e}")

    def get_queryset(self):
        """Filtra agendamentos por role."""
        user = self.request.user

        if user.is_owner:
            queryset = Appointment.objects.all()
        elif user.is_barber:
            queryset = Appointment.objects.filter(barber=user)
        else:
            queryset = Appointment.objects.filter(client=user)

        # Filtros por query params
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        return queryset

    @action(detail=False, methods=['get'])
    def available_slots(self, request):
        """Retorna horários disponíveis."""
        barber_id = request.query_params.get('barber')
        date_str = request.query_params.get('date')
        service_id = request.query_params.get('service')

        if not all([barber_id, date_str, service_id]):
            return Response(
                {'error': 'barber, date, and service are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Carrega entidades
        barber = User.objects.get(id=barber_id)
        service = Service.objects.get(id=service_id)
        date = datetime.strptime(date_str, '%Y-%m-%d').date()

        # Verifica bloqueio all-day
        all_day_block = BarberScheduleBlock.objects.filter(
            barber=barber, date=date, all_day=True
        ).exists()

        if all_day_block:
            return Response({'available_slots': []})

        # Define horário de trabalho
        working_start = dt_time(9, 0)
        working_end = dt_time(18, 0)
        slot_duration = 30  # minutos

        # Gera todos slots possíveis
        all_slots = []
        current = datetime.combine(date, working_start)
        end = datetime.combine(date, working_end)

        while current < end:
            all_slots.append(current.time())
            current += timedelta(minutes=slot_duration)

        # Carrega bloqueios e agendamentos
        blocks = BarberScheduleBlock.objects.filter(
            barber=barber, date=date, all_day=False
        )

        appointments = Appointment.objects.filter(
            barber=barber,
            date=date,
            status__in=['SCHEDULED', 'CONFIRMED']
        )

        # Filtra slots disponíveis
        available_slots = []
        service_duration = service.duration

        for slot in all_slots:
            slot_start = datetime.combine(date, slot)
            slot_end = slot_start + timedelta(minutes=service_duration)

            # Verifica se ultrapassa horário de trabalho
            if slot_end.time() > working_end:
                continue

            is_available = True

            # Verifica bloqueios
            for block in blocks:
                if block.start_time and block.end_time:
                    if slot < block.end_time and slot_end.time() > block.start_time:
                        is_available = False
                        break

            if not is_available:
                continue

            # Verifica agendamentos
            for appointment in appointments:
                appt_start = datetime.combine(date, appointment.start_time)
                appt_end = datetime.combine(date, appointment.end_time)

                if slot_start < appt_end and slot_end > appt_start:
                    is_available = False
                    break

            if is_available:
                available_slots.append(slot.strftime('%H:%M'))

        return Response({'available_slots': available_slots})

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancela agendamento."""
        appointment = self.get_object()

        # Verifica permissão
        if not (request.user.is_owner or
                request.user == appointment.client or
                request.user == appointment.barber):
            return Response(
                {'error': 'You do not have permission'},
                status=status.HTTP_403_FORBIDDEN
            )

        if appointment.status in ['COMPLETED', 'CANCELLED']:
            return Response(
                {'error': f'Cannot cancel appointment with status {appointment.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment.status = 'CANCELLED'
        appointment.save()

        # Envia notificações de cancelamento
        try:
            send_appointment_cancellation_notification(appointment, request.user)
        except Exception as e:
            print(f"Error sending cancellation notifications: {e}")

        serializer = self.get_serializer(appointment)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirma agendamento."""
        appointment = self.get_object()

        if appointment.status != 'SCHEDULED':
            return Response(
                {'error': 'Only scheduled appointments can be confirmed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment.status = 'CONFIRMED'
        appointment.save()

        serializer = self.get_serializer(appointment)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Marca agendamento como concluído."""
        appointment = self.get_object()

        if not (request.user.is_owner or request.user == appointment.barber):
            return Response(
                {'error': 'Only the barber or owner can complete appointments'},
                status=status.HTTP_403_FORBIDDEN
            )

        appointment.status = 'COMPLETED'
        appointment.save()

        serializer = self.get_serializer(appointment)
        return Response(serializer.data)
```

### 7.5 Reports - Views

**Arquivo:** `apps/reports/views.py`

**BarberReportView:**
```python
class BarberReportView(APIView):
    """Relatórios individuais do barbeiro."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not (user.is_barber or user.is_owner):
            return Response({'error': 'Access denied'}, status=403)

        barber_id = request.query_params.get('barber_id',
                                             user.id if user.is_barber else None)
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        queryset = Appointment.objects.filter(barber_id=barber_id)

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        # Atendimentos concluídos
        completed = queryset.filter(status='COMPLETED')
        completed_count = completed.count()
        total_earnings = completed.aggregate(total=Sum('price_charged'))['total'] or 0

        # Agendamentos futuros
        future = queryset.filter(
            date__gte=datetime.now().date(),
            status__in=['SCHEDULED', 'CONFIRMED']
        )
        future_count = future.count()
        expected_earnings = future.aggregate(total=Sum('price_charged'))['total'] or 0

        # Cancelados
        cancelled_count = queryset.filter(status='CANCELLED').count()

        return Response({
            'barber_id': barber_id,
            'period': {'start_date': start_date, 'end_date': end_date},
            'completed_appointments': completed_count,
            'total_earnings': float(total_earnings),
            'future_appointments': future_count,
            'expected_earnings': float(expected_earnings),
            'cancelled_appointments': cancelled_count
        })
```

**OwnerReportView:**
```python
class OwnerReportView(APIView):
    """Relatórios globais para proprietário."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not user.is_owner:
            return Response({'error': 'Access denied'}, status=403)

        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        queryset = Appointment.objects.all()

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        # Total concluído
        completed = queryset.filter(status='COMPLETED')
        completed_count = completed.count()
        total_revenue = completed.aggregate(total=Sum('price_charged'))['total'] or 0

        # Futuro
        future = queryset.filter(
            date__gte=datetime.now().date(),
            status__in=['SCHEDULED', 'CONFIRMED']
        )
        future_count = future.count()
        expected_revenue = future.aggregate(total=Sum('price_charged'))['total'] or 0

        # Stats por barbeiro
        barbers_stats = []
        barbers = User.objects.filter(role='BARBER', is_active=True)

        for barber in barbers:
            barber_completed = completed.filter(barber=barber)
            barber_earnings = barber_completed.aggregate(total=Sum('price_charged'))['total'] or 0

            barbers_stats.append({
                'barber_id': barber.id,
                'barber_name': barber.get_full_name(),
                'completed_appointments': barber_completed.count(),
                'total_earnings': float(barber_earnings)
            })

        # Cancelados e no-show
        cancelled_count = queryset.filter(status='CANCELLED').count()
        no_show_count = queryset.filter(status='NO_SHOW').count()

        return Response({
            'period': {'start_date': start_date, 'end_date': end_date},
            'total_completed_appointments': completed_count,
            'total_revenue': float(total_revenue),
            'future_appointments': future_count,
            'expected_revenue': float(expected_revenue),
            'cancelled_appointments': cancelled_count,
            'no_show_appointments': no_show_count,
            'barbers_performance': barbers_stats
        })
```

**DashboardView:**
```python
class DashboardView(APIView):
    """Dashboard com resumo rápido."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = datetime.now().date()

        # Base queryset por role
        if user.is_owner:
            queryset = Appointment.objects.all()
        elif user.is_barber:
            queryset = Appointment.objects.filter(barber=user)
        else:
            queryset = Appointment.objects.filter(client=user)

        # Hoje
        today_appointments = queryset.filter(date=today).exclude(status='CANCELLED')

        # Semana
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)
        week_appointments = queryset.filter(
            date__gte=week_start,
            date__lte=week_end
        ).exclude(status='CANCELLED')

        # Mês
        month_start = today.replace(day=1)
        month_appointments = queryset.filter(
            date__gte=month_start,
            date__lte=today
        ).exclude(status='CANCELLED')

        return Response({
            'today': {
                'total': today_appointments.count(),
                'by_status': {
                    status[0]: today_appointments.filter(status=status[0]).count()
                    for status in Appointment.STATUS_CHOICES
                }
            },
            'this_week': {
                'total': week_appointments.count(),
                'completed': week_appointments.filter(status='COMPLETED').count()
            },
            'this_month': {
                'total': month_appointments.count(),
                'completed': month_appointments.filter(status='COMPLETED').count(),
                'revenue': float(
                    month_appointments.filter(status='COMPLETED')
                    .aggregate(total=Sum('price_charged'))['total'] or 0
                )
            }
        })
```

## 8. Sistema de Notificações

**Arquivo:** `apps/appointments/notifications.py`

### 8.1 Funções de Notificação

**send_appointment_confirmation_to_client():**
```python
def send_appointment_confirmation_to_client(appointment):
    """Envia confirmação de agendamento ao cliente."""
    if not appointment.client.receive_email_notifications:
        return False

    subject = f'Agendamento Confirmado - {appointment.service.name}'

    # HTML email com detalhes
    html_message = """ ... """

    try:
        send_mail(
            subject=subject,
            message=strip_tags(html_message),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[appointment.client.email],
            html_message=html_message,
            fail_silently=True,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
```

**send_appointment_notification_to_barber():**
```python
def send_appointment_notification_to_barber(appointment):
    """Envia notificação de novo agendamento ao barbeiro."""
    if not appointment.barber.receive_email_notifications:
        return False

    subject = f'Novo Agendamento - {appointment.service.name}'
    # HTML email
    # ... (similar ao cliente)
```

**send_appointment_cancellation_notification():**
```python
def send_appointment_cancellation_notification(appointment, cancelled_by):
    """Envia notificação de cancelamento a cliente e barbeiro."""
    results = {'client': False, 'barber': False}

    # Notifica cliente
    if appointment.client.receive_email_notifications:
        # ... enviar email de cancelamento

    # Notifica barbeiro
    if appointment.barber.receive_email_notifications:
        # ... enviar email de cancelamento

    return results
```

### 8.2 Integração com Celery (Futuro)

Para processar notificações de forma assíncrona:

```python
# tasks.py
from celery import shared_task

@shared_task
def send_appointment_confirmation_task(appointment_id):
    appointment = Appointment.objects.get(id=appointment_id)
    send_appointment_confirmation_to_client(appointment)
    send_appointment_notification_to_barber(appointment)

# No view:
send_appointment_confirmation_task.delay(appointment.id)
```

## 9. URLs e Roteamento

**Arquivo Principal:** `barber_project/urls.py`

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # API endpoints
    path('api/users/', include('apps.users.urls')),
    path('api/services/', include('apps.services.urls')),
    path('api/appointments/', include('apps.appointments.urls')),
    path('api/reports/', include('apps.reports.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
```

**Users URLs:**
```python
# apps/users/urls.py
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, BarberScheduleBlockViewSet

router = DefaultRouter()
router.register('', UserViewSet, basename='user')
router.register('schedule-blocks', BarberScheduleBlockViewSet, basename='schedule-block')

urlpatterns = router.urls
```

**Services URLs:**
```python
# apps/services/urls.py
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet

router = DefaultRouter()
router.register('', ServiceViewSet, basename='service')

urlpatterns = router.urls
```

**Appointments URLs:**
```python
# apps/appointments/urls.py
from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet

router = DefaultRouter()
router.register('', AppointmentViewSet, basename='appointment')

urlpatterns = router.urls
```

**Reports URLs:**
```python
# apps/reports/urls.py
from django.urls import path
from .views import BarberReportView, OwnerReportView, DashboardView

urlpatterns = [
    path('barber/', BarberReportView.as_view(), name='barber-report'),
    path('owner/', OwnerReportView.as_view(), name='owner-report'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]
```

## 10. Admin Customizado

### 10.1 Users Admin

```python
# apps/users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, BarberScheduleBlock

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'get_full_name', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'created_at']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-created_at']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone', 'birth_date')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser')}),
        ('Notifications', {'fields': ('receive_email_notifications',
                                       'receive_sms_notifications',
                                       'receive_whatsapp_notifications')}),
    )

@admin.register(BarberScheduleBlock)
class BarberScheduleBlockAdmin(admin.ModelAdmin):
    list_display = ['barber', 'date', 'start_time', 'end_time', 'all_day', 'reason']
    list_filter = ['barber', 'date', 'all_day']
    search_fields = ['barber__email', 'barber__first_name', 'reason']
```

### 10.2 Services Admin

```python
# apps/services/admin.py
from django.contrib import admin
from .models import Service

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'duration', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']
```

### 10.3 Appointments Admin

```python
# apps/appointments/admin.py
from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'client', 'barber', 'service', 'date', 'start_time', 'status']
    list_filter = ['status', 'date', 'barber', 'service']
    search_fields = ['client__email', 'barber__email', 'service__name']
    ordering = ['-date', '-start_time']

    readonly_fields = ['created_at', 'updated_at', 'duration_minutes']
```

## 11. Celery Configuration

**Arquivo:** `barber_project/celery.py`

```python
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'barber_project.settings')

app = Celery('barber_project')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
```

**Tarefas Programadas (Futuro):**

```python
from celery.schedules import crontab

app.conf.beat_schedule = {
    'send-reminders-every-day': {
        'task': 'apps.appointments.tasks.send_appointment_reminders',
        'schedule': crontab(hour=8, minute=0),  # Diariamente às 8h
    },
}
```

## 12. Comandos de Gerenciamento

### 12.1 Comandos Django Padrão

```bash
# Criar migrations
python manage.py makemigrations

# Aplicar migrations
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Coletar arquivos estáticos
python manage.py collectstatic

# Shell interativo
python manage.py shell

# Shell Plus (django-extensions)
python manage.py shell_plus

# Rodar servidor de desenvolvimento
python manage.py runserver

# Rodar testes
python manage.py test
```

### 12.2 Comandos Customizados (Futuro)

```python
# management/commands/send_test_email.py
from django.core.management.base import BaseCommand
from apps.appointments.notifications import send_test_email

class Command(BaseCommand):
    help = 'Envia email de teste'

    def handle(self, *args, **kwargs):
        send_test_email()
        self.stdout.write(self.style.SUCCESS('Email enviado!'))
```

## 13. Testes

### 13.1 Estrutura de Testes

```python
# apps/users/tests.py
from django.test import TestCase
from .models import User

class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )

    def test_user_creation(self):
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertTrue(self.user.is_client)

    def test_user_full_name(self):
        self.assertEqual(self.user.get_full_name(), 'Test User')
```

### 13.2 Testes de API

```python
from rest_framework.test import APITestCase
from rest_framework import status

class AppointmentAPITest(APITestCase):
    def setUp(self):
        # Criar usuários, serviços, etc.
        pass

    def test_create_appointment(self):
        data = {
            'barber': self.barber.id,
            'service': self.service.id,
            'date': '2025-10-15',
            'start_time': '10:00'
        }
        response = self.client.post('/api/appointments/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
```

## 14. Segurança

### 14.1 Práticas Implementadas

- Senhas hasheadas com PBKDF2
- CSRF protection habilitado
- XSS protection (Django template escaping)
- SQL Injection protection (ORM)
- CORS configurado com whitelist
- JWT com expiration
- Token rotation

### 14.2 Recomendações Adicionais

- Implementar rate limiting (django-ratelimit)
- Logs de auditoria
- 2FA (django-two-factor-auth)
- HTTPS em produção
- Validação rigorosa de inputs
- Sanitização de outputs

## 15. Performance

### 15.1 Otimizações Implementadas

- Paginação automática (DRF)
- Indexes em campos chave
- Select related / Prefetch related
- Caching com Redis (preparado)

### 15.2 Melhorias Futuras

- Query optimization (Django Debug Toolbar)
- Database connection pooling
- Celery para tarefas pesadas
- CDN para static/media
- Database read replicas

## 16. Deployment

### 16.1 Dockerfile

```dockerfile
FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
```

### 16.2 Entrypoint Script

```bash
#!/bin/bash

# Aguardar banco de dados
echo "Waiting for database..."
while ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; do
    sleep 1
done

# Migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Collect static
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Iniciar servidor
if [ "$DEBUG" = "True" ]; then
    echo "Starting development server..."
    python manage.py runserver 0.0.0.0:8000
else
    echo "Starting production server..."
    gunicorn barber_project.wsgi:application \
        --bind 0.0.0.0:8000 \
        --workers 4 \
        --timeout 120 \
        --access-logfile - \
        --error-logfile -
fi
```

## 17. Troubleshooting

### 17.1 Problemas Comuns

**Erro: relation does not exist**
```bash
python manage.py migrate
```

**Erro: ModuleNotFoundError**
```bash
pip install -r requirements.txt
```

**Erro: CORS**
- Verificar `CORS_ALLOWED_ORIGINS` em settings.py
- Verificar `corsheaders` em MIDDLEWARE

**Erro: JWT token invalid**
- Token expirado: renovar com refresh token
- Verificar `Authorization: Bearer {token}` header

## 18. Documentação da API

### 18.1 Browsable API

Django REST Framework fornece interface browsable em desenvolvimento:
- Acesse `http://localhost:8000/api/` no browser
- Navegue pelos endpoints
- Teste requisições diretamente

### 18.2 Swagger/OpenAPI (Futuro)

```python
# Instalar
pip install drf-yasg

# Configurar
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Barber Shop API",
        default_version='v1',
    ),
    public=True,
)

# URLs
path('swagger/', schema_view.with_ui('swagger')),
path('redoc/', schema_view.with_ui('redoc')),
```

## 19. Contatos e Suporte

Para dúvidas sobre o backend:
- Documentação Django: https://docs.djangoproject.com/
- Documentação DRF: https://www.django-rest-framework.org/
- Issues do projeto
- E-mail: suporte@barbearia.com

---

**Documento gerado em:** 2025-10-06
**Versão:** 1.0.0
**Framework:** Django 5.2 + DRF 3.15+
**Última atualização:** 2025-10-06
