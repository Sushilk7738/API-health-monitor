from django.core.mail import send_mail
from django.conf import settings
from .models import APIEndpoint, HealthLog
from django.utils import timezone
from datetime import timedelta
import requests
import time
import logging

logger = logging.getLogger(__name__)




def check_all_apis():
    apis = APIEndpoint.objects.filter(is_active = True)

    for api in apis:
        logger.info(f"Checking API: {api.name}")
        
        start_time = time.time()
        retries = 3
        delay = 1
        success = False
        status_code = 0
        
        for attempt in range(retries):
            try:
                response = requests.request(api.method, api.url, timeout=5)
                status_code = response.status_code
                success = status_code == 200 and "success" in response.text.lower()

                if success:
                    break
            except requests.exceptions.RequestException:
                pass
                
            if attempt < retries - 1:
                time.sleep(delay)
        
        latency = time.time() - start_time

        if latency > api.latency_threshold:
            send_latency_alert(api.name, api.user.email, latency)
        
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
            if not api.alert_sent:
                send_alert_email(api.name, api.user.email)
                api.alert_sent = True
                api.save()
            
        if success and api.alert_sent:
            send_recovery_email(api.name, api.user.email)
            api.alert_sent = False
            api.save()
        
        

def delete_old_logs():
    threshold_date = timezone.now() - timedelta(days= 30)
    old_logs = HealthLog.objects.filter(checked_at__lt = threshold_date)
    deleted_count , _ = old_logs.delete()
    logger.info(f"Deleted {deleted_count} old logs.")


def send_alert_email(api_name, user_email):
    subject = f"API ALERT: {api_name} is DOWN."
    message = f"The API '{api_name}' has failed multiple health checks. Please investigate."

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [user_email],
        fail_silently= False,
    )
    

def send_recovery_email(api_name, user_email):
    subject = f"API Recovered: {api_name} is UP."
    message = f"The API '{api_name}' is back to normal operation."

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [user_email],
        fail_silently=False,
    )
    


def send_latency_alert(api_name, user_email, latency):
    subject = f"API SLOW : {api_name}"
    message = f"API '{api_name}' is slow. Response time: {latency:.2f}s"

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [user_email],
        fail_silently= False,
    )