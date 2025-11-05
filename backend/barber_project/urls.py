"""
URL configuration for barber_project project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from core.views import health_check, readiness_check, liveness_check

urlpatterns = [
    path('admin/', admin.site.urls),

    # Health check endpoints (for monitoring and load balancers)
    path('health/', health_check, name='health_check'),
    path('health/ready/', readiness_check, name='readiness_check'),
    path('health/alive/', liveness_check, name='liveness_check'),

    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # API endpoints
    path('api/users/', include('apps.users.urls')),
    path('api/services/', include('apps.services.urls')),
    path('api/appointments/', include('apps.appointments.urls')),
    path('api/reports/', include('apps.reports.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
