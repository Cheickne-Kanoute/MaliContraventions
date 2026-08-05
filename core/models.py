from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class Utilisateur(AbstractUser):
    ROLE_ADMIN = 'ADMIN'
    ROLE_AGENT = 'AGENT'
    ROLE_CITOYEN = 'CITOYEN'

    ROLE_CHOICES = [
        (ROLE_ADMIN, 'Administrateur'),
        (ROLE_AGENT, 'Agent Verbalisateur'),
        (ROLE_CITOYEN, 'Citoyen'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_CITOYEN)
    telephone = models.CharField(max_length=30, blank=True, null=True, verbose_name="Numéro de téléphone")
    nin_carte_identite = models.CharField(max_length=50, blank=True, null=True, verbose_name="NIN / Carte d'identité")
    adresse = models.CharField(max_length=255, blank=True, null=True, verbose_name="Adresse de résidence")
    
    # Informations Agent
    badge_agent = models.CharField(max_length=50, blank=True, null=True, verbose_name="Numéro de matricule / Badge")
    service_agent = models.CharField(max_length=100, blank=True, null=True, verbose_name="Service (ex. CCR, Gendarmerie)")

    def is_admin_role(self):
        return self.role == self.ROLE_ADMIN or self.is_superuser

    def is_agent_role(self):
        return self.role == self.ROLE_AGENT

    def is_citoyen_role(self):
        return self.role == self.ROLE_CITOYEN

    def get_full_name_or_username(self):
        full = f"{self.first_name} {self.last_name}".strip()
        return full if full else self.username

    def __str__(self):
        return f"{self.get_full_name_or_username()} ({self.get_role_display()})"


class Infraction(models.Model):
    GRAVITE_MINEURE = 'MINEURE'
    GRAVITE_MOYENNE = 'MOYENNE'
    GRAVITE_GRAVE = 'GRAVE'
    GRAVITE_CRITIQUE = 'CRITIQUE'

    GRAVITE_CHOICES = [
        (GRAVITE_MINEURE, 'Mineure'),
        (GRAVITE_MOYENNE, 'Moyenne'),
        (GRAVITE_GRAVE, 'Grave'),
        (GRAVITE_CRITIQUE, 'Critique'),
    ]

    code = models.CharField(max_length=20, unique=True, blank=True, verbose_name="Code Infraction")
    libelle = models.CharField(max_length=200, verbose_name="Libellé de l'infraction")
    montant = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Montant de l'amende (FCFA)")
    degre_gravite = models.CharField(max_length=20, choices=GRAVITE_CHOICES, default=GRAVITE_MOYENNE)
    description = models.TextField(blank=True, null=True)
    statut_actif = models.BooleanField(default=True, verbose_name="Infraction Active")
    date_creation = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.code:
            existing_codes = Infraction.objects.values_list('code', flat=True)
            max_num = 0
            for c in existing_codes:
                if c and c.startswith('INF-'):
                    try:
                        num = int(c.replace('INF-', ''))
                        if num > max_num:
                            max_num = num
                    except ValueError:
                        pass
            next_num = max_num + 1
            code_candidate = f"INF-{next_num:03d}"
            while Infraction.objects.filter(code=code_candidate).exists():
                next_num += 1
                code_candidate = f"INF-{next_num:03d}"
            self.code = code_candidate
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.code} - {self.libelle} ({self.montant:,.0f} FCFA)"

    class Meta:
        ordering = ['code']


