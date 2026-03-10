from django.contrib import admin
from .models import APIEndpoint, HealthLog

admin.site.register(APIEndpoint)
admin.site.register(HealthLog)