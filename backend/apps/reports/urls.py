from django.urls import path
from .views import BarberReportView, OwnerReportView, DashboardView

urlpatterns = [
    path('barber/', BarberReportView.as_view(), name='barber-report'),
    path('owner/', OwnerReportView.as_view(), name='owner-report'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]
