#!/bin/bash

# Run migrations
python manage.py migrate

# Start Celery worker in background
celery -A config worker --loglevel=info &

# Start Celery beat in background
celery -A config beat --loglevel=info &

# Start Django server
gunicorn config.wsgi:application