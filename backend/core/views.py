"""
Core views including health check endpoint.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from django.core.cache import cache
import redis
from django.conf import settings


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Health check endpoint for monitoring and load balancers.

    Checks:
    - Database connectivity
    - Redis connectivity
    - Cache functionality

    Returns:
    - 200 OK if all systems are operational
    - 503 Service Unavailable if any system fails
    """
    health_status = {
        'status': 'healthy',
        'database': 'unknown',
        'cache': 'unknown',
        'redis': 'unknown',
    }

    all_healthy = True

    # Check database
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        health_status['database'] = 'healthy'
    except Exception as e:
        health_status['database'] = f'unhealthy: {str(e)}'
        all_healthy = False

    # Check cache
    try:
        cache_key = 'health_check_test'
        cache.set(cache_key, 'test', 10)
        cached_value = cache.get(cache_key)
        if cached_value == 'test':
            health_status['cache'] = 'healthy'
        else:
            health_status['cache'] = 'unhealthy: cache read/write mismatch'
            all_healthy = False
        cache.delete(cache_key)
    except Exception as e:
        health_status['cache'] = f'unhealthy: {str(e)}'
        all_healthy = False

    # Check Redis (Celery broker)
    try:
        redis_client = redis.from_url(settings.CELERY_BROKER_URL)
        redis_client.ping()
        health_status['redis'] = 'healthy'
    except Exception as e:
        health_status['redis'] = f'unhealthy: {str(e)}'
        all_healthy = False

    # Set overall status
    if not all_healthy:
        health_status['status'] = 'unhealthy'
        return Response(health_status, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    return Response(health_status, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def readiness_check(request):
    """
    Readiness check - simpler check for container orchestration.
    Only checks if the service is ready to accept traffic.
    """
    return Response({'status': 'ready'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def liveness_check(request):
    """
    Liveness check - very basic check to see if service is alive.
    """
    return Response({'status': 'alive'}, status=status.HTTP_200_OK)
