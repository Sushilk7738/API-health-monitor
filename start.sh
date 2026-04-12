#!/bin/bash
set -e

echo "Running migrations..."
python manage.py migrate

echo "Starting Celery worker..."
celery -A config worker --loglevel=info --concurrency=1 &

echo "Starting Celery beat..."
celery -A config beat --loglevel=info \
--scheduler django_celery_beat.schedulers:DatabaseScheduler &

echo "Starting Django..."
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2