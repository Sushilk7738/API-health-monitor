from rest_framework import serializers
from .models import HealthLog

class HealthLogSerializer(serializers.ModelSerializer):
    api_name = serializers.CharField(source = "api.name")

    class Meta:
        model    = HealthLog
        fields = [
            "id",
            "api_name",
            "status_code",
            "response_time",
            "success",
            "checked_at"
        ]