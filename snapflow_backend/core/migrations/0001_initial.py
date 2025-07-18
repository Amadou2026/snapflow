# Generated by Django 5.1.4 on 2025-07-08 11:06

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Projet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('id_redmine_projet', models.CharField(max_length=100)),
                ('nom_projet', models.CharField(max_length=255)),
                ('url_projet', models.URLField()),
                ('logo_projet', models.ImageField(upload_to='logos/')),
                ('contrat_projet', models.TextField()),
                ('chargedecompte_projet', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='projets', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Axe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom_axe', models.CharField(max_length=255)),
                ('introduction_axe', models.TextField(blank=True)),
                ('description_axe', models.TextField(blank=True)),
                ('projet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='axes', to='core.projet')),
            ],
        ),
        migrations.CreateModel(
            name='SousAxe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom_sous_axe', models.CharField(max_length=255)),
                ('introduction_sous_axe', models.TextField(blank=True)),
                ('description_sous_axe', models.TextField(blank=True)),
                ('script', models.FileField(upload_to='scripts/')),
                ('active', models.BooleanField(default=True)),
                ('axe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sous_axes', to='core.axe')),
            ],
        ),
        migrations.CreateModel(
            name='ExecutionLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_execution', models.DateTimeField(auto_now_add=True)),
                ('statut', models.CharField(choices=[('Succès', 'Succès'), ('Échec', 'Échec')], max_length=50)),
                ('contenu_log', models.TextField()),
                ('sous_axe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.sousaxe')),
            ],
        ),
        migrations.CreateModel(
            name='TestAutomatique',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom_test', models.CharField(max_length=255)),
                ('periodicite', models.CharField(choices=[('2m', 'Toutes les 2 minutes'), ('2h', 'Toutes les 2 heures'), ('6h', 'Toutes les 6 heures'), ('12h', 'Toutes les 12 heures'), ('24h', 'Une fois par jour'), ('hebdo', 'Une fois par semaine'), ('mensuel', 'Une fois par mois')], max_length=10)),
                ('actif', models.BooleanField(default=True)),
                ('date_creation', models.DateTimeField(auto_now_add=True)),
                ('axes', models.ManyToManyField(related_name='tests', to='core.axe')),
                ('projet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tests', to='core.projet')),
                ('sous_axes', models.ManyToManyField(related_name='tests', to='core.sousaxe')),
            ],
        ),
        migrations.CreateModel(
            name='Rapport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_generation', models.DateTimeField(auto_now_add=True)),
                ('statut', models.CharField(choices=[('Succès', 'Succès'), ('Échec', 'Échec')], max_length=50)),
                ('contenu', models.TextField(help_text='Résultats de l’exécution des scripts.')),
                ('projet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rapports', to='core.projet')),
                ('sous_axes', models.ManyToManyField(related_name='rapports', to='core.sousaxe')),
                ('test', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='rapports', to='core.testautomatique')),
            ],
        ),
    ]
