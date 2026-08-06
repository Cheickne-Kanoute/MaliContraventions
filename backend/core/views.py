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
from .models import Utilisateur, Infraction, Contravention, Paiement, Notification, RegistreNationalNINA
from .forms import InscriptionCitoyenForm, AgentCreationForm, AgentEditForm, ContraventionForm, InfractionForm, PaiementForm


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


@login_required
def dashboard_view(request):
    user = request.user

    if user.is_admin_role():
        total_contraventions = Contravention.objects.count()
        en_attente = Contravention.objects.filter(statut=Contravention.STATUT_EN_ATTENTE).count()
        validees = Contravention.objects.filter(statut=Contravention.STATUT_VALIDEE).count()
        payees = Contravention.objects.filter(statut=Contravention.STATUT_PAYEE).count()
        annulees = Contravention.objects.filter(statut=Contravention.STATUT_ANNULEE).count()

        total_recettes = Paiement.objects.aggregate(total=Sum('montant'))['total'] or 0
        montant_impaye = Contravention.objects.filter(statut=Contravention.STATUT_VALIDEE).aggregate(total=Sum('montant'))['total'] or 0

        contraventions_recentes = Contravention.objects.select_related('agent', 'citoyen', 'infraction')[:10]
        repartition_communes = Contravention.objects.values('commune').annotate(count=Count('id')).order_by('-count')

        context = {
            'role_view': 'ADMIN',
            'total_contraventions': total_contraventions,
            'en_attente': en_attente,
            'validees': validees,
            'payees': payees,
            'annulees': annulees,
            'total_recettes': total_recettes,
            'montant_impaye': montant_impaye,
            'contraventions_recentes': contraventions_recentes,
            'repartition_communes': repartition_communes,
            'google_maps_api_key': settings.GOOGLE_MAPS_API_KEY,
        }
        return render(request, 'dashboard.html', context)

    elif user.is_agent_role():
        mes_contraventions = Contravention.objects.filter(agent=user).select_related('citoyen', 'infraction')
        total_creees = mes_contraventions.count()
        en_attente = mes_contraventions.filter(statut=Contravention.STATUT_EN_ATTENTE).count()
        validees = mes_contraventions.filter(statut=Contravention.STATUT_VALIDEE).count()
        payees = mes_contraventions.filter(statut=Contravention.STATUT_PAYEE).count()

        context = {
            'role_view': 'AGENT',
            'total_creees': total_creees,
            'en_attente': en_attente,
            'validees': validees,
            'payees': payees,
            'contraventions_recentes': mes_contraventions[:10],
        }
        return render(request, 'dashboard.html', context)

    else: # CITOYEN
        mes_fines = Contravention.objects.filter(citoyen=user).select_related('infraction', 'agent')
        total_fines = mes_fines.count()
        a_payer = mes_fines.filter(statut__in=[Contravention.STATUT_VALIDEE, Contravention.STATUT_EN_ATTENTE])
        payees = mes_fines.filter(statut=Contravention.STATUT_PAYEE)

        montant_du = a_payer.filter(statut=Contravention.STATUT_VALIDEE).aggregate(total=Sum('montant'))['total'] or 0
        total_paye = payees.aggregate(total=Sum('montant'))['total'] or 0

        context = {
            'role_view': 'CITOYEN',
            'total_fines': total_fines,
            'a_payer_count': a_payer.count(),
            'payees_count': payees.count(),
            'montant_du': montant_du,
            'total_paye': total_paye,
            'mes_contraventions': mes_fines,
        }
        return render(request, 'dashboard.html', context)


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


