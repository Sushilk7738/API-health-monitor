from .models import APIEndpoint, HealthLog
import requests
import time


def check_all_apis():
    apis = APIEndpoint.objects.filter(is_active = True)

    for api in apis:
        start_time = time.time()
        response = requests.get(api.url)
        end_time = time.time()
        response_time = end_time - start_time
        
        print(api.name, response.status_code, response_time)