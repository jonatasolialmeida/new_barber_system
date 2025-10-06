"""
Script para testar notificação de cancelamento
Execute dentro do container: docker compose exec backend python manage.py shell < test_cancel_email.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'barber_project.settings')
django.setup()

from apps.appointments.models import Appointment
from apps.appointments.notifications import send_appointment_cancellation_notification

print("=" * 70)
print("TESTANDO NOTIFICAÇÃO DE CANCELAMENTO")
print("=" * 70)

# Pegar último agendamento
try:
    appointment = Appointment.objects.filter(status='SCHEDULED').first()

    if not appointment:
        appointment = Appointment.objects.first()

    if not appointment:
        print("❌ Nenhum agendamento encontrado no sistema!")
    else:
        print(f"\n📋 Agendamento selecionado:")
        print(f"   ID: {appointment.id}")
        print(f"   Cliente: {appointment.client.get_full_name()} ({appointment.client.email})")
        print(f"   Barbeiro: {appointment.barber.get_full_name()} ({appointment.barber.email})")
        print(f"   Serviço: {appointment.service.name}")
        print(f"   Data: {appointment.date}")
        print(f"   Status: {appointment.status}")

        print(f"\n🔔 Preferências de notificação:")
        print(f"   Cliente recebe emails: {appointment.client.receive_email_notifications}")
        print(f"   Barbeiro recebe emails: {appointment.barber.receive_email_notifications}")

        print(f"\n📧 Enviando notificações de cancelamento...")
        print("-" * 70)

        results = send_appointment_cancellation_notification(appointment, appointment.client)

        print("-" * 70)
        print(f"\n📊 Resultado:")
        print(f"   Email para cliente: {'✅ Enviado' if results['client'] else '❌ Não enviado'}")
        print(f"   Email para barbeiro: {'✅ Enviado' if results['barber'] else '❌ Não enviado'}")

except Exception as e:
    print(f"❌ ERRO: {e}")
    import traceback
    traceback.print_exc()

print("=" * 70)
