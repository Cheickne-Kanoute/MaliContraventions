from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.crypto import get_random_string
from .models import Utilisateur, Infraction, Contravention, Paiement, Notification, GPSLocation
from .serializers import UtilisateurSerializer, InfractionSerializer, ContraventionSerializer, PaiementSerializer


class InfractionViewSet(viewsets.ModelViewSet):
    queryset = Infraction.objects.all()
    serializer_class = InfractionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ContraventionViewSet(viewsets.ModelViewSet):
    queryset = Contravention.objects.select_related('agent', 'citoyen', 'infraction').all()
    serializer_class = ContraventionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Contravention.objects.select_related('agent', 'citoyen', 'infraction')
        if user.is_admin_role():
            return qs.all()
        elif user.is_agent_role():
            return qs.filter(agent=user)
        elif user.is_citoyen_role():
            return qs.filter(citoyen=user)
        return qs.none()

    @action(detail=False, methods=['get'])
    def geoloc(self, request):
        user = request.user
        if not user.is_admin_role() and not user.is_agent_role():
            return Response({'error': 'Unauthorized'}, status=403)
            
        locations = GPSLocation.objects.select_related('contravention', 'contravention__infraction').all()
        data = []
        for loc in locations:
            data.append({
                'lat': loc.latitude,
                'lng': loc.longitude,
                'numero': loc.contravention.numero,
                'infraction': loc.contravention.infraction.libelle,
                'montant': loc.contravention.montant,
                'date': loc.contravention.date_contravention.strftime('%d/%m/%Y'),
                'statut': loc.contravention.statut
            })
        return Response({'locations': data})

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
    queryset = Paiement.objects.select_related('contravention').all()
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

