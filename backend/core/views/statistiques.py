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
def statistiques_view(request):
    if not (request.user.is_admin_role() or request.user.is_agent_role()):
        messages.error(request, "Accès réservé aux agents et administrateurs.")
        return redirect('dashboard')

    total_pv = Contravention.objects.count()
    total_payees = Contravention.objects.filter(statut=Contravention.STATUT_PAYEE).count()
    total_validees = Contravention.objects.filter(statut=Contravention.STATUT_VALIDEE).count()
    total_en_attente = Contravention.objects.filter(statut=Contravention.STATUT_EN_ATTENTE).count()
    total_annulees = Contravention.objects.filter(statut=Contravention.STATUT_ANNULEE).count()

    total_recettes = Paiement.objects.aggregate(total=Sum('montant'))['total'] or 0

    repartition_communes = Contravention.objects.values('commune').annotate(
        count=Count('id'), total_montant=Sum('montant')
    ).order_by('-count')

    repartition_gravite = Infraction.objects.values('degre_gravite').annotate(
        count=Count('contraventions')
    ).order_by('degre_gravite')

    repartition_vehicules = Contravention.objects.values('type_vehicule').annotate(
        count=Count('id')
    ).order_by('-count')

    context = {
        'total_pv': total_pv,
        'total_payees': total_payees,
        'total_validees': total_validees,
        'total_en_attente': total_en_attente,
        'total_annulees': total_annulees,
        'total_recettes': total_recettes,
        'repartition_communes': repartition_communes,
        'repartition_gravite': repartition_gravite,
        'repartition_vehicules': repartition_vehicules,
    }
    return render(request, 'statistiques.html', context)

@login_required
def export_contraventions_csv(request):
    if not (request.user.is_admin_role() or request.user.is_agent_role()):
        messages.error(request, "Accès réservé aux agents et administrateurs.")
        return redirect('dashboard')

    response = HttpResponse(content_type='text/csv; charset=utf-8-sig')
    response['Content-Disposition'] = 'attachment; filename="rapport_contraventions_mali.csv"'

    writer = csv.writer(response, delimiter=';')
    writer.writerow([
        'N° PV', 'Date Constatation', 'Agent', 'Contrevenant',
        'Immatriculation', 'Type Véhicule', 'Infraction', 'Montant (FCFA)',
        'Commune', 'Lieu', 'Statut'
    ])

    contraventions = Contravention.objects.select_related('agent', 'citoyen', 'infraction').all().order_by('-date_contravention')
    for c in contraventions:
        agent_name = c.agent.get_full_name_or_username() if c.agent else "N/A"
        citoyen_name = c.citoyen.get_full_name_or_username() if c.citoyen else "N/A"
        writer.writerow([
            c.numero,
            c.date_contravention.strftime('%d/%m/%Y %H:%M'),
            agent_name,
            citoyen_name,
            c.immatriculation_vehicule,
            c.get_type_vehicule_display(),
            c.infraction.libelle,
            int(c.montant),
            c.commune,
            c.lieu_adresse,
            c.get_statut_display()
        ])

    return response

