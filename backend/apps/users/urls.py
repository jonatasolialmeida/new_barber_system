from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    BarberScheduleBlockViewSet,
    PasswordResetRequestView,
    PasswordResetConfirmView
)

# Separate routers to avoid conflicts
user_router = DefaultRouter()
user_router.register(r'', UserViewSet, basename='user')

block_router = DefaultRouter()
block_router.register(r'', BarberScheduleBlockViewSet, basename='schedule-block')

urlpatterns = [
    path('schedule-blocks/', include(block_router.urls)),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('', include(user_router.urls)),
]
