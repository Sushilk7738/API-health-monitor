import requests
import time 
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import APIEndpoint, HealthLog


@api_view(['GET'])
def health_check(request, api_id):
    api = APIEndpoint.objects.get(id = api_id)
    start = time.time()
    try:
        response = requests.get(api.url)
        status = response.status_code
        success = status ==200
    
    except:
        status = 0
        success = False
    response_time = time.time() - start
    
    log = HealthLog.objects.create(
        api = api,
        status_code = status,
        response_time = response_time,
        success = success
    )
    
    return Response({
        "api" : api.name,
        "status_code" : status,
        "response_time" : response_time,
        "success" : success
    })