@login_required
def contravention_create_view(request):
    # Only Admin or Agent can create contraventions
    if not (request.user.is_admin_role() or request.user.is_agent_role()):
        messages.error(request, "Accès refusé.")
        return redirect('dashboard')
        
    if request.method == 'POST':
        form = ContraventionForm(request.POST)
        if form.is_valid():
            contravention = form.save(commit=False)
            contravention.agent = request.user
            
            # Link NINA citizen from live search
            nina_id = request.POST.get('nina_id')
            if nina_id and str(nina_id).isdigit():
                fiche = RegistreNationalNINA.objects.filter(pk=int(nina_id)).first()
                if fiche:
                    contravention.fiche_nina = fiche
                    contravention.nom_contrevenant_saisi = f"{fiche.get_full_name()} ({fiche.nin_nina})"
                    if fiche.utilisateur:
                        contravention.citoyen = fiche.utilisateur

            # Auto calculate amount from selected infraction
            infraction = contravention.infraction
            contravention.montant = infraction.montant

            # Auto generate CTR unique number
            rand_suffix = ''.join(random.choices(string.digits, k=4))
            year = timezone.now().year
            contravention.numero = f"CTR-BKO-{year}-{rand_suffix}"

            contravention.save()

            # Gestion de la Géolocalisation
            latitude = request.POST.get('gps_latitude')
            longitude = request.POST.get('gps_longitude')
            if latitude and longitude:
                try:
                    from .models import GPSLocation
                    GPSLocation.objects.create(
                        contravention=contravention,
                        latitude=float(latitude),
                        longitude=float(longitude)
                    )
                except ValueError:
                    pass

            # Create notification for citizen
            if contravention.citoyen:
                Notification.objects.create(
                    utilisateur=contravention.citoyen,
                    titre=f"Nouvelle contravention {contravention.numero}",
                    message=f"Une contravention pour '{infraction.libelle}' a été enregistrée à votre nom (Montant: {contravention.montant:,.0f} FCFA)."
                )

            messages.success(request, f"Contravention {contravention.numero} créée avec succès (Statut: En attente) !")
            return redirect('contravention_detail', pk=contravention.pk)
        else:
            messages.error(request, "Erreur dans le formulaire de verbalisation.")
    else:
        form = ContraventionForm()

    return render(request, 'contravention_create.html', {'form': form})


@login_required
def contravention_detail_view(request, pk):
    contravention = get_object_or_404(
        Contravention.objects.select_related('agent', 'citoyen', 'infraction'), pk=pk
    )

    # Permission check for citizen
    if request.user.is_citoyen_role() and contravention.citoyen != request.user:
        messages.error(request, "Vous n'êtes pas autorisé à consulter cette contravention.")
        return redirect('dashboard')

    paiement_form = PaiementForm()
    paiement = getattr(contravention, 'paiement', None)

    context = {
        'contravention': contravention,
        'paiement': paiement,
        'paiement_form': paiement_form,
    }
    return render(request, 'contravention_detail.html', context)


@login_required
def valider_contravention_view(request, pk):
    if not request.user.is_admin_role():
        messages.error(request, "Seul un administrateur peut valider une contravention.")
        return redirect('dashboard')

    contravention = get_object_or_404(Contravention, pk=pk)
    contravention.statut = Contravention.STATUT_VALIDEE
    contravention.save()

    if contravention.citoyen:
        Notification.objects.create(
            utilisateur=contravention.citoyen,
            titre=f"Contravention {contravention.numero} Validée",
            message=f"Votre contravention N° {contravention.numero} a été validée. Vous pouvez procéder au paiement de l'amende."
        )

    messages.success(request, f"La contravention {contravention.numero} a été validée avec succès.")
    return redirect('contravention_detail', pk=contravention.pk)


@login_required
def rejeter_contravention_view(request, pk):
    if not request.user.is_admin_role():
        messages.error(request, "Seul un administrateur peut rejeter une contravention.")
        return redirect('dashboard')

    contravention = get_object_or_404(Contravention, pk=pk)
    contravention.statut = Contravention.STATUT_ANNULEE
    contravention.save()

    messages.warning(request, f"La contravention {contravention.numero} a été annulée/rejetée.")
    return redirect('contravention_detail', pk=contravention.pk)


@login_required
def payer_contravention_view(request, pk):
    contravention = get_object_or_404(Contravention, pk=pk)

    if request.user.is_citoyen_role() and contravention.citoyen != request.user:
        messages.error(request, "Seul le citoyen titulaire peut régler cette contravention.")
        return redirect('dashboard')

    if contravention.statut == Contravention.STATUT_PAYEE:
        messages.info(request, "Cette contravention a déjà été acquittée.")
        return redirect('contravention_detail', pk=contravention.pk)

    if request.method == 'POST':
        form = PaiementForm(request.POST)
        if form.is_valid():
            mode = form.cleaned_dict['mode_paiement'] if hasattr(form, 'cleaned_dict') else form.cleaned_data['mode_paiement']
            
            # Generate simulated transaction reference
            rand_code = ''.join(random.choices(string.digits, k=8))
            prefix = "OM" if mode == Paiement.MODE_ORANGE_MONEY else ("MOOV" if mode == Paiement.MODE_MOOV_MONEY else "PAY")
            ref = f"PAY-{prefix}-{rand_code}"

            Paiement.objects.create(
                contravention=contravention,
                montant=contravention.montant,
                reference=ref,
                mode_paiement=mode,
                statut='SUCCES'
            )

            contravention.statut = Contravention.STATUT_PAYEE
            contravention.save()

            # Create notification
            if contravention.citoyen:
                Notification.objects.create(
                    utilisateur=contravention.citoyen,
                    titre=f"Paiement Confirmé - {contravention.numero}",
                    message=f"Le paiement de {contravention.montant:,.0f} FCFA pour la contravention {contravention.numero} a été effectué avec succès. Réf: {ref}."
                )

            messages.success(request, f"Paiement simulé avec succès ! Reçu de paiement généré (Réf: {ref}).")
            return redirect('contravention_detail', pk=contravention.pk)

    return redirect('contravention_detail', pk=contravention.pk)


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


