from django.db import models
from django.contrib.auth.models import User

class APIEndpoint(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    url = models.URLField()
    method = models.CharField(max_length=10, default="GET")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    alert_sent = models.BooleanField(default=False)
    
    class Meta:
        verbose_name_plural = "api_end_point"

    def __str__(self):
        return self.name


class HealthLog(models.Model):
    api = models.ForeignKey(APIEndpoint, on_delete=models.CASCADE, related_name='logs')
    status_code = models.IntegerField()
    response_time = models.FloatField()
    success = models.BooleanField()
    checked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.api.name} - {self.status_code}"
        