from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .models import User, BarberScheduleBlock
from .serializers import (
    UserSerializer,
    UserCreateSerializer,
    BarberSerializer,
    BarberScheduleBlockSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User CRUD operations."""

    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        """Restrict barber and owner creation to owners only."""
        role = serializer.validated_data.get('role', 'CLIENT')

        # If creating a barber or owner, must be authenticated and be an owner
        if role in ['BARBER', 'OWNER']:
            if not self.request.user.is_authenticated:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("Você precisa estar autenticado para criar este tipo de usuário.")

            if not self.request.user.is_owner:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("Apenas proprietários podem cadastrar barbeiros ou outros proprietários.")

        serializer.save()

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def barbers(self, request):
        """List all active barbers."""
        barbers = User.objects.filter(role='BARBER', is_active=True)
        serializer = BarberSerializer(barbers, many=True)
        return Response(serializer.data)


class BarberScheduleBlockViewSet(viewsets.ModelViewSet):
    """ViewSet for managing barber schedule blocks."""

    queryset = BarberScheduleBlock.objects.all()
    serializer_class = BarberScheduleBlockSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter blocks based on user role."""
        user = self.request.user

        # Owners can see all blocks
        if user.is_owner:
            return BarberScheduleBlock.objects.all()

        # Barbers can only see their own blocks
        if user.is_barber:
            return BarberScheduleBlock.objects.filter(barber=user)

        # Clients can see all blocks to know when barbers are unavailable
        return BarberScheduleBlock.objects.all()

    def perform_create(self, serializer):
        """Ensure barber field is set to current user."""
        serializer.save(barber=self.request.user)


class PasswordResetRequestView(APIView):
    """API view for requesting password reset."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)

            # Generate reset token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            # In production, send email with reset link
            # For now, return the reset link in response
            reset_link = f"{request.build_absolute_uri('/password-reset/')}{uid}/{token}/"

            return Response({
                'message': 'Password reset link has been sent to your email.',
                'reset_link': reset_link  # Remove in production
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    """API view for confirming password reset."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Password has been reset successfully.'
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
