from rest_framework import serializers
from .models import Utilisateur, Infraction, Contravention, Paiement, Notification


class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'telephone', 'nin_carte_identite', 'badge_agent', 'service_agent']


class InfractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Infraction
        fields = '__all__'


class ContraventionSerializer(serializers.ModelSerializer):
    agent_details = UtilisateurSerializer(source='agent', read_only=True)
    citoyen_details = UtilisateurSerializer(source='citoyen', read_only=True)
    infraction_details = InfractionSerializer(source='infraction', read_only=True)

    class Meta:
        model = Contravention
        fields = '__all__'


class PaiementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paiement
        fields = '__all__'
