"""
User models for the barber shop system.
Supports CLIENT, BARBER, and OWNER roles.
"""
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from core.models import TimeStampedModel


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication."""

    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user."""
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'OWNER')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    """
    Custom User model with role-based access control.

    Roles:
    - CLIENT: Can make appointments
    - BARBER: Can view their appointments and block schedule
    - OWNER: Can access all features and reports
    """

    ROLE_CHOICES = [
        ('CLIENT', 'Cliente'),
        ('BARBER', 'Barbeiro'),
        ('OWNER', 'Dono'),
    ]

    email = models.EmailField(unique=True, verbose_name='E-mail')
    first_name = models.CharField(max_length=150, verbose_name='Nome')
    last_name = models.CharField(max_length=150, verbose_name='Sobrenome')
    phone = models.CharField(max_length=20, blank=True, verbose_name='Telefone')
    birth_date = models.DateField(null=True, blank=True, verbose_name='Data de Nascimento')

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='CLIENT',
        verbose_name='Tipo de Usuário'
    )

    is_active = models.BooleanField(default=True, verbose_name='Ativo')
    is_staff = models.BooleanField(default=False, verbose_name='Staff')

    # Notificações (preparação futura)
    receive_email_notifications = models.BooleanField(default=True, verbose_name='Receber notificações por e-mail')
    receive_sms_notifications = models.BooleanField(default=False, verbose_name='Receber notificações por SMS')
    receive_whatsapp_notifications = models.BooleanField(default=False, verbose_name='Receber notificações por WhatsApp')

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"

    def get_full_name(self):
        """Return the user's full name."""
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        """Return the user's first name."""
        return self.first_name

    @property
    def is_client(self):
        """Check if user is a client."""
        return self.role == 'CLIENT'

    @property
    def is_barber(self):
        """Check if user is a barber."""
        return self.role == 'BARBER'

    @property
    def is_owner(self):
        """Check if user is the owner."""
        return self.role == 'OWNER'


class BarberScheduleBlock(TimeStampedModel):
    """
    Allows barbers to block specific days or time slots.
    """
    barber = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='schedule_blocks',
        limit_choices_to={'role': 'BARBER'},
        verbose_name='Barbeiro'
    )

    date = models.DateField(verbose_name='Data')
    start_time = models.TimeField(null=True, blank=True, verbose_name='Horário Inicial')
    end_time = models.TimeField(null=True, blank=True, verbose_name='Horário Final')

    all_day = models.BooleanField(default=False, verbose_name='Dia Inteiro')
    reason = models.CharField(max_length=255, blank=True, verbose_name='Motivo')

    class Meta:
        verbose_name = 'Bloqueio de Agenda'
        verbose_name_plural = 'Bloqueios de Agenda'
        ordering = ['-date', '-start_time']

    def __str__(self):
        if self.all_day:
            return f"{self.barber.get_full_name()} - {self.date} (Dia inteiro)"
        return f"{self.barber.get_full_name()} - {self.date} {self.start_time}-{self.end_time}"
