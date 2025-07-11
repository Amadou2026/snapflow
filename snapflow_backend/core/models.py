from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings

from django.core.validators import validate_email
from django.core.exceptions import ValidationError


from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Permission, Group

class Role(models.Model):
    nom = models.CharField(max_length=100, unique=True)
    permissions = models.ManyToManyField(Permission, blank=True)

    def __str__(self):
        return self.nom


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'email doit être défini")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Le superadmin doit avoir is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Le superadmin doit avoir is_superuser=True')
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom', 'prenom']

    def __str__(self):
        return f"{self.prenom} {self.nom} ({self.email})"

    @property
    def get_permissions(self):
        """Retourne toutes les permissions du rôle attribué"""
        if self.role:
            return self.role.permissions.all()
        return []


# --------- Projet & Liés ---------
class Projet(models.Model):
    id_redmine_projet = models.CharField(max_length=100)
    nom_projet = models.CharField(max_length=255)
    url_projet = models.URLField()
    logo_projet = models.ImageField(upload_to='logos/')
    contrat_projet = models.TextField()
    chargedecompte_projet = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='projets'
    )

    def __str__(self):
        return self.nom_projet


class Axe(models.Model):
    projet = models.ForeignKey(Projet, on_delete=models.CASCADE, related_name='axes')
    nom_axe = models.CharField(max_length=255)
    introduction_axe = models.TextField(blank=True)
    description_axe = models.TextField(blank=True)

    def __str__(self):
        return f"{self.nom_axe} - {self.projet.nom_projet}"


class SousAxe(models.Model):
    axe = models.ForeignKey(Axe, on_delete=models.CASCADE, related_name='sous_axes')
    nom_sous_axe = models.CharField(max_length=255)
    introduction_sous_axe = models.TextField(blank=True)
    description_sous_axe = models.TextField(blank=True)
    script = models.FileField(upload_to='scripts/')
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nom_sous_axe} ({self.axe.nom_axe})"


# --------- Tests Automatisés ---------
class TestAutomatique(models.Model):
    PERIODICITE_CHOICES = [
        ('2m', 'Toutes les 2 minutes'),
        ('2h', 'Toutes les 2 heures'),
        ('6h', 'Toutes les 6 heures'),
        ('12h', 'Toutes les 12 heures'),
        ('24h', 'Une fois par jour'),
        ('hebdo', 'Une fois par semaine'),
        ('mensuel', 'Une fois par mois'),
    ]
    emails_notification = models.JSONField(
        default=list,
        help_text="Liste des emails pour recevoir les notifications",
        blank=True
    )

    nom_test = models.CharField(max_length=255)
    projet = models.ForeignKey(Projet, on_delete=models.CASCADE, related_name='tests')
    axes = models.ManyToManyField(Axe, related_name='tests')
    sous_axes = models.ManyToManyField(SousAxe, related_name='tests')
    periodicite = models.CharField(max_length=10, choices=PERIODICITE_CHOICES)
    actif = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    def clean(self):
        for email in self.emails_notification:
            try:
                validate_email(email)
            except ValidationError:
                raise ValidationError({
                    "emails_notification": f"{email} n'est pas un email valide."
                })

    def __str__(self):
        return f"{self.nom_test} - {self.projet.nom_projet}"


# --------- Logs et Rapports ---------
class ExecutionLog(models.Model):
    sous_axe = models.ForeignKey(SousAxe, on_delete=models.CASCADE)
    date_execution = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=50, choices=[('Succès', 'Succès'), ('Échec', 'Échec')])
    contenu_log = models.TextField()

    def __str__(self):
        return f"{self.sous_axe.nom_sous_axe} - {self.date_execution.strftime('%Y-%m-%d %H:%M:%S')}"


class Rapport(models.Model):
    projet = models.ForeignKey(Projet, on_delete=models.CASCADE, related_name='rapports')
    test = models.ForeignKey(TestAutomatique, on_delete=models.SET_NULL, null=True, blank=True, related_name='rapports')
    sous_axes = models.ManyToManyField(SousAxe, related_name='rapports')
    date_generation = models.DateTimeField(auto_now_add=True)
    # statut = models.CharField(max_length=50, choices=[('Succès', 'Succès'), ('Échec', 'Échec')])
    contenu = models.TextField(help_text="Résultats de l’exécution des scripts.")

    def __str__(self):
        source = self.test.nom_test if self.test else self.projet.nom_projet
        return f"Rapport - {source} - {self.date_generation.strftime('%Y-%m-%d %H:%M')}"
