import csv
import random
import string
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Sum, Count, Q
from django.utils import timezone
from django.core.paginator import Paginator
from django.http import JsonResponse, HttpResponse
from django.conf import settings
from core.models import Utilisateur, Infraction, Contravention, Paiement, Notification, RegistreNationalNINA
from core.forms import InscriptionCitoyenForm, AgentCreationForm, AgentEditForm, ContraventionForm, InfractionForm, PaiementForm


@login_required
def litiges_list_view(request):
    from core.models import Litige
    from django.core.paginator import Paginator
    if not request.user.is_admin_role() and not request.user.is_agent_role():
        messages.error(request, "Accès refusé.")
        return redirect('dashboard')
        
    statut_filter = request.GET.get('statut', '')
    litiges_qs = Litige.objects.all().select_related('contravention', 'contravention__citoyen')
    
    if statut_filter:
        litiges_qs = litiges_qs.filter(statut=statut_filter)
        
    paginator = Paginator(litiges_qs, 10)
    page_number = request.GET.get('page')
    litiges = paginator.get_page(page_number)
    
    return render(request, 'litiges_list.html', {'litiges': litiges, 'statut_filter': statut_filter})

@login_required
def traiter_litige_view(request, pk):
    from core.models import Litige, Contravention, Notification
    from django.utils import timezone
    if not request.user.is_admin_role():
        messages.error(request, "Seul un administrateur peut traiter les litiges.")
        return redirect('dashboard')
        
    litige = get_object_or_404(Litige, pk=pk)
    
    if request.method == 'POST':
        action = request.POST.get('action')
        decision_text = request.POST.get('decision', '')
        
        if action == 'ACCEPTER':
            litige.statut = Litige.STATUT_ACCEPTE
            litige.contravention.statut = Contravention.STATUT_ANNULEE
        elif action == 'REJETER':
            litige.statut = Litige.STATUT_REJETE
            litige.contravention.statut = Contravention.STATUT_VALIDEE
            
        litige.decision = decision_text
        litige.date_decision = timezone.now()
        litige.save()
        litige.contravention.save()
        
        # Notification au citoyen
        titre_notif = "Contestation acceptée" if action == 'ACCEPTER' else "Contestation rejetée"
        message_notif = f"Votre contestation pour le PV {litige.contravention.numero} a été traitée. Décision : {decision_text}"
        Notification.objects.create(
            utilisateur=litige.contravention.citoyen,
            titre=titre_notif,
            message=message_notif,
            type_notification='LITIGE'
        )
        
        messages.success(request, "Le litige a été traité avec succès.")
        return redirect('litiges_list')
        
    return render(request, 'litige_detail.html', {'litige': litige})

