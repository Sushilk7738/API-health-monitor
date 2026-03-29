from django.urls import path
from . import views

urlpatterns = [
    #* to see all registered apis health
    path('check/<int:api_id>/', views.health_check , name='health_check'),

    #* to see successfull apis logs
    path('logs/', views.HealthLogListView.as_view(), name='logs'),

    #* to see all apis stats individually
    path('stats/<int:api_id>', views.api_stats, name='api_stats'),

    #* to see all registered apis list
    path('apis/', views.APIEndpointListView.as_view(), name= 'api_list'),

    #* to register apis manually
    path('apis/create', views.APIEndpointCreateView.as_view(), name='api_create'),

    
    #* status of apis
    path('status', views.api_status, name='api_status'),

    #* to fetch single api of user
    path('apis/<int:pk>', views.APIEndpointDetailView.as_view(), name='api_detail'),

    #* to register api  
    path('register', views.RegisterView.as_view(), name='register'),
]   
