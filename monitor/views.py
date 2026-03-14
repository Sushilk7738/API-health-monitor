import requests
import time 
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import APIEndpoint, HealthLog
from .serializers import HealthLogSerializer, APIEndpointSerializer
from rest_framework import generics
from django.db.models import Avg
from django.utils import timezone
from datetime import timedelta



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


class HealthLogListView(generics.ListAPIView):
    serializer_class = HealthLogSerializer

    def get_queryset(self):
        queryset = HealthLog.objects.all().order_by('-checked_at')

        success = self.request.query_params.get('success')
        status = self.request.query_params.get('status')

        if success is not None:
            if success.lower() == 'true':
                queryset = queryset.filter(success = True)
            elif success.lower() == 'false':
                queryset = queryset.filter(success = False)

        if status:
            queryset = queryset.filter(status_code = status)
            
        return queryset
    


@api_view(['GET'])
def api_stats(request, api_id):
    logs = HealthLog.objects.filter(api_id = api_id)
    
    hours = request.query_params.get('hours')
    days = request.query_params.get('days')

    if hours:
        since = timezone.now() - timedelta(hours=int(hours))
        logs = logs.filter(checked_at__gte = since)

    if days:
        since = timezone.now() - timedelta(days=int(days))
        logs = logs.filter(checked_at__gte = since)

    total_checks = logs.count()
    success_checks = logs.filter(success = True).count()
    failures = logs.filter(success = False).count()

    avg_response = logs.aggregate(avg =Avg("response_time"))['avg']

    up_time = (success_checks / total_checks * 100) if total_checks > 0 else 0

    return Response({
        'api_id' : api_id,
        'total_checks' : total_checks,
        'success_checks' : success_checks,
        'failures' : failures,
        "uptime_percentage" : round(up_time, 2),
        "avg_response_time" : avg_response
    })



#* API LIST view

class APIEndpointListView(generics.ListAPIView):
    queryset = APIEndpoint.objects.all()
    serializer_class = APIEndpointSerializer
    
    
#* API create/add view

class APIEndpointCreateView(generics.CreateAPIView):
    queryset = APIEndpoint.objects.all()
    serializer_class = APIEndpointSerializer