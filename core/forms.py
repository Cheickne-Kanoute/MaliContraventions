from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Utilisateur, Contravention, Infraction, Paiement

class InscriptionCitoyenForm(UserCreationForm):
    first_name = forms.CharField(max_length=50, required=True, label="Prénom")
    last_name = forms.CharField(max_length=50, required=True, label="Nom")
    telephone = forms.CharField(max_length=30, required=True, label="Numéro de téléphone")
    nin_carte_identite = forms.CharField(max_length=50, required=False, label="NIN / Carte d'identité NINA")
    adresse = forms.CharField(max_length=255, required=False, label="Adresse / Quartier")

    class Meta(UserCreationForm.Meta):
        model = Utilisateur
        fields = ('username', 'first_name', 'last_name', 'email', 'telephone', 'nin_carte_identite', 'adresse')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = Utilisateur.ROLE_CITOYEN
        if commit:
            user.save()
        return user


class AgentCreationForm(UserCreationForm):
    first_name = forms.CharField(max_length=50, required=True, label="Prénom")
    last_name = forms.CharField(max_length=50, required=True, label="Nom")
    telephone = forms.CharField(max_length=30, required=True, label="Numéro de téléphone")
    badge_agent = forms.CharField(max_length=50, required=True, label="Matricule / Badge Agent (ex. POL-9921)")
    service_agent = forms.CharField(max_length=100, required=False, label="Service / Compagnie", initial="Police Nationale / CCR")

    class Meta(UserCreationForm.Meta):
        model = Utilisateur
        fields = ('username', 'first_name', 'last_name', 'email', 'telephone', 'badge_agent', 'service_agent')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = Utilisateur.ROLE_AGENT
        if commit:
            user.save()
        return user


class AgentEditForm(forms.ModelForm):
    class Meta:
        model = Utilisateur
        fields = ['first_name', 'last_name', 'email', 'telephone', 'badge_agent', 'service_agent', 'is_active']
        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-control'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'telephone': forms.TextInput(attrs={'class': 'form-control'}),
            'badge_agent': forms.TextInput(attrs={'class': 'form-control'}),
            'service_agent': forms.TextInput(attrs={'class': 'form-control'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }


class ContraventionForm(forms.ModelForm):
    citoyen = forms.ModelChoiceField(
        queryset=Utilisateur.objects.filter(role=Utilisateur.ROLE_CITOYEN),
        empty_label="-- Aucun compte portail associé --",
        label="Citoyen Contrevenant",
        required=False,
        widget=forms.Select(attrs={'class': 'form-select', 'id': 'select-citoyen-hidden'})
    )
    infraction = forms.ModelChoiceField(
        queryset=Infraction.objects.filter(statut_actif=True),
        empty_label="-- Sélectionner l'infraction constatée --",
        label="Infraction Constatée",
        widget=forms.Select(attrs={'class': 'form-select', 'id': 'select-infraction'})
    )

    class Meta:
        model = Contravention
        fields = [
            'citoyen', 'infraction', 'immatriculation_vehicule',
            'type_vehicule', 'lieu_adresse', 'commune', 'notes'
        ]
        widgets = {
            'immatriculation_vehicule': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'ex. CH-9912-MD'}),
            'type_vehicule': forms.Select(attrs={'class': 'form-select'}),
            'lieu_adresse': forms.TextInput(attrs={'class': 'form-control', 'placeholder': "ex. Bd de l'Indépendance, près du monument"}),
            'commune': forms.Select(attrs={'class': 'form-select'}),
            'notes': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Circonstances particulières, remarques...'}),
        }


class InfractionForm(forms.ModelForm):
    class Meta:
        model = Infraction
        fields = ['libelle', 'montant', 'degre_gravite', 'description', 'statut_actif']
        widgets = {
            'libelle': forms.TextInput(attrs={'class': 'form-control', 'placeholder': "ex. Defaut d'assurance"}),
            'montant': forms.NumberInput(attrs={'class': 'form-control', 'step': '1000'}),
            'degre_gravite': forms.Select(attrs={'class': 'form-select'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
            'statut_actif': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }


class PaiementForm(forms.ModelForm):
    numero_telephone_paiement = forms.CharField(
        max_length=30, required=True, label="Numéro de téléphone de débit (Orange Money / Moov Money)",
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'ex. +223 70 00 00 00'})
    )

    class Meta:
        model = Paiement
        fields = ['mode_paiement']
        widgets = {
            'mode_paiement': forms.Select(attrs={'class': 'form-select'}),
        }
