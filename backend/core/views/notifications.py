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
def notifications_list_view(request):
    notifications = Notification.objects.filter(utilisateur=request.user).order_by('-date_creation')
    Notification.objects.filter(utilisateur=request.user, lue=False).update(lue=True)
    return render(request, 'notifications_list.html', {'notifications': notifications})

