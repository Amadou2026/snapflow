from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import SousAxe, TestAutomatique  # 👈 importer aussi TestAutomatique
from .scheduler import refresh_jobs


@receiver(post_save, sender=SousAxe)
@receiver(post_delete, sender=SousAxe)
@receiver(post_save, sender=TestAutomatique)  # 👈 ajout
@receiver(post_delete, sender=TestAutomatique)  # 👈 ajout
def handle_model_change(sender, instance, **kwargs):
    refresh_jobs()
