from rest_framework import viewsets, permissions
from django.utils.crypto import get_random_string
from .models import Utilisateur, Infraction, Contravention, Paiement, Notification
from .serializers import UtilisateurSerializer, InfractionSerializer, ContraventionSerializer, PaiementSerializer


class InfractionViewSet(viewsets.ModelViewSet):
    queryset = Infraction.objects.all()
    serializer_class = InfractionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ContraventionViewSet(viewsets.ModelViewSet):
    queryset = Contravention.objects.all()
    serializer_class = ContraventionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin_role():
            return Contravention.objects.all()
        elif user.is_agent_role():
            return Contravention.objects.filter(agent=user)
        elif user.is_citoyen_role():
            return Contravention.objects.filter(citoyen=user)
        return Contravention.objects.none()

    def perform_create(self, serializer):
        infraction = serializer.validated_data.get('infraction')
        numero = f"PV-{get_random_string(8).upper()}"
        serializer.save(
            agent=self.request.user,
            numero=numero,
            montant=infraction.montant if infraction else 0,
            statut=Contravention.STATUT_EN_ATTENTE
        )

    def perform_update(self, serializer):
        old_statut = self.get_object().statut
        contravention = serializer.save()
        if old_statut != contravention.statut and contravention.citoyen:
            if contravention.statut == Contravention.STATUT_VALIDEE:
                Notification.objects.create(
                    utilisateur=contravention.citoyen,
                    titre=f"Contravention {contravention.numero} Validée",
                    message=f"Votre contravention N° {contravention.numero} a été validée. Vous pouvez procéder au paiement."
                )
            elif contravention.statut == Contravention.STATUT_PAYEE:
                Notification.objects.create(
                    utilisateur=contravention.citoyen,
                    titre=f"Paiement Reçu - {contravention.numero}",
                    message=f"Le paiement de {contravention.montant} FCFA a été confirmé."
                )



class PaiementViewSet(viewsets.ModelViewSet):
    queryset = Paiement.objects.all()
    serializer_class = PaiementSerializer
    permission_classes = [permissions.IsAuthenticated]

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin_role():
            return Utilisateur.objects.all()
        # Other users shouldn't see all users, maybe just themselves or none
        return Utilisateur.objects.filter(id=user.id)

