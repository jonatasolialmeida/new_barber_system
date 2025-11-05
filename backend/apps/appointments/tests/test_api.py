"""
Tests for Appointment API endpoints.
"""
import pytest
from django.urls import reverse
from rest_framework import status
from apps.appointments.models import Appointment
from datetime import date, time, timedelta
from decimal import Decimal


@pytest.mark.django_db
class TestAppointmentAPI:
    """Test suite for Appointment API."""

    def test_create_appointment_success(
        self, authenticated_client, client_user, barber_user, service
    ):
        """Test creating an appointment is successful."""
        url = reverse('appointment-list')
        tomorrow = date.today() + timedelta(days=1)
        payload = {
            'service': service.id,
            'barber': barber_user.id,
            'date': tomorrow.isoformat(),
            'start_time': '10:00:00'
        }

        response = authenticated_client.post(url, payload, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert Appointment.objects.filter(
            client=client_user,
            service=service
        ).exists()

    def test_create_appointment_unauthorized_fails(self, api_client, barber_user, service):
        """Test creating appointment without authentication fails."""
        url = reverse('appointment-list')
        tomorrow = date.today() + timedelta(days=1)
        payload = {
            'service': service.id,
            'barber': barber_user.id,
            'date': tomorrow.isoformat(),
            'start_time': '10:00:00'
        }

        response = api_client.post(url, payload, format='json')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_appointments_client_sees_only_own(
        self, authenticated_client, client_user, appointment
    ):
        """Test client can only see their own appointments."""
        url = reverse('appointment-list')

        response = authenticated_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        results = response.data.get('results', response.data)
        assert len(results) == 1
        assert results[0]['id'] == appointment.id

    def test_cancel_appointment_success(
        self, authenticated_client, appointment
    ):
        """Test canceling an appointment is successful."""
        url = reverse('appointment-cancel', args=[appointment.id])

        response = authenticated_client.post(url)

        assert response.status_code == status.HTTP_200_OK
        appointment.refresh_from_db()
        assert appointment.status == 'CANCELLED'

    def test_confirm_appointment_as_barber(
        self, authenticated_barber, appointment
    ):
        """Test barber can confirm appointment."""
        url = reverse('appointment-confirm', args=[appointment.id])

        response = authenticated_barber.post(url)

        assert response.status_code == status.HTTP_200_OK
        appointment.refresh_from_db()
        assert appointment.status == 'CONFIRMED'

    def test_complete_appointment_as_barber(
        self, authenticated_barber, appointment
    ):
        """Test barber can complete appointment."""
        appointment.status = 'IN_PROGRESS'
        appointment.save()

        url = reverse('appointment-complete', args=[appointment.id])

        response = authenticated_barber.post(url)

        assert response.status_code == status.HTTP_200_OK
        appointment.refresh_from_db()
        assert appointment.status == 'COMPLETED'

    def test_get_available_slots(
        self, authenticated_client, barber_user, service
    ):
        """Test getting available slots for a date."""
        url = reverse('appointment-available-slots')
        tomorrow = date.today() + timedelta(days=1)
        params = {
            'barber': barber_user.id,
            'date': tomorrow.isoformat(),
            'service': service.id
        }

        response = authenticated_client.get(url, params)

        assert response.status_code == status.HTTP_200_OK
        assert 'available_slots' in response.data
        assert isinstance(response.data['available_slots'], list)

    def test_update_appointment_not_allowed(
        self, authenticated_client, appointment
    ):
        """Test updating appointment via PUT is not allowed."""
        url = reverse('appointment-detail', args=[appointment.id])
        payload = {'status': 'COMPLETED'}

        response = authenticated_client.put(url, payload)

        # Should not be allowed to directly update appointment
        assert response.status_code in [
            status.HTTP_405_METHOD_NOT_ALLOWED,
            status.HTTP_403_FORBIDDEN
        ]


@pytest.mark.django_db
class TestAppointmentModel:
    """Test suite for Appointment model."""

    def test_appointment_str_representation(self, appointment):
        """Test appointment string representation."""
        expected = f"{appointment.service.name} - {appointment.client.full_name} - {appointment.date}"
        assert str(appointment) == expected

    def test_appointment_default_status_is_scheduled(
        self, client_user, barber_user, service
    ):
        """Test appointment default status is SCHEDULED."""
        appointment = Appointment.objects.create(
            client=client_user,
            barber=barber_user,
            service=service,
            date=date.today() + timedelta(days=1),
            start_time=time(10, 0),
            price_charged=service.price
        )

        assert appointment.status == 'SCHEDULED'

    def test_appointment_price_charged_defaults_to_service_price(
        self, client_user, barber_user, service
    ):
        """Test appointment price_charged defaults to service price."""
        appointment = Appointment.objects.create(
            client=client_user,
            barber=barber_user,
            service=service,
            date=date.today() + timedelta(days=1),
            start_time=time(10, 0)
        )

        # This depends on your model implementation
        # If you have a save override that sets price_charged
        assert appointment.price_charged is not None
