from apscheduler.schedulers.background import BackgroundScheduler
from .tasks import execute_script
from .models import TestAutomatique

scheduler = BackgroundScheduler()


def start_scheduler():
    scheduler.start()
    refresh_jobs()


def refresh_jobs():
    scheduler.remove_all_jobs()

    for test in TestAutomatique.objects.filter(actif=True):
        job_id = f'test_{test.id}'
        periodicite = test.periodicite

        if periodicite == '2m':
            scheduler.add_job(execute_script, 'interval', minutes=2, args=[test.id], id=job_id)
        elif periodicite == '2h':
            scheduler.add_job(execute_script, 'interval', hours=2, args=[test.id], id=job_id)
        elif periodicite == '6h':
            scheduler.add_job(execute_script, 'interval', hours=6, args=[test.id], id=job_id)
        elif periodicite == '12h':
            scheduler.add_job(execute_script, 'interval', hours=12, args=[test.id], id=job_id)
        elif periodicite == '24h':
            scheduler.add_job(execute_script, 'interval', hours=24, args=[test.id], id=job_id)
        elif periodicite == 'hebdo':
            scheduler.add_job(execute_script, 'interval', weeks=1, args=[test.id], id=job_id)
        elif periodicite == 'mensuel':
            scheduler.add_job(execute_script, 'interval', days=30, args=[test.id], id=job_id)