@login_required
def notifications_list_view(request):
    notifications = Notification.objects.filter(utilisateur=request.user).order_by('-date_creation')
    Notification.objects.filter(utilisateur=request.user, lue=False).update(lue=True)
    return render(request, 'notifications_list.html', {'notifications': notifications})


def verifier_pv_view(request):
    query = request.GET.get('q', '').strip()
    contravention = None
    paiement = None
    searched = False

    if query:
        searched = True
        contravention = Contravention.objects.filter(
            Q(numero__iexact=query) | Q(paiement__reference__iexact=query)
        ).first()
        if contravention and hasattr(contravention, 'paiement'):
            paiement = contravention.paiement

    return render(request, 'verifier_pv.html', {
        'query': query,
        'contravention': contravention,
        'paiement': paiement,
        'searched': searched,
    })


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

def code_route_view(request):
    infractions = Infraction.objects.filter(statut_actif=True).order_by('degre_gravite', 'code')
    return render(request, 'code_route.html', {'infractions': infractions})

def contravention_pdf_view(request, pk):
    from .pdf_utils import generer_pdf_contravention
    contravention = get_object_or_404(Contravention, pk=pk)
    
    # Check permissions
    if not request.user.is_admin_role() and not request.user.is_agent_role() and contravention.citoyen != request.user:
        messages.error(request, "Accès refusé.")
        return redirect('dashboard')
        
    pdf_buffer = generer_pdf_contravention(contravention, request)
    response = HttpResponse(pdf_buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="contravention_{contravention.numero}.pdf"'
    return response

@login_required
def contester_contravention_view(request, pk):
    from .forms import LitigeForm
    from .models import Litige
    contravention = get_object_or_404(Contravention, pk=pk)
    
    # Seul le citoyen concerné peut contester, et si la contravention est VALIDEE
    if contravention.citoyen != request.user or contravention.statut != Contravention.STATUT_VALIDEE:
        messages.error(request, "Vous ne pouvez pas contester cette contravention.")
        return redirect('dashboard')
        
    if hasattr(contravention, 'litige'):
        messages.warning(request, "Un litige est déjà en cours pour cette contravention.")
        return redirect('contravention_detail', pk=contravention.pk)
        
    if request.method == 'POST':
        form = LitigeForm(request.POST, request.FILES)
        if form.is_valid():
            litige = form.save(commit=False)
            litige.contravention = contravention
            litige.save()
            messages.success(request, "Votre contestation a bien été soumise et est en attente de traitement.")
            return redirect('contravention_detail', pk=contravention.pk)
    else:
        form = LitigeForm()
        
    return render(request, 'contester_contravention.html', {'form': form, 'contravention': contravention})

@login_required
def litiges_list_view(request):
    from .models import Litige
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
    from .models import Litige, Contravention, Notification
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


@login_required
def api_contraventions_geoloc(request):
    from .models import GPSLocation
    if not request.user.is_admin_role() and not request.user.is_agent_role():
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    queryset = GPSLocation.objects.select_related('contravention', 'contravention__infraction')
    if request.user.is_agent_role():
        queryset = queryset.filter(contravention__agent=request.user)

    data = []
    for loc in queryset.all():
        data.append({
            'lat': loc.latitude,
            'lng': loc.longitude,
            'numero': loc.contravention.numero,
            'infraction': loc.contravention.infraction.libelle,
            'montant': loc.contravention.montant,
            'date': loc.contravention.date_contravention.strftime('%d/%m/%Y'),
            'statut': loc.contravention.statut
        })
    return JsonResponse({'locations': data})


