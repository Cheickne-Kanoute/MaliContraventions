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


def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f"Bienvenue, {user.get_full_name_or_username()} !")
            return redirect('dashboard')
        else:
            messages.error(request, "Identifiants incorrects. Veuillez réessayer.")
    else:
        form = AuthenticationForm()

    # Pre-fill guidance users for quick demo testing
    demo_users = {
        'admin': Utilisateur.objects.filter(role=Utilisateur.ROLE_ADMIN).first(),
        'agent': Utilisateur.objects.filter(role=Utilisateur.ROLE_AGENT).first(),
        'citoyen': Utilisateur.objects.filter(role=Utilisateur.ROLE_CITOYEN).first(),
    }

    return render(request, 'login.html', {'form': form, 'demo_users': demo_users})

def register_citoyen_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == 'POST':
        form = InscriptionCitoyenForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Compte citoyen créé avec succès ! Bienvenue sur la plateforme.")
            return redirect('dashboard')
        else:
            messages.error(request, "Veuillez corriger les erreurs ci-dessous.")
    else:
        form = InscriptionCitoyenForm()

    return render(request, 'register.html', {'form': form})

def logout_view(request):
    logout(request)
    messages.info(request, "Vous avez été déconnecté avec succès.")
    return redirect('login')

