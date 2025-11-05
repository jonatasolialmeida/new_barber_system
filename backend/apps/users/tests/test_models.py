"""
Tests for User model.
"""
import pytest
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()


@pytest.mark.django_db
class TestUserModel:
    """Test suite for User model."""

    def test_create_user_success(self):
        """Test creating a user is successful."""
        email = 'test@example.com'
        password = 'testpass123'
        user = User.objects.create_user(
            email=email,
            password=password,
            first_name='Test',
            last_name='User'
        )

        assert user.email == email
        assert user.check_password(password)
        assert user.is_active
        assert not user.is_staff
        assert not user.is_superuser

    def test_create_user_without_email_raises_error(self):
        """Test creating a user without email raises error."""
        with pytest.raises(ValueError):
            User.objects.create_user(
                email='',
                password='testpass123'
            )

    def test_create_superuser_success(self):
        """Test creating a superuser is successful."""
        email = 'admin@example.com'
        password = 'adminpass123'
        user = User.objects.create_superuser(
            email=email,
            password=password
        )

        assert user.email == email
        assert user.is_staff
        assert user.is_superuser
        assert user.is_active

    def test_user_full_name_property(self):
        """Test user full_name property returns correct name."""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='John',
            last_name='Doe'
        )

        assert user.full_name == 'John Doe'

    def test_user_default_role_is_client(self):
        """Test user default role is CLIENT."""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )

        assert user.role == 'CLIENT'

    def test_user_str_representation(self):
        """Test user string representation."""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )

        assert str(user) == 'test@example.com'

    @pytest.mark.parametrize('role', ['CLIENT', 'BARBER', 'OWNER'])
    def test_create_user_with_different_roles(self, role):
        """Test creating users with different roles."""
        user = User.objects.create_user(
            email=f'{role.lower()}@example.com',
            password='testpass123',
            role=role
        )

        assert user.role == role

    def test_email_normalization(self):
        """Test email is normalized when creating user."""
        email = 'test@EXAMPLE.COM'
        user = User.objects.create_user(
            email=email,
            password='testpass123'
        )

        assert user.email == 'test@example.com'
