from django.apps import AppConfig

class CoreConfig(AppConfig):
    name = 'core'

    def ready(self):
        from .scheduler import start_scheduler
        from . import signals
        # start_scheduler()
        pass
