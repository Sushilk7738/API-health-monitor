from django.urls import path
from . import views

urlpatterns = [
    path('check/<int:api_id>', views.health_check , name='health_check'),
]
