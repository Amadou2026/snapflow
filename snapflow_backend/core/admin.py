from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    Projet, Axe, SousAxe,
    ExecutionLog, Rapport,
    TestAutomatique, CustomUser, Role
)

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'prenom', 'nom', 'role', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'role')
    search_fields = ('email', 'nom', 'prenom')
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informations personnelles', {'fields': ('nom', 'prenom', 'role')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates importantes', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nom', 'prenom', 'role', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('nom',)
    filter_horizontal = ('permissions',)

@admin.register(Projet)
class ProjetAdmin(admin.ModelAdmin):
    list_display = ('nom_projet', 'id_redmine_projet', 'chargedecompte_projet')

@admin.register(Axe)
class AxeAdmin(admin.ModelAdmin):
    list_display = ('nom_axe', 'projet')

@admin.register(SousAxe)
class SousAxeAdmin(admin.ModelAdmin):
    list_display = ('nom_sous_axe', 'axe', 'active')
    list_editable = ('active',)

@admin.register(TestAutomatique)
class TestAutomatiqueAdmin(admin.ModelAdmin):
    list_display = ('nom_test', 'projet', 'periodicite', 'actif', 'date_creation')
    list_filter = ('actif', 'periodicite', 'projet')
    search_fields = ('nom_test',)

    fieldsets = (
        (None, {
            'fields': (
                'nom_test', 'projet', 'axes', 'sous_axes', 'periodicite',
                'actif', 'emails_notification'
            )
        }),
    )

    def get_emails(self, obj):
        return ", ".join(obj.emails_notification) if obj.emails_notification else "-"
    get_emails.short_description = "Emails de notification"

@admin.register(ExecutionLog)
class ExecutionLogAdmin(admin.ModelAdmin):
    list_display = ('sous_axe', 'date_execution', 'statut')
    list_filter = ('statut',)
    search_fields = ('sous_axe__nom_sous_axe',)

@admin.register(Rapport)
class RapportAdmin(admin.ModelAdmin):
    list_display = ('projet', 'get_source', 'get_statut', 'date_generation')
    list_filter = ('date_generation',)
    search_fields = ('projet__nom_projet', 'test__nom_test')

    def get_source(self, obj):
        return obj.test.nom_test if obj.test else 'Exécution manuelle'
    get_source.short_description = 'Source du rapport'

    def get_statut(self, obj):
        from .models import ExecutionLog  # pour éviter import circulaire
        logs = ExecutionLog.objects.filter(sous_axe__in=obj.sous_axes.all())
        if not logs.exists():
            return "Aucun log"
        return "Succès" if all(log.statut == "Succès" for log in logs) else "Échec"
    get_statut.short_description = "Statut calculé"
