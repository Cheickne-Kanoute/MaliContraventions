from rest_framework import viewsets, permissions
from django.utils.crypto import get_random_string
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Utilisateur, Infraction, Contravention, Paiement, Notification, Litige, GPSLocation
from .serializers import UtilisateurSerializer, InfractionSerializer, ContraventionSerializer, PaiementSerializer, NotificationSerializer, LitigeSerializer


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

    def perform_create(self, serializer):
        infraction = serializer.validated_data.get('infraction')
        numero = f"PV-{get_random_string(8).upper()}"
        contravention = serializer.save(
            agent=self.request.user,
            numero=numero,
            montant=infraction.montant if infraction else 0,
            statut=Contravention.STATUT_EN_ATTENTE
        )
        
        # Save GPS Location if provided
        lat = self.request.data.get('latitude')
        lng = self.request.data.get('longitude')
        if lat and lng:
            try:
                GPSLocation.objects.create(
                    contravention=contravention,
                    latitude=float(lat),
                    longitude=float(lng)
                )
            except ValueError:
                pass

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
            })
        return Response({'locations': data})

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

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(utilisateur=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notif = self.get_object()
        notif.lue = True
        notif.save()
        return Response({'status': 'ok'})

class LitigeViewSet(viewsets.ModelViewSet):
    serializer_class = LitigeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Litige.objects.select_related('contravention', 'contravention__citoyen', 'contravention__infraction')
        if user.is_admin_role():
            return qs.all()
        elif user.is_citoyen_role():
            return qs.filter(contravention__citoyen=user)
        return qs.none()

    def perform_create(self, serializer):
        contravention_id = self.request.data.get('contravention_id')
        contravention = Contravention.objects.get(id=contravention_id)
        serializer.save(contravention=contravention)

    @action(detail=True, methods=['post'])
    def traiter(self, request, pk=None):
        if not request.user.is_admin_role():
            return Response({'error': 'Unauthorized'}, status=403)
        litige = self.get_object()
        decision_status = request.data.get('statut')
        decision_text = request.data.get('decision', '')
        
        if decision_status in [Litige.STATUT_ACCEPTE, Litige.STATUT_REJETE]:
            litige.statut = decision_status
            litige.decision = decision_text
            litige.save()
            
            # Modifier statut contravention si accepté
            if decision_status == Litige.STATUT_ACCEPTE:
                litige.contravention.statut = Contravention.STATUT_ANNULEE
                litige.contravention.save()
            
            # Notifier
            Notification.objects.create(
                utilisateur=litige.contravention.citoyen,
                titre="Décision sur votre contestation",
                message=f"Votre contestation pour le PV {litige.contravention.numero} a été {decision_status.lower()}."
            )
            return Response({'status': 'ok'})
        return Response({'error': 'Invalid status'}, status=400)

