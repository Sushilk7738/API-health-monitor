import requests
import time 
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import APIEndpoint, HealthLog
from .serializers import HealthLogSerializer, APIEndpointSerializer
from rest_framework import generics
from django.db.models import Avg
from django.utils import timezone
from django.shortcuts import get_object_or_404
from datetime import timedelta
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import RegisterSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def health_check(request, api_id):
    from .services import perform_check

    api = get_object_or_404(APIEndpoint, id = api_id)
    
    status, success, response_time = perform_check(api) 
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
    permission_classes = [IsAuthenticated]
    serializer_class = HealthLogSerializer

    def get_queryset(self):
        queryset = HealthLog.objects.filter(api__user= self.request.user).order_by('-checked_at')

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
        return HealthLog.objects.all().order_by('-checked_at')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_stats(request, api_id):
    logs = HealthLog.objects.filter(api_id = api_id, api__user = request.user)
    
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



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_status(request):
    if request.user.is_authenticated:
        apis = APIEndpoint.objects.filter(user = request.user)
    else:
        apis = APIEndpoint.objects.all()
    
    data = []

    for api in apis:
        last_log = HealthLog.objects.filter(api = api).order_by("-checked_at").first()

        if last_log:
            status = "UP" if last_log.success else "DOWN"
        else:
            status = "UNKNOWN"

        data.append({
            "id" : api.id,
            "name": api.name,
            "url" : api.url,
            "status" : status,
            "response_time": last_log.response_time if last_log else None,
            "last_checked" : last_log.checked_at if last_log else None
        })

    return Response(data)








#* API LIST view

class APIEndpointListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = APIEndpointSerializer

    def get_queryset(self):
        return APIEndpoint.objects.filter(user = self.request.user)
    
    
#* API create/add view

class APIEndpointCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = APIEndpointSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class APIEndpointDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = APIEndpointSerializer

    def get_queryset(self):
        return APIEndpoint.objects.filter(user = self.request.user)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    
    
@api_view(['PATCH'])   
@permission_classes([IsAuthenticated])
def toggle_keep_alive(request, api_id):
    api = get_object_or_404(APIEndpoint, id = api_id, user = request.user)

    api.keep_alive = not api.keep_alive
    api.save()
    return Response({
        "id": api.id,
        "keep_alive": api.keep_alive,
    })