from .models import APIEndpoint, HealthLog
from django.utils import timezone
from datetime import timedelta
import requests
import time


def check_all_apis():
    apis = APIEndpoint.objects.filter(is_active = True)

    for api in apis:
        print(f"Checking API: {api.name}")
        start_time = time.time()
        
        try:
            response = requests.get(api.url, timeout=5)
            latency =  time.time() - start_time
            status_code = response.status_code
            success = status_code == 200

        except requests.exceptions.RequestException:
            latency = None
            status_code = 0
            success = False

        #save monitoring result (database)
        HealthLog.objects.create(
            api = api,
            status_code = status_code,
            response_time = latency,
            success = success
        )
        
        print(f"Saved log -> Status : {status_code}, Time : {latency}")
        

def delete_old_logs():
    threshold_date = timezone.now() - timedelta(days= 30)
    old_logs = HealthLog.objects.filter(checked_at__lt = threshold_date)
    deleted_count , _ = old_logs.delete()
    print(f"Deleted {deleted_count} old logs.")