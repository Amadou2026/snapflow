from rest_framework import serializers
from .models import Projet, Axe, SousAxe, Rapport, ExecutionLog, TestAutomatique
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.core.validators import validate_email

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Ajoute des champs custom au token si besoin
        token['email'] = user.email
        return token

    def validate(self, attrs):
        # Ici, on authentifie par email au lieu de username
        credentials = {
            'email': attrs.get('email'),
            'password': attrs.get('password')
        }
        user = self.user = self.authenticate_user(**credentials)
        if user is None:
            raise serializers.ValidationError('Email ou mot de passe invalide')
        return super().validate(attrs)

    def authenticate_user(self, email, password):
        from django.contrib.auth import authenticate
        return authenticate(self.context['request'], email=email, password=password)

class ProjetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projet
        fields = '__all__'

class AxeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Axe
        fields = '__all__'

class SousAxeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SousAxe
        fields = '__all__'


class SousAxeActivationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SousAxe
        fields = ['id', 'active']

class RapportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rapport
        fields = '__all__'

class ExecutionLogSerializer(serializers.ModelSerializer):
    sous_axe = SousAxeSerializer(read_only=True)
    class Meta:
        model = ExecutionLog
        fields = '__all__'

class TestAutomatiqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestAutomatique
        fields = '__all__'

    def validate_emails_notification(self, value):
            for email in value:
                validate_email(email)
            return value

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'prenom', 'nom', 'email', 'full_name']
    
    def get_full_name(self, obj):
        return f"{obj.prenom} {obj.nom}"

    