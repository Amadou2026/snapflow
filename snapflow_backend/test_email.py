import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')  # ici 'config' au lieu de 'snapflow' ou 'ton_projet'

django.setup()

from core.utils import envoyer_email_notification  # adapte 'ton_app' !
from types import SimpleNamespace

def test_envoyer_email():
    test_simule = SimpleNamespace(
        projet=SimpleNamespace(nom="Projet Test"),
        emails_notification=["amadou.sire.soumare@medianet.com.tn"],  # ton email de test
    )

    resultat = "Succès"
    contenu_rapport = "Tout s'est bien passé."

    try:
        envoyer_email_notification(test_simule, resultat, contenu_rapport)
        print("E-mail envoyé avec succès (ou affiché selon backend).")
    except Exception as e:
        print(f"Erreur lors de l'envoi d'e-mail : {e}")

if __name__ == "__main__":
    test_envoyer_email()
