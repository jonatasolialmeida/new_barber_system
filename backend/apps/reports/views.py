"""
Reports views for the barber shop system.
Provides financial and operational reports.
"""
from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Q, Avg
from apps.appointments.models import Appointment
from apps.users.models import User


class BarberReportView(APIView):
    """Individual barber reports."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get barber's individual report."""
        user = request.user

        # Only barbers and owners can access
        if not (user.is_barber or user.is_owner):
            return Response({'error': 'Access denied'}, status=403)

        # Get barber_id from query params or use current user
        barber_id = request.query_params.get('barber_id', user.id if user.is_barber else None)

        if not barber_id:
            return Response({'error': 'barber_id is required'}, status=400)

        # Date filters
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        queryset = Appointment.objects.filter(barber_id=barber_id)

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        # Appointments completed
        completed = queryset.filter(status='COMPLETED')
        completed_count = completed.count()
        total_earnings = completed.aggregate(total=Sum('price_charged'))['total'] or 0

        # Future appointments
        future = queryset.filter(
            date__gte=datetime.now().date(),
            status__in=['SCHEDULED', 'CONFIRMED']
        )
        future_count = future.count()
        expected_earnings = future.aggregate(total=Sum('price_charged'))['total'] or 0

        # Cancelled appointments
        cancelled_count = queryset.filter(status='CANCELLED').count()

        return Response({
            'barber_id': barber_id,
            'period': {
                'start_date': start_date,
                'end_date': end_date
            },
            'completed_appointments': completed_count,
            'total_earnings': float(total_earnings),
            'future_appointments': future_count,
            'expected_earnings': float(expected_earnings),
            'cancelled_appointments': cancelled_count
        })


class OwnerReportView(APIView):
    """Global reports for the owner."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get owner's global report."""
        user = request.user

        # Only owners can access
        if not user.is_owner:
            return Response({'error': 'Access denied'}, status=403)

        # Date filters
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        queryset = Appointment.objects.all()

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        # Total completed appointments
        completed = queryset.filter(status='COMPLETED')
        completed_count = completed.count()
        total_revenue = completed.aggregate(total=Sum('price_charged'))['total'] or 0

        # Future appointments
        future = queryset.filter(
            date__gte=datetime.now().date(),
            status__in=['SCHEDULED', 'CONFIRMED']
        )
        future_count = future.count()
        expected_revenue = future.aggregate(total=Sum('price_charged'))['total'] or 0

        # Statistics by barber
        barbers_stats = []
        barbers = User.objects.filter(role='BARBER', is_active=True)

        for barber in barbers:
            barber_completed = completed.filter(barber=barber)
            barber_earnings = barber_completed.aggregate(total=Sum('price_charged'))['total'] or 0

            barbers_stats.append({
                'barber_id': barber.id,
                'barber_name': barber.get_full_name(),
                'completed_appointments': barber_completed.count(),
                'total_earnings': float(barber_earnings)
            })

        # Cancelled and no-show
        cancelled_count = queryset.filter(status='CANCELLED').count()
        no_show_count = queryset.filter(status='NO_SHOW').count()

        return Response({
            'period': {
                'start_date': start_date,
                'end_date': end_date
            },
            'total_completed_appointments': completed_count,
            'total_revenue': float(total_revenue),
            'future_appointments': future_count,
            'expected_revenue': float(expected_revenue),
            'cancelled_appointments': cancelled_count,
            'no_show_appointments': no_show_count,
            'barbers_performance': barbers_stats
        })


class DashboardView(APIView):
    """Dashboard data for quick overview."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get dashboard summary."""
        user = request.user
        today = datetime.now().date()

        # Base queryset depends on role
        if user.is_owner:
            queryset = Appointment.objects.all()
        elif user.is_barber:
            queryset = Appointment.objects.filter(barber=user)
        else:
            queryset = Appointment.objects.filter(client=user)

        # Today's appointments
        today_appointments = queryset.filter(date=today).exclude(status='CANCELLED')

        # This week
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)
        week_appointments = queryset.filter(
            date__gte=week_start,
            date__lte=week_end
        ).exclude(status='CANCELLED')

        # This month
        month_start = today.replace(day=1)
        month_appointments = queryset.filter(
            date__gte=month_start,
            date__lte=today
        ).exclude(status='CANCELLED')

        return Response({
            'today': {
                'total': today_appointments.count(),
                'by_status': {
                    status[0]: today_appointments.filter(status=status[0]).count()
                    for status in Appointment.STATUS_CHOICES
                }
            },
            'this_week': {
                'total': week_appointments.count(),
                'completed': week_appointments.filter(status='COMPLETED').count()
            },
            'this_month': {
                'total': month_appointments.count(),
                'completed': month_appointments.filter(status='COMPLETED').count(),
                'revenue': float(
                    month_appointments.filter(status='COMPLETED')
                    .aggregate(total=Sum('price_charged'))['total'] or 0
                )
            }
        })
