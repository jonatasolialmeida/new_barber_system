"""
Script para testar o envio de emails.
Execute: python manage.py shell < test_email.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'barber_project.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

print("=" * 50)
print("TESTANDO CONFIGURAÇÃO DE EMAIL")
print("=" * 50)
print(f"EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
print(f"EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
print(f"EMAIL_HOST_PASSWORD: {'*' * len(settings.EMAIL_HOST_PASSWORD) if settings.EMAIL_HOST_PASSWORD else 'NÃO CONFIGURADO'}")
print(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
print("=" * 50)

print("\nEnviando email de teste...")

try:
    result = send_mail(
        subject='Teste de Email - Sistema Barbearia',
        message='Este é um email de teste. Se você recebeu, o sistema está funcionando corretamente!',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.EMAIL_HOST_USER],  # Envia para o próprio email
        fail_silently=False,
    )

    if result == 1:
        print("✅ EMAIL ENVIADO COM SUCESSO!")
        print(f"✅ Verifique a caixa de entrada de: {settings.EMAIL_HOST_USER}")
        print("⚠️  Não esqueça de verificar a pasta SPAM também!")
    else:
        print("❌ FALHA ao enviar email")

except Exception as e:
    print(f"❌ ERRO ao enviar email: {e}")
    import traceback
    traceback.print_exc()

print("=" * 50)
