from rest_framework import serializers
from .models import Utilisateur, Infraction, Contravention, Paiement, Notification, Litige


class UtilisateurSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Utilisateur
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'telephone', 'nin_carte_identite', 'badge_agent', 'service_agent', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


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
        read_only_fields = ['numero', 'agent', 'montant', 'statut']

    def update(self, instance, validated_data):
        if 'infraction' in validated_data:
            infraction = validated_data['infraction']
            validated_data['montant'] = infraction.montant
        return super().update(instance, validated_data)


class PaiementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paiement
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class LitigeSerializer(serializers.ModelSerializer):
    contravention_details = ContraventionSerializer(source='contravention', read_only=True)

    class Meta:
        model = Litige
        fields = '__all__'

