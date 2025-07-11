# Snapflow – Plateforme de tests automatisés

**Snapflow** est une plateforme complète de gestion de projets avec des tests automatisés planifiés.  
Elle permet de créer des tests pour vérifier automatiquement des formulaires ou des parcours sur des sites web, et de générer des rapports avec alertes email.

---

## Stack technique

- **Backend** : Django + Django REST Framework
- **Frontend** : React.js + TailwindCSS
- **Base de données** : SQLite / PostgreSQL
- **Planification** : APScheduler
- **Tests automatisés** : Selenium WebDriver
- **Authentification** : JWT (djangorestframework-simplejwt)

---

## Fonctionnalités principales

### Tests Automatisés
- Création de tests liés à un projet, axe et sous-axe
- Exécution des tests en arrière-plan à une fréquence donnée (2 min, 2h, etc.)
- Notification par email en cas d’échec ou de succès
- Logs détaillés avec erreurs Selenium capturées

### 👤 Gestion des utilisateurs
- Rôles : superadmin, commercial, opérationnel, marketing, etc.
- Affectation de rubriques et sous-rubriques par rôle

### Rapports
- Génération automatique après chaque test
- Affichage des derniers rapports depuis le dashboard

---

## Installation locale

### Prérequis

- Python 3.11+
- Node.js 18+ et npm
- Chrome + chromedriver (si tests Selenium)

### Backend (Django)

```bash
# Clone le projet
git clone https://github.com/Amadou2026/snapflow.git
cd snapflow

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate sous Windows

# Installer les dépendances
pip install -r requirements.txt

# Lancer les migrations
python manage.py migrate

# Créer un super utilisateur
python manage.py createsuperuser

# Lancer le serveur
python manage.py runserver
