from rest_framework import serializers
from .models import HealthLog, APIEndpoint

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


class APIEndpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = APIEndpoint
        fields = [
            "id",
            "name",
            "url",
            "method",
            "is_active",
            "created_at",
        ]

