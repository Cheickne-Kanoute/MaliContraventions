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
def agents_list_view(request):
    if not request.user.is_admin_role():
        messages.error(request, "Accès réservé aux administrateurs.")
        return redirect('dashboard')

    if request.method == 'POST':
        form = AgentCreationForm(request.POST)
        if form.is_valid():
            agent = form.save()
            messages.success(request, f"L'agent {agent.get_full_name_or_username()} (Matricule: {agent.badge_agent}) a été créé avec succès. Il peut maintenant se connecter.")
            return redirect('agents_list')
        else:
            messages.error(request, f"Erreur lors de la création de l'agent : {form.errors.as_text()}")
    else:
        form = AgentCreationForm()

    agents = Utilisateur.objects.filter(role=Utilisateur.ROLE_AGENT).annotate(total_pv=Count('contraventions_creees')).order_by('-date_joined')
    return render(request, 'agents_list.html', {'agents': agents, 'form': form})

@login_required
def agent_toggle_view(request, pk):
    if not request.user.is_admin_role():
        messages.error(request, "Accès réservé aux administrateurs.")
        return redirect('dashboard')

    agent = get_object_or_404(Utilisateur, pk=pk, role=Utilisateur.ROLE_AGENT)
    agent.is_active = not agent.is_active
    agent.save()
    status_str = "activé" if agent.is_active else "désactivé"
    messages.success(request, f"Le compte de l'agent {agent.get_full_name_or_username()} a été {status_str}.")
    return redirect('agents_list')

@login_required
def agent_edit_view(request, pk):
    if not request.user.is_admin_role():
        messages.error(request, "Accès réservé aux administrateurs.")
        return redirect('dashboard')

    agent = get_object_or_404(Utilisateur, pk=pk, role=Utilisateur.ROLE_AGENT)
    if request.method == 'POST':
        form = AgentEditForm(request.POST, instance=agent)
        if form.is_valid():
            form.save()
            new_pass = request.POST.get('new_password')
            if new_pass and new_pass.strip():
                agent.set_password(new_pass.strip())
                agent.save()
            messages.success(request, f"Le compte de l'agent {agent.get_full_name_or_username()} a été mis à jour.")
        else:
            messages.error(request, f"Erreur lors de la modification : {form.errors.as_text()}")
    return redirect('agents_list')

@login_required
def agent_delete_view(request, pk):
    if not request.user.is_admin_role():
        messages.error(request, "Accès réservé aux administrateurs.")
        return redirect('dashboard')

    agent = get_object_or_404(Utilisateur, pk=pk, role=Utilisateur.ROLE_AGENT)
    if agent.contraventions_creees.exists():
        messages.error(request, f"Impossible de supprimer l'agent {agent.get_full_name_or_username()} car il possède {agent.contraventions_creees.count()} PV enregistrés à son nom. Vous pouvez désactiver son compte.")
    else:
        agent.delete()
        messages.success(request, f"Le compte agent {agent.get_full_name_or_username()} a été supprimé définitivement.")
    return redirect('agents_list')

@login_required
def registre_nina_list_view(request):
    if not (request.user.is_admin_role() or request.user.is_agent_role()):
        messages.error(request, "Accès réservé aux agents et administrateurs.")
        return redirect('dashboard')

    query = request.GET.get('q', '').strip()
    queryset = RegistreNationalNINA.objects.all()

    if query:
        queryset = queryset.filter(
            Q(nin_nina__icontains=query) |
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(telephone__icontains=query) |
            Q(numero_permis__icontains=query) |
            Q(immatriculation_vehicule__icontains=query)
        )

    paginator = Paginator(queryset, 25)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    total_citoyens = RegistreNationalNINA.objects.count()

    context = {
        'page_obj': page_obj,
        'query': query,
        'total_citoyens': total_citoyens,
    }
    return render(request, 'registre_nina_list.html', context)

@login_required
def api_recherche_nina(request):
    query = request.GET.get('q', '').strip()
    if not query or len(query) < 2:
        return JsonResponse({'results': []})

    results = RegistreNationalNINA.objects.filter(
        Q(nin_nina__icontains=query) |
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(telephone__icontains=query) |
        Q(immatriculation_vehicule__icontains=query)
    )[:10]

    data = [
        {
            'id': c.pk,
            'nin_nina': c.nin_nina,
            'nom_complet': c.get_full_name(),
            'telephone': c.telephone,
            'numero_permis': c.numero_permis,
            'statut_permis': c.get_statut_permis_display(),
            'commune': c.commune,
            'adresse_quartier': c.adresse_quartier,
            'immatriculation_vehicule': c.immatriculation_vehicule,
        }
        for c in results
    ]
    return JsonResponse({'results': data})

