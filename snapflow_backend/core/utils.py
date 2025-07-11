from django.core.mail import send_mail
from django.conf import settings

def envoyer_email_notification(test, resultat, contenu_rapport=""):
    if not test.emails_notification:
        return  # pas d'emails = rien à faire

    subject = f"Résultat du test automatique - {test.projet.nom_projet}"
    message = f"""
Bonjour,

Le test automatique lancé pour le projet « {test.projet.nom_projet} » a été exécuté.
Résultat : {resultat}

📄 Rapport :
{contenu_rapport}

Cordialement,
L'équipe Snapflow
    """

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=test.emails_notification,
        fail_silently=False,
    )
