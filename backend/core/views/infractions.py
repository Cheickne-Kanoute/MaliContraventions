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
def infractions_list_view(request):
    if not request.user.is_admin_role():
        messages.error(request, "Accès réservé aux administrateurs.")
        return redirect('dashboard')

    if request.method == 'POST':
        form = InfractionForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Nouvelle infraction ajoutée avec succès au catalogue.")
            return redirect('infractions_list')
        else:
            messages.error(request, "Erreur lors de l'ajout de l'infraction.")
    else:
        form = InfractionForm()

    infractions = Infraction.objects.all().annotate(total_cas=Count('contraventions'))
    return render(request, 'infractions_list.html', {'infractions': infractions, 'form': form})

@login_required
def infraction_toggle_view(request, pk):
    if not request.user.is_admin_role():
        messages.error(request, "Accès non autorisé.")
        return redirect('dashboard')

    infraction = get_object_or_404(Infraction, pk=pk)
    infraction.statut_actif = not infraction.statut_actif
    infraction.save()
    status_str = "activée" if infraction.statut_actif else "désactivée"
    messages.success(request, f"L'infraction {infraction.code} a été {status_str}.")
    return redirect('infractions_list')

@login_required
def infraction_edit_view(request, pk):
    if not request.user.is_admin_role():
        messages.error(request, "Accès réservé aux administrateurs.")
        return redirect('dashboard')

    infraction = get_object_or_404(Infraction, pk=pk)
    if request.method == 'POST':
        form = InfractionForm(request.POST, instance=infraction)
        if form.is_valid():
            form.save()
            messages.success(request, f"L'infraction {infraction.code} a été mise à jour avec succès.")
        else:
            messages.error(request, f"Erreur lors de la modification de l'infraction : {form.errors.as_text()}")
    return redirect('infractions_list')

@login_required
def infraction_delete_view(request, pk):
    if not request.user.is_admin_role():
        messages.error(request, "Accès réservé aux administrateurs.")
        return redirect('dashboard')

    infraction = get_object_or_404(Infraction, pk=pk)
    if infraction.contraventions.exists():
        messages.error(request, f"Impossible de supprimer l'infraction {infraction.code} car elle est associée à des procès-verbaux enregistrés. Vous pouvez plutôt la désactiver.")
    else:
        code = infraction.code
        infraction.delete()
        messages.success(request, f"L'infraction {code} a été supprimée du catalogue.")
    return redirect('infractions_list')

def code_route_view(request):
    infractions = Infraction.objects.filter(statut_actif=True).order_by('degre_gravite', 'code')
    return render(request, 'code_route.html', {'infractions': infractions})

