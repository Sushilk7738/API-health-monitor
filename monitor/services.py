from django.core.mail import send_mail
from django.conf import settings
from .models import APIEndpoint, HealthLog
from django.utils import timezone
from datetime import timedelta
import requests
import time


def check_all_apis():
    apis = APIEndpoint.objects.filter(is_active = True)

    for api in apis:
        # print(f"Checking API: {api.name}")
        start_time = time.time()
        
        try:
            response = requests.get(api.url, timeout=5)
            latency =  time.time() - start_time
            status_code = response.status_code
            success = status_code == 200

        except requests.exceptions.RequestException:
            latency = 0
            status_code = 0
            success = False

        #save monitoring result (database)
        HealthLog.objects.create(
            api = api,
            status_code = status_code,
            response_time = latency,
            success = success
        )
        
        # print(f"Saved log -> Status : {status_code}, Time : {latency}")
        
        
        recent_logs = HealthLog.objects.filter(api=api).order_by("-checked_at")[:3]

        if len(recent_logs) == 3 and all(not log.success for log in recent_logs):
            print("3 consecutive failures detected")
            send_alert_email(api.name)
            
            
        

def delete_old_logs():
    threshold_date = timezone.now() - timedelta(days= 30)
    old_logs = HealthLog.objects.filter(checked_at__lt = threshold_date)
    deleted_count , _ = old_logs.delete()
    print(f"Deleted {deleted_count} old logs.")


def send_alert_email(api_name):
    subject = f"API ALERT: {api_name} is DOWN."
    message = f"The API '{api_name}' has failed multiple health checks. Please investigate."

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [settings.EMAIL_HOST_USER],
        fail_silently= False,
    )