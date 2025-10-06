from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('client', 'barber', 'service', 'date', 'start_time', 'status', 'price_charged')
    list_filter = ('status', 'date', 'barber', 'service')
    search_fields = ('client__first_name', 'client__last_name', 'barber__first_name', 'barber__last_name')
    date_hierarchy = 'date'
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ('Informações do Agendamento', {
            'fields': ('client', 'barber', 'service', 'date', 'start_time', 'end_time', 'status')
        }),
        ('Valores', {
            'fields': ('price_charged',)
        }),
        ('Notificações', {
            'fields': ('confirmation_sent', 'reminder_sent'),
            'classes': ('collapse',)
        }),
        ('Observações', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
