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
                    from core.models import GPSLocation
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
    from core.forms import LitigeForm
    from core.models import Litige
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
def api_contraventions_geoloc(request):
    from core.models import GPSLocation
    if not request.user.is_admin_role() and not request.user.is_agent_role():
        return JsonResponse({'error': 'Unauthorized'}, status=403)
        
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
    return JsonResponse({'locations': data})

