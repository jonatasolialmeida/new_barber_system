"""
Pytest configuration and shared fixtures for backend tests.
"""
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.services.models import Service
from apps.appointments.models import Appointment
from datetime import date, time
from decimal import Decimal

User = get_user_model()


@pytest.fixture
def api_client():
    """
    Returns an API client for making requests.
    """
    return APIClient()


@pytest.fixture
def client_user(db):
    """
    Creates and returns a client user.
    """
    return User.objects.create_user(
        email='client@test.com',
        password='testpass123',
        first_name='John',
        last_name='Doe',
        role='CLIENT',
        phone='11999999999'
    )


@pytest.fixture
def barber_user(db):
    """
    Creates and returns a barber user.
    """
    return User.objects.create_user(
        email='barber@test.com',
        password='testpass123',
        first_name='Mike',
        last_name='Smith',
        role='BARBER',
        phone='11988888888'
    )


@pytest.fixture
def owner_user(db):
    """
    Creates and returns an owner user.
    """
    return User.objects.create_user(
        email='owner@test.com',
        password='testpass123',
        first_name='Admin',
        last_name='Owner',
        role='OWNER',
        phone='11977777777'
    )


@pytest.fixture
def service(db):
    """
    Creates and returns a service.
    """
    return Service.objects.create(
        name='Corte de Cabelo',
        description='Corte masculino tradicional',
        duration=30,
        price=Decimal('50.00'),
        is_active=True
    )


@pytest.fixture
def appointment(db, client_user, barber_user, service):
    """
    Creates and returns an appointment.
    """
    return Appointment.objects.create(
        client=client_user,
        barber=barber_user,
        service=service,
        date=date.today(),
        start_time=time(10, 0),
        price_charged=service.price,
        status='SCHEDULED'
    )


@pytest.fixture
def authenticated_client(api_client, client_user):
    """
    Returns an authenticated API client for a client user.
    """
    api_client.force_authenticate(user=client_user)
    return api_client


@pytest.fixture
def authenticated_barber(api_client, barber_user):
    """
    Returns an authenticated API client for a barber user.
    """
    api_client.force_authenticate(user=barber_user)
    return api_client


@pytest.fixture
def authenticated_owner(api_client, owner_user):
    """
    Returns an authenticated API client for an owner user.
    """
    api_client.force_authenticate(user=owner_user)
    return api_client
