"""
Service models for the barber shop.
"""
from django.db import models
from core.models import TimeStampedModel


class Service(TimeStampedModel):
    """
    Services offered by the barber shop.
    Examples: Corte, Barba, Corte + Barba, etc.
    """

    name = models.CharField(max_length=100, verbose_name='Nome do Serviço')
    description = models.TextField(blank=True, verbose_name='Descrição')
    duration = models.IntegerField(help_text='Duração em minutos', verbose_name='Duração (min)')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Preço')
    image = models.ImageField(upload_to='services/', blank=True, null=True, verbose_name='Imagem')

    is_active = models.BooleanField(default=True, verbose_name='Ativo')

    class Meta:
        verbose_name = 'Serviço'
        verbose_name_plural = 'Serviços'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - R$ {self.price} ({self.duration}min)"
