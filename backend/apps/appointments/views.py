from datetime import datetime, timedelta
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Appointment
from .serializers import (
    AppointmentSerializer,
    AppointmentDetailSerializer,
    AppointmentCreateSerializer
)
from .notifications import (
    send_appointment_confirmation_to_client,
    send_appointment_notification_to_barber,
    send_appointment_cancellation_notification
)


class AppointmentViewSet(viewsets.ModelViewSet):
    """ViewSet for Appointment CRUD operations."""

    queryset = Appointment.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return AppointmentCreateSerializer
        if self.action == 'retrieve':
            return AppointmentDetailSerializer
        return AppointmentSerializer

    def perform_create(self, serializer):
        """Set client and calculate end_time automatically."""
        from apps.services.models import Service
        from apps.users.models import BarberScheduleBlock
        from rest_framework.exceptions import ValidationError

        # Set client as current user
        client = self.request.user

        # Get service to calculate end_time
        service = serializer.validated_data['service']
        barber = serializer.validated_data['barber']
        date = serializer.validated_data['date']
        start_time = serializer.validated_data['start_time']

        # Calculate end_time based on service duration
        start_datetime = datetime.combine(datetime.today(), start_time)
        end_datetime = start_datetime + timedelta(minutes=service.duration)
        end_time = end_datetime.time()

        # Check for schedule blocks
        blocks = BarberScheduleBlock.objects.filter(
            barber=barber,
            date=date
        )

        for block in blocks:
            # If all day block, reject
            if block.all_day:
                raise ValidationError(
                    f"O barbeiro {barber.get_full_name()} não está disponível neste dia."
                )

            # Check if appointment overlaps with block
            if block.start_time and block.end_time:
                # Appointment overlaps if: start < block_end AND end > block_start
                if start_time < block.end_time and end_time > block.start_time:
                    raise ValidationError(
                        f"Horário indisponível. O barbeiro está bloqueado das "
                        f"{block.start_time.strftime('%H:%M')} às {block.end_time.strftime('%H:%M')}."
                    )

        # Save with calculated values
        appointment = serializer.save(
            client=client,
            end_time=end_time,
            price_charged=service.price
        )

        # Send notifications (run in background to avoid blocking)
        try:
            send_appointment_confirmation_to_client(appointment)
            send_appointment_notification_to_barber(appointment)
        except Exception as e:
            # Don't fail the request if email fails
            print(f"Warning: Failed to send notifications: {e}")

    def get_queryset(self):
        """Filter appointments based on user role."""
        user = self.request.user

        # Owners can see all appointments
        if user.is_owner:
            queryset = Appointment.objects.all()

        # Barbers can see their own appointments
        elif user.is_barber:
            queryset = Appointment.objects.filter(barber=user)

        # Clients can see their own appointments
        else:
            queryset = Appointment.objects.filter(client=user)

        # Filter by status if provided
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        return queryset

    @action(detail=False, methods=['get'])
    def available_slots(self, request):
        """Get available time slots for a barber on a specific date."""
        from apps.users.models import User, BarberScheduleBlock
        from apps.services.models import Service
        from datetime import time as dt_time

        barber_id = request.query_params.get('barber')
        date_str = request.query_params.get('date')
        service_id = request.query_params.get('service')

        if not all([barber_id, date_str, service_id]):
            return Response(
                {'error': 'barber, date, and service are required parameters'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            barber = User.objects.get(id=barber_id)
            service = Service.objects.get(id=service_id)
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except (User.DoesNotExist, Service.DoesNotExist, ValueError) as e:
            return Response(
                {'error': 'Invalid barber, service, or date'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if barber has all-day block
        all_day_block = BarberScheduleBlock.objects.filter(
            barber=barber,
            date=date,
            all_day=True
        ).exists()

        if all_day_block:
            return Response({'available_slots': []})

        # Define working hours (9:00 - 18:00, with 30-minute slots)
        working_start = dt_time(9, 0)
        working_end = dt_time(18, 0)
        slot_duration = 30  # minutes

        # Generate all possible time slots
        all_slots = []
        current = datetime.combine(date, working_start)
        end = datetime.combine(date, working_end)

        while current < end:
            all_slots.append(current.time())
            current += timedelta(minutes=slot_duration)

        # Get schedule blocks for this barber on this date
        blocks = BarberScheduleBlock.objects.filter(
            barber=barber,
            date=date,
            all_day=False
        )

        # Get existing appointments for this barber on this date
        appointments = Appointment.objects.filter(
            barber=barber,
            date=date,
            status__in=['SCHEDULED', 'CONFIRMED']
        )

        # Filter out unavailable slots
        available_slots = []
        service_duration = service.duration

        for slot in all_slots:
            # Calculate appointment end time
            slot_start = datetime.combine(date, slot)
            slot_end = slot_start + timedelta(minutes=service_duration)

            # Check if slot would extend beyond working hours
            if slot_end.time() > working_end:
                continue

            is_available = True

            # Check against schedule blocks
            for block in blocks:
                if block.start_time and block.end_time:
                    if slot < block.end_time and slot_end.time() > block.start_time:
                        is_available = False
                        break

            if not is_available:
                continue

            # Check against existing appointments
            for appointment in appointments:
                appt_start = datetime.combine(date, appointment.start_time)
                appt_end = datetime.combine(date, appointment.end_time)

                # Check for overlap
                if slot_start < appt_end and slot_end > appt_start:
                    is_available = False
                    break

            if is_available:
                available_slots.append(slot.strftime('%H:%M'))

        return Response({'available_slots': available_slots})

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an appointment."""
        appointment = self.get_object()

        # Check permissions
        if not (request.user.is_owner or
                request.user == appointment.client or
                request.user == appointment.barber):
            return Response(
                {'error': 'You do not have permission to cancel this appointment'},
                status=status.HTTP_403_FORBIDDEN
            )

        if appointment.status in ['COMPLETED', 'CANCELLED']:
            return Response(
                {'error': f'Cannot cancel appointment with status {appointment.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment.status = 'CANCELLED'
        appointment.save()

        # Send cancellation notifications
        print(f"📧 Sending cancellation notifications for appointment #{appointment.id}")
        print(f"   Client: {appointment.client.email} (notifications: {appointment.client.receive_email_notifications})")
        print(f"   Barber: {appointment.barber.email} (notifications: {appointment.barber.receive_email_notifications})")

        try:
            results = send_appointment_cancellation_notification(appointment, request.user)
            print(f"   Results: Client={results['client']}, Barber={results['barber']}")
        except Exception as e:
            print(f"❌ Error sending cancellation notifications: {e}")
            import traceback
            traceback.print_exc()

        serializer = self.get_serializer(appointment)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm an appointment."""
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
        """Mark appointment as completed."""
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
