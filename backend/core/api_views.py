from rest_framework import viewsets, permissions
from .models import Utilisateur, Infraction, Contravention, Paiement
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

