from celery import shared_task
from .services import check_all_apis, delete_old_logs

@shared_task
def run_api_checks():
    check_all_apis()

@shared_task
def cleanup_logs():
    delete_old_logs()