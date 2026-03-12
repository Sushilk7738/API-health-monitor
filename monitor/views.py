import requests
import time 
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import APIEndpoint, HealthLog
from .serializers import HealthLogSerializer
from rest_framework import generics



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
    