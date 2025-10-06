#!/bin/bash

# Wait for PostgreSQL
echo "Waiting for PostgreSQL..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.1
done
echo "PostgreSQL started"

# Run migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Create superuser if doesn't exist
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@barber.com').exists():
    User.objects.create_superuser(
        email='admin@barber.com',
        password='admin123',
        first_name='Admin',
        last_name='User',
        role='OWNER'
    )
    print('Superuser created successfully')
else:
    print('Superuser already exists')
EOF

# Start server
exec "$@"
