from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Service
from .serializers import ServiceSerializer


class ServiceViewSet(viewsets.ModelViewSet):
    """ViewSet for Service CRUD operations."""

    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer

    def get_permissions(self):
        # Allow anyone to view services, but require auth for modifications
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
