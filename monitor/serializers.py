from rest_framework import serializers
from .models import HealthLog, APIEndpoint
from django.contrib.auth.models import User


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



class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {
            "password": {"write_only" : True}
        }
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user