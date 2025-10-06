from rest_framework import serializers
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from .models import User, BarberScheduleBlock


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""

    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'birth_date', 'role', 'is_active',
            'receive_email_notifications', 'receive_sms_notifications',
            'receive_whatsapp_notifications', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating users."""

    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            'email', 'password', 'first_name', 'last_name',
            'phone', 'birth_date', 'role'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class BarberSerializer(serializers.ModelSerializer):
    """Serializer specifically for barbers."""

    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'full_name', 'first_name', 'last_name', 'email', 'phone']


class BarberScheduleBlockSerializer(serializers.ModelSerializer):
    """Serializer for barber schedule blocks."""

    barber_name = serializers.CharField(source='barber.get_full_name', read_only=True)

    class Meta:
        model = BarberScheduleBlock
        fields = [
            'id', 'barber', 'barber_name', 'date',
            'start_time', 'end_time', 'all_day', 'reason', 'created_at'
        ]
        read_only_fields = ['id', 'barber', 'created_at']

    def validate(self, data):
        """Validate that time range is valid if not all_day."""
        if not data.get('all_day', False):
            if not data.get('start_time') or not data.get('end_time'):
                raise serializers.ValidationError(
                    "Start time and end time are required when not blocking all day."
                )
            if data['start_time'] >= data['end_time']:
                raise serializers.ValidationError(
                    "End time must be after start time."
                )
        return data


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for requesting password reset."""

    email = serializers.EmailField()

    def validate_email(self, value):
        """Validate that email exists."""
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user found with this email address.")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for confirming password reset."""

    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8, write_only=True)

    def validate(self, data):
        """Validate token and uid."""
        try:
            uid = force_str(urlsafe_base64_decode(data['uid']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid reset link.")

        if not default_token_generator.check_token(user, data['token']):
            raise serializers.ValidationError("Invalid or expired reset link.")

        data['user'] = user
        return data

    def save(self):
        """Reset the password."""
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
