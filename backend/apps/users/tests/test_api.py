"""
Tests for User API endpoints.
"""
import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
class TestUserAPI:
    """Test suite for User API."""

    def test_create_user_success(self, api_client):
        """Test creating a user via API is successful."""
        url = reverse('user-list')
        payload = {
            'email': 'newuser@example.com',
            'password': 'testpass123',
            'first_name': 'New',
            'last_name': 'User',
            'phone': '11999999999'
        }

        response = api_client.post(url, payload)

        assert response.status_code == status.HTTP_201_CREATED
        user = User.objects.get(email=payload['email'])
        assert user.check_password(payload['password'])
        assert 'password' not in response.data

    def test_create_user_with_short_password_fails(self, api_client):
        """Test creating user with password less than 8 characters fails."""
        url = reverse('user-list')
        payload = {
            'email': 'test@example.com',
            'password': 'short',
            'first_name': 'Test',
            'last_name': 'User'
        }

        response = api_client.post(url, payload)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert not User.objects.filter(email=payload['email']).exists()

    def test_get_current_user(self, authenticated_client, client_user):
        """Test getting current user details."""
        url = reverse('user-me')

        response = authenticated_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == client_user.email
        assert response.data['first_name'] == client_user.first_name

    def test_get_current_user_unauthenticated_fails(self, api_client):
        """Test getting current user without authentication fails."""
        url = reverse('user-me')

        response = api_client.get(url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_update_user_profile(self, authenticated_client, client_user):
        """Test updating user profile."""
        url = reverse('user-detail', args=[client_user.id])
        payload = {
            'first_name': 'Updated',
            'last_name': 'Name'
        }

        response = authenticated_client.patch(url, payload)

        assert response.status_code == status.HTTP_200_OK
        client_user.refresh_from_db()
        assert client_user.first_name == payload['first_name']
        assert client_user.last_name == payload['last_name']

    def test_list_barbers_as_client(self, authenticated_client, barber_user):
        """Test listing barbers as a client user."""
        url = reverse('user-barbers')

        response = authenticated_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['email'] == barber_user.email
        assert response.data[0]['role'] == 'BARBER'

    def test_create_user_duplicate_email_fails(self, api_client, client_user):
        """Test creating user with existing email fails."""
        url = reverse('user-list')
        payload = {
            'email': client_user.email,
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }

        response = api_client.post(url, payload)

        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestJWTAuthentication:
    """Test suite for JWT authentication."""

    def test_obtain_jwt_token_success(self, api_client, client_user):
        """Test obtaining JWT token with valid credentials."""
        url = reverse('token_obtain_pair')
        payload = {
            'email': 'client@test.com',
            'password': 'testpass123'
        }

        response = api_client.post(url, payload)

        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data

    def test_obtain_jwt_token_invalid_credentials(self, api_client, client_user):
        """Test obtaining JWT token with invalid credentials fails."""
        url = reverse('token_obtain_pair')
        payload = {
            'email': 'client@test.com',
            'password': 'wrongpassword'
        }

        response = api_client.post(url, payload)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_refresh_jwt_token_success(self, api_client, client_user):
        """Test refreshing JWT token."""
        # First obtain token
        obtain_url = reverse('token_obtain_pair')
        obtain_payload = {
            'email': 'client@test.com',
            'password': 'testpass123'
        }
        obtain_response = api_client.post(obtain_url, obtain_payload)
        refresh_token = obtain_response.data['refresh']

        # Then refresh token
        refresh_url = reverse('token_refresh')
        refresh_payload = {'refresh': refresh_token}

        response = api_client.post(refresh_url, refresh_payload)

        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
