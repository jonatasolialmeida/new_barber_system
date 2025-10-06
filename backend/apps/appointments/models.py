"""
Appointment models for the barber shop system.
"""
from django.db import models
from django.core.exceptions import ValidationError
from core.models import TimeStampedModel
from apps.users.models import User
from apps.services.models import Service


class Appointment(TimeStampedModel):
    """
    Appointment model representing a scheduled service.
    """

    STATUS_CHOICES = [
        ('SCHEDULED', 'Agendado'),
        ('CONFIRMED', 'Confirmado'),
        ('IN_PROGRESS', 'Em Andamento'),
        ('COMPLETED', 'Concluído'),
        ('CANCELLED', 'Cancelado'),
        ('NO_SHOW', 'Não Compareceu'),
    ]

    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='appointments_as_client',
        verbose_name='Cliente'
    )

    barber = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='appointments_as_barber',
        verbose_name='Barbeiro'
    )

    service = models.ForeignKey(
        Service,
        on_delete=models.PROTECT,
        related_name='appointments',
        verbose_name='Serviço'
    )

    date = models.DateField(verbose_name='Data')
    start_time = models.TimeField(verbose_name='Horário de Início')
    end_time = models.TimeField(verbose_name='Horário de Término')

    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default='SCHEDULED',
        verbose_name='Status'
    )

    notes = models.TextField(blank=True, verbose_name='Observações')

    # Campos para cálculo de comissão/relatórios
    price_charged = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Valor Cobrado'
    )

    # Notificações enviadas (preparação futura)
    confirmation_sent = models.BooleanField(default=False, verbose_name='Confirmação Enviada')
    reminder_sent = models.BooleanField(default=False, verbose_name='Lembrete Enviado')

    class Meta:
        verbose_name = 'Agendamento'
        verbose_name_plural = 'Agendamentos'
        ordering = ['-date', '-start_time']

    def __str__(self):
        return f"{self.client.get_full_name()} - {self.service.name} - {self.date} {self.start_time}"

    def clean(self):
        """Validate appointment data."""
        super().clean()

        # Validate that end_time is after start_time
        if self.start_time >= self.end_time:
            raise ValidationError('End time must be after start time.')

        # Check for overlapping appointments for the barber
        overlapping = Appointment.objects.filter(
            barber=self.barber,
            date=self.date,
            status__in=['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']
        ).exclude(pk=self.pk)

        for appointment in overlapping:
            if (self.start_time < appointment.end_time and
                self.end_time > appointment.start_time):
                raise ValidationError(
                    f'Barber already has an appointment from '
                    f'{appointment.start_time} to {appointment.end_time}.'
                )

    def save(self, *args, **kwargs):
        """Override save to set price_charged from service if not set."""
        if not self.price_charged:
            self.price_charged = self.service.price
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def duration_minutes(self):
        """Calculate duration in minutes."""
        from datetime import datetime
        start = datetime.combine(self.date, self.start_time)
        end = datetime.combine(self.date, self.end_time)
        return int((end - start).total_seconds() / 60)
