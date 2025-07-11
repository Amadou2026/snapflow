from rest_framework import viewsets, permissions
from .models import Projet, Axe, SousAxe, Rapport, ExecutionLog, TestAutomatique
from .serializers import *
from rest_framework.decorators import action
from .scheduler import refresh_jobs
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from django.contrib.auth import get_user_model
import requests
from django.http import JsonResponse
from django.conf import settings
from rest_framework.decorators import api_view


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


User = get_user_model()

class UserViewSet(viewsets.ReadOnlyModelViewSet):  # ReadOnly = GET only
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProjetViewSet(viewsets.ModelViewSet):
    queryset = Projet.objects.all()
    serializer_class = ProjetSerializer

class AxeViewSet(viewsets.ModelViewSet):
    queryset = Axe.objects.all()
    serializer_class = AxeSerializer

class SousAxeViewSet(viewsets.ModelViewSet):
    queryset = SousAxe.objects.all()
    serializer_class = SousAxeSerializer
    @action(detail=True, methods=['post'])
    def set_active(self, request, pk=None):
        sous_axe = self.get_object()
        active = request.data.get('active')
        if active is None:
            return Response({"detail": "Le champ 'active' est requis."}, status=400)
        sous_axe.active = bool(active)
        sous_axe.save()
        refresh_jobs()
        # Recharger les jobs dans le scheduler (voir plus bas)
        return Response({"id": sous_axe.id, "active": sous_axe.active})

class RapportViewSet(viewsets.ModelViewSet):
    queryset = Rapport.objects.all()
    serializer_class = RapportSerializer

class ExecutionLogViewSet(viewsets.ModelViewSet):
    queryset = ExecutionLog.objects.all().order_by('-date_execution')
    serializer_class = ExecutionLogSerializer

class TestAutomatiqueViewSet(viewsets.ModelViewSet):
    queryset = TestAutomatique.objects.all()
    serializer_class = TestAutomatiqueSerializer

from rest_framework.decorators import api_view
from django.http import JsonResponse
import requests
from django.conf import settings


@api_view(['GET'])
def get_redmine_tickets(request):
    url = f"{settings.REDMINE_URL}/issues.json"
    headers = {
        "X-Redmine-API-Key": settings.REDMINE_API_KEY,
        "Content-Type": "application/json"
    }
    params = {
        "project_id": 159,
        "limit": 10,
        "sort": "created_on:desc"
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        issues = response.json().get("issues", [])

        data = [
            {
                "id": issue["id"],
                "status": issue["status"]["name"],
                "created_on": issue["created_on"],
                "subject": issue.get("subject", ""),
                "assigned_to": issue.get("assigned_to", {}).get("name", "Non assigné"),
            }
            for issue in issues
        ]

        return JsonResponse(data, safe=False)

    except requests.RequestException as e:
        return JsonResponse({"error": f"Erreur Redmine: {str(e)}"}, status=500)
