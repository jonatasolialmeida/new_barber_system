from rest_framework import serializers
from .models import Appointment
from apps.users.serializers import UserSerializer, BarberSerializer
from apps.services.serializers import ServiceSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for Appointment model."""

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

    def validate(self, data):
        """Validate appointment data."""
        if data.get('start_time') and data.get('end_time'):
            if data['start_time'] >= data['end_time']:
                raise serializers.ValidationError(
                    "End time must be after start time."
                )
        return data


class AppointmentDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer with nested objects."""

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


class AppointmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating appointments."""

    class Meta:
        model = Appointment
        fields = [
            'barber', 'service', 'date', 'start_time', 'notes'
        ]

    def validate(self, data):
        """Validate appointment data."""
        from datetime import datetime, timedelta

        # Calculate end_time based on service duration for validation
        service = data['service']
        start_time = data['start_time']
        start_datetime = datetime.combine(datetime.today(), start_time)
        end_datetime = start_datetime + timedelta(minutes=service.duration)
        end_time = end_datetime.time()

        # Check for overlapping appointments
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
                    f"{appointment.start_time.strftime('%H:%M')} às {appointment.end_time.strftime('%H:%M')}."
                )

        return data