class Contravention(models.Model):
    STATUT_EN_ATTENTE = 'EN_ATTENTE'
    STATUT_VALIDEE = 'VALIDEE'
    STATUT_PAYEE = 'PAYEE'
    STATUT_ANNULEE = 'ANNULEE'

    STATUT_CHOICES = [
        (STATUT_EN_ATTENTE, 'En attente de validation'),
        (STATUT_VALIDEE, 'Validée (Impayée)'),
        (STATUT_PAYEE, 'Payée'),
        (STATUT_ANNULEE, 'Annulée / Rejetée'),
    ]

    VEHICULE_MOTO = 'MOTO'
    VEHICULE_VOITURE = 'VOITURE'
    VEHICULE_CAMION = 'CAMION'
    VEHICULE_SOTRAMA = 'MINIBUS_SOTRAMA'
    VEHICULE_AUTRE = 'AUTRE'

    VEHICULE_CHOICES = [
        (VEHICULE_MOTO, 'Moto / Deux-roues'),
        (VEHICULE_VOITURE, 'Voiture de tourisme'),
        (VEHICULE_CAMION, 'Camion / Poids lourd'),
        (VEHICULE_SOTRAMA, 'Minibus (Sotrama / Dourouni)'),
        (VEHICULE_AUTRE, 'Autre véhicule'),
    ]

    COMMUNE_CHOICES = [
        ('Commune I', 'Bamako - Commune I'),
        ('Commune II', 'Bamako - Commune II'),
        ('Commune III', 'Bamako - Commune III'),
        ('Commune IV', 'Bamako - Commune IV'),
        ('Commune V', 'Bamako - Commune V'),
        ('Commune VI', 'Bamako - Commune VI'),
        ('Kati', 'Kati'),
        ('Autre', 'Autre localité'),
    ]

    numero = models.CharField(max_length=50, unique=True, verbose_name="Numéro Contravention")
    agent = models.ForeignKey(
        Utilisateur, on_delete=models.SET_NULL, null=True,
        related_name='contraventions_creees', limit_choices_to={'role': Utilisateur.ROLE_AGENT}
    )
    citoyen = models.ForeignKey(
        Utilisateur, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='contraventions_citoyen', limit_choices_to={'role': Utilisateur.ROLE_CITOYEN}
    )
    fiche_nina = models.ForeignKey('RegistreNationalNINA', on_delete=models.SET_NULL, null=True, blank=True, related_name='contraventions')
    nom_contrevenant_saisi = models.CharField(max_length=200, blank=True, null=True, verbose_name="Nom complet contrevenant NINA")

    infraction = models.ForeignKey(Infraction, on_delete=models.PROTECT, related_name='contraventions')
    immatriculation_vehicule = models.CharField(max_length=50, verbose_name="Immatriculation du véhicule")
    type_vehicule = models.CharField(max_length=30, choices=VEHICULE_CHOICES, default=VEHICULE_VOITURE)
    
    date_contravention = models.DateTimeField(default=timezone.now, verbose_name="Date & Heure de la constatation")
    lieu_adresse = models.CharField(max_length=255, verbose_name="Lieu de l'infraction / Adresse")
    commune = models.CharField(max_length=50, choices=COMMUNE_CHOICES, default='Commune III')
    
    montant = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Montant à payer (FCFA)")
    statut = models.CharField(max_length=30, choices=STATUT_CHOICES, default=STATUT_EN_ATTENTE)
    notes = models.TextField(blank=True, null=True, verbose_name="Observations / Remarques de l'agent")
    
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    @property
    def nom_citoyen_affiche(self):
        if self.citoyen:
            return self.citoyen.get_full_name_or_username()
        elif self.fiche_nina:
            return f"{self.fiche_nina.get_full_name()} ({self.fiche_nina.nin_nina})"
        elif self.nom_contrevenant_saisi:
            return self.nom_contrevenant_saisi
        return "Citoyen Non Identifié"

    def __str__(self):
        return f"{self.numero} - {self.immatriculation_vehicule} ({self.get_statut_display()})"

    class Meta:
        ordering = ['-date_contravention']


class Paiement(models.Model):
    MODE_ORANGE_MONEY = 'ORANGE_MONEY'
    MODE_MOOV_MONEY = 'MOOV_MONEY'
    MODE_CARTE_BANCAIRE = 'CARTE_BANCAIRE'
    MODE_ESPECES = 'ESPECES'

    MODE_CHOICES = [
        (MODE_ORANGE_MONEY, 'Orange Money'),
        (MODE_MOOV_MONEY, 'Moov Money (Moov Africa)'),
        (MODE_CARTE_BANCAIRE, 'Carte Bancaire (UBA / BDM / BDMS)'),
        (MODE_ESPECES, 'Espèces au guichet'),
    ]

    contravention = models.OneToOneField(Contravention, on_delete=models.CASCADE, related_name='paiement')
    montant = models.DecimalField(max_digits=12, decimal_places=2)
    date_paiement = models.DateTimeField(default=timezone.now)
    reference = models.CharField(max_length=100, unique=True, verbose_name="Référence Transaction")
    mode_paiement = models.CharField(max_length=30, choices=MODE_CHOICES, default=MODE_ORANGE_MONEY)
    statut = models.CharField(max_length=20, default='SUCCES')

    def __str__(self):
        return f"Paiement {self.reference} - {self.montant:,.0f} FCFA ({self.contravention.numero})"


class Notification(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='notifications')
    titre = models.CharField(max_length=150)
    message = models.TextField()
    lue = models.BooleanField(default=False)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notif à {self.utilisateur.username}: {self.titre}"

    class Meta:
        ordering = ['-date_creation']


class RegistreNationalNINA(models.Model):
    STATUT_PERMIS_VALIDE = 'VALIDE'
    STATUT_PERMIS_SUSPENDU = 'SUSPENDU'
    STATUT_PERMIS_EXPIRE = 'EXPIRE'

    STATUT_PERMIS_CHOICES = [
        (STATUT_PERMIS_VALIDE, 'Permis Valide'),
        (STATUT_PERMIS_SUSPENDU, 'Permis Suspendu'),
        (STATUT_PERMIS_EXPIRE, 'Permis Expiré'),
    ]

    nin_nina = models.CharField(max_length=50, unique=True, db_index=True, verbose_name="Numéro NINA / NIN")
    first_name = models.CharField(max_length=100, verbose_name="Prénom")
    last_name = models.CharField(max_length=100, verbose_name="Nom de famille")
    telephone = models.CharField(max_length=30, db_index=True, verbose_name="Numéro de téléphone")
    numero_permis = models.CharField(max_length=50, blank=True, verbose_name="N° Permis de conduire")
    statut_permis = models.CharField(max_length=20, choices=STATUT_PERMIS_CHOICES, default=STATUT_PERMIS_VALIDE)
    adresse_quartier = models.CharField(max_length=150, verbose_name="Adresse / Quartier")
    commune = models.CharField(max_length=50, verbose_name="Commune de résidence")
    immatriculation_vehicule = models.CharField(max_length=50, blank=True, verbose_name="Véhicule principal immatriculé")
    utilisateur = models.OneToOneField(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='fiche_nina')

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return f"{self.nin_nina} - {self.get_full_name()} ({self.telephone})"

    class Meta:
        ordering = ['last_name', 'first_name']
