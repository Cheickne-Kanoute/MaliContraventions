from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import Utilisateur, Infraction, Contravention, Paiement, Notification
from datetime import timedelta

class Command(BaseCommand):
    help = "Remplit la base de données avec des données de démonstration crédibles pour la République du Mali."

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Effacement et réinitialisation des données de démonstration..."))

        # Clean existing non-superuser data
        Paiement.objects.all().delete()
        Notification.objects.all().delete()
        Contravention.objects.all().delete()
        Infraction.objects.all().delete()
        Utilisateur.objects.filter(is_superuser=False).delete()

        # 1. Création des utilisateurs
        self.stdout.write("Création des utilisateurs (Admin, Agents, Citoyens)...")

        admin = Utilisateur.objects.create_user(
            username='admin',
            email='admin@securite.gov.ml',
            password='admin123',
            first_name='Boubacar',
            last_name='DEMBELE',
            role=Utilisateur.ROLE_ADMIN,
            telephone='+223 76 00 11 22',
            badge_agent='ADM-001',
            service_agent='Direction Générale de la Police Nationale'
        )

        agent1 = Utilisateur.objects.create_user(
            username='agent1',
            email='agent1@police.gov.ml',
            password='agent123',
            first_name='Tahirou',
            last_name='DIAKITE',
            role=Utilisateur.ROLE_AGENT,
            telephone='+223 66 12 34 56',
            badge_agent='CCR-8821',
            service_agent='Compagnie de Circulation Routière (CCR)'
        )

        agent2 = Utilisateur.objects.create_user(
            username='agent2',
            email='agent2@police.gov.ml',
            password='agent123',
            first_name='Daouda',
            last_name='SAMAKE',
            role=Utilisateur.ROLE_AGENT,
            telephone='+223 70 99 88 77',
            badge_agent='GND-4012',
            service_agent='Gendarmerie Nationale'
        )

        citoyen1 = Utilisateur.objects.create_user(
            username='citoyen1',
            email='mamadou.traore@gmail.com',
            password='citoyen123',
            first_name='Mamadou',
            last_name='TRAORE',
            role=Utilisateur.ROLE_CITOYEN,
            telephone='+223 75 11 22 33',
            nin_carte_identite='1029384756-NINA',
            adresse='Hamdallaye ACI 2000, Bamako'
        )

        citoyen2 = Utilisateur.objects.create_user(
            username='citoyen2',
            email='mariam.diallo@yahoo.fr',
            password='citoyen123',
            first_name='Mariam',
            last_name='DIALLO',
            role=Utilisateur.ROLE_CITOYEN,
            telephone='+223 65 44 55 66',
            nin_carte_identite='9988776655-NINA',
            adresse='Badalabougou Sema, Commune V'
        )

        citoyen3 = Utilisateur.objects.create_user(
            username='citoyen3',
            email='oumar.coulibaly@maliweb.ml',
            password='citoyen123',
            first_name='Oumar',
            last_name='COULIBALY',
            role=Utilisateur.ROLE_CITOYEN,
            telephone='+223 78 88 99 00',
            nin_carte_identite='5544332211-NINA',
            adresse='Baco Djicoroni, Commune V'
        )

        # 2. Création des infractions
        self.stdout.write("Création du catalogue d'infractions...")

        inf_vitesse = Infraction.objects.create(
            code='INF-001',
            libelle='Excès de vitesse en agglomération',
            montant=20000.00,
            degre_gravite=Infraction.GRAVITE_GRAVE,
            description="Dépassement de la vitesse autorisée de plus de 20 km/h en zone urbaine.",
            statut_actif=True
        )

        inf_stationnement = Infraction.objects.create(
            code='INF-002',
            libelle='Stationnement interdit ou gênant',
            montant=10000.00,
            degre_gravite=Infraction.GRAVITE_MOYENNE,
            description="Stationnement sur voie réservée, trottoir ou zone d'arrêt d'urgence.",
            statut_actif=True
        )

        inf_feu = Infraction.objects.create(
            code='INF-003',
            libelle='Non-respect du feu rouge ou de priorité',
            montant=15000.00,
            degre_gravite=Infraction.GRAVITE_GRAVE,
            description="Franchissement d'une intersection au feu rouge ou refus de priorité à un carrefour.",
            statut_actif=True
        )

        inf_casque = Infraction.objects.create(
            code='INF-004',
            libelle='Défaut de casque ou ceinture de sécurité',
            montant=5000.00,
            degre_gravite=Infraction.GRAVITE_MINEURE,
            description="Conduite d'un deux-roues sans casque homologué ou d'un véhicule sans ceinture attachée.",
            statut_actif=True
        )

        inf_documents = Infraction.objects.create(
            code='INF-005',
            libelle='Défaut de permis de conduire ou carte grise',
            montant=25000.00,
            degre_gravite=Infraction.GRAVITE_CRITIQUE,
            description="Incapacité de présenter les documents légaux obligatoires du conducteur et du véhicule.",
            statut_actif=True
        )

        inf_telephone = Infraction.objects.create(
            code='INF-006',
            libelle='Usage du téléphone au volant',
            montant=10000.00,
            degre_gravite=Infraction.GRAVITE_MOYENNE,
            description="Tenue en main d'un téléphone portable en circulation.",
            statut_actif=True
        )

        # 3. Création des contraventions
        self.stdout.write("Création des contraventions types...")
        now = timezone.now()

        # Contravention 1 : Validée pour citoyen1 (Mamadou Traoré)
        c1 = Contravention.objects.create(
            numero='CTR-BKO-2026-1001',
            agent=agent1,
            citoyen=citoyen1,
            infraction=inf_vitesse,
            immatriculation_vehicule='CH-9982-MD',
            type_vehicule=Contravention.VEHICULE_VOITURE,
            date_contravention=now - timedelta(days=3),
            lieu_adresse="Avenue du Mali, près de l'Échangeur ACI 2000",
            commune='Commune IV',
            montant=inf_vitesse.montant,
            statut=Contravention.STATUT_VALIDEE,
            notes="Vitesse mesurée au radar mobile à 78 km/h (limite 50 km/h)."
        )

        # Contravention 2 : Payée par citoyen2 (Mariam Diallo)
        c2 = Contravention.objects.create(
            numero='CTR-BKO-2026-1002',
            agent=agent1,
            citoyen=citoyen2,
            infraction=inf_feu,
            immatriculation_vehicule='BA-4412-MD',
            type_vehicule=Contravention.VEHICULE_SOTRAMA,
            date_contravention=now - timedelta(days=5),
            lieu_adresse="Carrefour de la Paix, près du Pont Fahd",
            commune='Commune III',
            montant=inf_feu.montant,
            statut=Contravention.STATUT_PAYEE,
            notes="Franchissement direct du feu rouge au carrefour."
        )

        Paiement.objects.create(
            contravention=c2,
            montant=c2.montant,
            date_paiement=now - timedelta(days=4),
            reference='PAY-OM-891241',
            mode_paiement=Paiement.MODE_ORANGE_MONEY,
            statut='SUCCES'
        )

        # Contravention 3 : En attente pour citoyen3 (Oumar Coulibaly)
        c3 = Contravention.objects.create(
            numero='CTR-BKO-2026-1003',
            agent=agent2,
            citoyen=citoyen3,
            infraction=inf_telephone,
            immatriculation_vehicule='TG-1102-MD',
            type_vehicule=Contravention.VEHICULE_VOITURE,
            date_contravention=now - timedelta(hours=6),
            lieu_adresse="Boulevard de l'Indépendance, face à la Grande Mosquée",
            commune='Commune II',
            montant=inf_telephone.montant,
            statut=Contravention.STATUT_EN_ATTENTE,
            notes="Conducteur surpris en train de consulter son téléphone au volant."
        )

        # Contravention 4 : Annulée pour citoyen1
        c4 = Contravention.objects.create(
            numero='CTR-BKO-2026-1004',
            agent=agent2,
            citoyen=citoyen1,
            infraction=inf_stationnement,
            immatriculation_vehicule='CH-9982-MD',
            type_vehicule=Contravention.VEHICULE_VOITURE,
            date_contravention=now - timedelta(days=7),
            lieu_adresse="Quartier du Fleuve, près de la BCEAO",
            commune='Commune III',
            montant=inf_stationnement.montant,
            statut=Contravention.STATUT_ANNULEE,
            notes="Erreur de saisie constatée sur la plaque."
        )

        # Contravention 5 : Validée pour citoyen2
        c5 = Contravention.objects.create(
            numero='CTR-BKO-2026-1005',
            agent=agent1,
            citoyen=citoyen2,
            infraction=inf_casque,
            immatriculation_vehicule='MOTO-TV-990',
            type_vehicule=Contravention.VEHICULE_MOTO,
            date_contravention=now - timedelta(days=1),
            lieu_adresse="Pont des Martyrs, direction Badalabougou",
            commune='Commune V',
            montant=inf_casque.montant,
            statut=Contravention.STATUT_VALIDEE,
            notes="Non-port de casque sur axe à grande circulation."
        )

        # 4. Notifications pour les citoyens
        Notification.objects.create(
            utilisateur=citoyen1,
            titre="Contravention Validée N° CTR-BKO-2026-1001",
            message="Votre amende de 20 000 FCFA a été validée par les autorités. Veuillez régler votre amende en ligne.",
            lue=False
        )

        Notification.objects.create(
            utilisateur=citoyen2,
            titre="Reçu de Paiement N° PAY-OM-891241",
            message="Votre paiement de 15 000 FCFA pour la contravention CTR-BKO-2026-1002 a bien été reçu.",
            lue=True
        )

        self.stdout.write(self.style.SUCCESS("""
===================================================================
[OK] DONNÉES DE DÉMONSTRATION CRÉÉES AVEC SUCCÈS !
===================================================================
Utilisateurs disponibles pour la démonstration (Mot de passe: admin123 / agent123 / citoyen123) :

  1. ADMINISTRATEUR :
     - Username : admin  (Mot de passe: admin123)
     - Rôle : Gestion globale, validation/rejet, statistiques & infractions.

  2. AGENTS VERBALISATEURS :
     - Username : agent1  (Mot de passe: agent123) [Tahirou DIAKITE - CCR]
     - Username : agent2  (Mot de passe: agent123) [Daouda SAMAKE - Gendarmerie]

  3. CITOYENS :
     - Username : citoyen1  (Mot de passe: citoyen123) [Mamadou TRAORE]
     - Username : citoyen2  (Mot de passe: citoyen123) [Mariam DIALLO]
     - Username : citoyen3  (Mot de passe: citoyen123) [Oumar COULIBALY]
===================================================================
        """))
