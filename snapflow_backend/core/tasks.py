from .models import SousAxe, ExecutionLog, TestAutomatique, Rapport
import subprocess
from django.utils import timezone
from .utils import envoyer_email_notification


def execute_script(test_id):
    try:
        test = TestAutomatique.objects.get(id=test_id)
    except TestAutomatique.DoesNotExist:
        return

    logs = []

    for sous_axe in test.sous_axes.all():
        try:
            result = subprocess.run(
                ["python", sous_axe.script.path],
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace"
            )

            stdout = result.stdout.strip()
            stderr = result.stderr.strip()
            return_code = result.returncode

            # Analyser les erreurs fonctionnelles détectées dans stdout
            alert_errors = []
            if "ERREURS_FORMULAIRES:" in stdout:
                section = stdout.split("ERREURS_FORMULAIRES:")[-1]
                for line in section.strip().splitlines():
                    line = line.strip()
                    if line.startswith("-"):
                        alert_errors.append(line.lstrip("- ").strip())

            statut = "Succès"
            contenu_log = ""

            # Cas de succès fonctionnel
            if return_code == 0 and not alert_errors:
                contenu_log = f"[stdout]\n{stdout}"
            else:
                statut = "Échec"

                # Erreurs de validation formulaire
                if alert_errors:
                    contenu_log += "Erreurs détectées dans le formulaire :\n"
                    contenu_log += "\n".join(f"- {e}" for e in alert_errors)
                    contenu_log += "\n\n"

                # Erreurs système (traceback selenium, etc.)
                if stderr:
                    contenu_log += "[stderr]\n" + stderr + "\n\n"

                # Inclure stdout pour inspection éventuelle
                contenu_log += "[stdout]\n" + stdout

            contenu_log += f"\n\n[returncode]: {return_code}"

            ExecutionLog.objects.create(
                sous_axe=sous_axe,
                statut=statut,
                contenu_log=contenu_log
            )

            logs.append(
                f"Sous-axe: {sous_axe.nom_sous_axe}\n"
                f"Résultat: {statut}\n"
                f"Logs:\n{contenu_log}\n{'-'*40}\n"
            )

        except Exception as e:
            ExecutionLog.objects.create(
                sous_axe=sous_axe,
                statut="Échec",
                contenu_log=f"[exception] {str(e)}"
            )
            logs.append(
                f"Sous-axe: {sous_axe.nom_sous_axe}\n"
                f"Résultat: Échec\n"
                f"Erreur: {str(e)}\n{'-'*40}\n"
            )

    contenu_rapport = "\n".join(logs)

    Rapport.objects.create(
        projet=test.projet,
        test=test,
        date_generation=timezone.now(),
        contenu=contenu_rapport
    )

    resultat_global = "Succès" if all("Résultat: Succès" in log for log in logs) else "Échec"

    envoyer_email_notification(
        test=test,
        resultat=resultat_global,
        contenu_rapport=contenu_rapport
    )
