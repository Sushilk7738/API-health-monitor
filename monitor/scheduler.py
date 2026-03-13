from apscheduler.schedulers.background import BackgroundScheduler
from .services import check_all_apis , delete_old_logs


def start_scheduler():
    scheduler = BackgroundScheduler()

    #run api every 1 min
    scheduler.add_job(check_all_apis, "interval", minutes = 1)

    #run api logs cleanup everyday
    scheduler.add_job(delete_old_logs, "interval", days = 1)

    scheduler.start()

    