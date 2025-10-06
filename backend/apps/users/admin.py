from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, BarberScheduleBlock


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_active', 'created_at')
    list_filter = ('role', 'is_active', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name', 'phone')
    ordering = ('-created_at',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informações Pessoais', {'fields': ('first_name', 'last_name', 'phone', 'birth_date')}),
        ('Permissões', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Notificações', {'fields': ('receive_email_notifications', 'receive_sms_notifications', 'receive_whatsapp_notifications')}),
        ('Datas', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'role', 'password1', 'password2'),
        }),
    )

    readonly_fields = ('created_at', 'updated_at', 'last_login')


@admin.register(BarberScheduleBlock)
class BarberScheduleBlockAdmin(admin.ModelAdmin):
    list_display = ('barber', 'date', 'start_time', 'end_time', 'all_day', 'reason')
    list_filter = ('all_day', 'date')
    search_fields = ('barber__first_name', 'barber__last_name', 'reason')
    date_hierarchy = 'date'
