"""
Notification service for sending emails to clients and barbers.
"""
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_appointment_confirmation_to_client(appointment):
    """Send appointment confirmation email to client."""
    if not appointment.client.receive_email_notifications:
        return False

    subject = f'Agendamento Confirmado - {appointment.service.name}'

    # Format date and time
    date_formatted = appointment.date.strftime('%d/%m/%Y')

    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
                    Agendamento Confirmado!
                </h2>

                <p>Olá <strong>{appointment.client.get_full_name()}</strong>,</p>

                <p>Seu agendamento foi confirmado com sucesso!</p>

                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #2c3e50;">Detalhes do Agendamento:</h3>
                    <p><strong>Serviço:</strong> {appointment.service.name}</p>
                    <p><strong>Barbeiro:</strong> {appointment.barber.get_full_name()}</p>
                    <p><strong>Data:</strong> {date_formatted}</p>
                    <p><strong>Horário:</strong> {appointment.start_time.strftime('%H:%M')} - {appointment.end_time.strftime('%H:%M')}</p>
                    <p><strong>Duração:</strong> {appointment.service.duration} minutos</p>
                    <p><strong>Valor:</strong> R$ {appointment.price_charged}</p>
                </div>

                <p style="color: #7f8c8d; font-size: 14px;">
                    <strong>Importante:</strong> Para cancelar este agendamento, faça login no sistema com pelo menos 2 horas de antecedência.
                </p>

                <p>Aguardamos você!</p>

                <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 30px 0;">

                <p style="font-size: 12px; color: #95a5a6; text-align: center;">
                    Este é um email automático, por favor não responda.
                </p>
            </div>
        </body>
    </html>
    """

    plain_message = strip_tags(html_message)

    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[appointment.client.email],
            html_message=html_message,
            fail_silently=True,  # Don't crash if email fails
        )
        print(f"✅ Email sent to client: {appointment.client.email}")
        return True
    except Exception as e:
        print(f"❌ Error sending email to client: {e}")
        import traceback
        traceback.print_exc()
        return False


def send_appointment_notification_to_barber(appointment):
    """Send new appointment notification email to barber."""
    if not appointment.barber.receive_email_notifications:
        return False

    subject = f'Novo Agendamento - {appointment.service.name}'

    # Format date and time
    date_formatted = appointment.date.strftime('%d/%m/%Y')

    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c3e50; border-bottom: 2px solid #27ae60; padding-bottom: 10px;">
                    Novo Agendamento Recebido!
                </h2>

                <p>Olá <strong>{appointment.barber.get_full_name()}</strong>,</p>

                <p>Você tem um novo agendamento!</p>

                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #2c3e50;">Detalhes do Agendamento:</h3>
                    <p><strong>Cliente:</strong> {appointment.client.get_full_name()}</p>
                    <p><strong>Serviço:</strong> {appointment.service.name}</p>
                    <p><strong>Data:</strong> {date_formatted}</p>
                    <p><strong>Horário:</strong> {appointment.start_time.strftime('%H:%M')} - {appointment.end_time.strftime('%H:%M')}</p>
                    <p><strong>Duração:</strong> {appointment.service.duration} minutos</p>
                    <p><strong>Valor:</strong> R$ {appointment.price_charged}</p>
                    {f'<p><strong>Observações:</strong> {appointment.notes}</p>' if appointment.notes else ''}
                </div>

                <p>Prepare-se para atender este cliente!</p>

                <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 30px 0;">

                <p style="font-size: 12px; color: #95a5a6; text-align: center;">
                    Este é um email automático, por favor não responda.
                </p>
            </div>
        </body>
    </html>
    """

    plain_message = strip_tags(html_message)

    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[appointment.barber.email],
            html_message=html_message,
            fail_silently=True,  # Don't crash if email fails
        )
        print(f"✅ Email sent to barber: {appointment.barber.email}")
        return True
    except Exception as e:
        print(f"❌ Error sending email to barber: {e}")
        import traceback
        traceback.print_exc()
        return False


def send_appointment_cancellation_notification(appointment, cancelled_by):
    """Send cancellation notification to both client and barber."""
    date_formatted = appointment.date.strftime('%d/%m/%Y')

    results = {
        'client': False,
        'barber': False
    }

    # Notify client
    if appointment.client.receive_email_notifications:
        subject = f'Agendamento Cancelado - {appointment.service.name}'

        html_message = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #e74c3c; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">
                        Agendamento Cancelado
                    </h2>

                    <p>Olá <strong>{appointment.client.get_full_name()}</strong>,</p>

                    <p>Seu agendamento foi cancelado.</p>

                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #2c3e50;">Detalhes do Agendamento Cancelado:</h3>
                        <p><strong>Serviço:</strong> {appointment.service.name}</p>
                        <p><strong>Barbeiro:</strong> {appointment.barber.get_full_name()}</p>
                        <p><strong>Data:</strong> {date_formatted}</p>
                        <p><strong>Horário:</strong> {appointment.start_time.strftime('%H:%M')}</p>
                        <p><strong>Cancelado por:</strong> {cancelled_by.get_full_name()}</p>
                    </div>

                    <p>Você pode fazer um novo agendamento quando desejar através do nosso sistema.</p>

                    <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 30px 0;">

                    <p style="font-size: 12px; color: #95a5a6; text-align: center;">
                        Este é um email automático, por favor não responda.
                    </p>
                </div>
            </body>
        </html>
        """

        plain_message = strip_tags(html_message)

        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[appointment.client.email],
                html_message=html_message,
                fail_silently=True,
            )
            print(f"✅ Cancellation email sent to client: {appointment.client.email}")
            results['client'] = True
        except Exception as e:
            print(f"❌ Error sending cancellation email to client: {e}")
            import traceback
            traceback.print_exc()

    # Notify barber
    if appointment.barber.receive_email_notifications:
        subject = f'Agendamento Cancelado - {appointment.service.name}'

        html_message = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #e74c3c; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">
                        Agendamento Cancelado
                    </h2>

                    <p>Olá <strong>{appointment.barber.get_full_name()}</strong>,</p>

                    <p>Um agendamento foi cancelado.</p>

                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #2c3e50;">Detalhes do Agendamento Cancelado:</h3>
                        <p><strong>Cliente:</strong> {appointment.client.get_full_name()}</p>
                        <p><strong>Serviço:</strong> {appointment.service.name}</p>
                        <p><strong>Data:</strong> {date_formatted}</p>
                        <p><strong>Horário:</strong> {appointment.start_time.strftime('%H:%M')}</p>
                        <p><strong>Cancelado por:</strong> {cancelled_by.get_full_name()}</p>
                    </div>

                    <p>Este horário está agora disponível na sua agenda.</p>

                    <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 30px 0;">

                    <p style="font-size: 12px; color: #95a5a6; text-align: center;">
                        Este é um email automático, por favor não responda.
                    </p>
                </div>
            </body>
        </html>
        """

        plain_message = strip_tags(html_message)

        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[appointment.barber.email],
                html_message=html_message,
                fail_silently=True,
            )
            print(f"✅ Cancellation email sent to barber: {appointment.barber.email}")
            results['barber'] = True
        except Exception as e:
            print(f"❌ Error sending cancellation email to barber: {e}")
            import traceback
            traceback.print_exc()

    return results
