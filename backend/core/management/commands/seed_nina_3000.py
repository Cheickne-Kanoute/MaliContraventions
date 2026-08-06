import random
from django.core.management.base import BaseCommand
from core.models import RegistreNationalNINA

FIRST_NAMES = [
    "Mamadou", "Fatoumata", "Adama", "Aïssata", "Seydou", "Aminata", "Bakary", "Oumar",
    "Kadidia", "Cheick", "Boubacar", "Mariam", "Djénéba", "Moussa", "Ibrahim", "Hawa",
    "Fousseni", "Lassana", "Kadiatou", "Ousmane", "Souleymane", "Tidiane", "Rokiatou",
    "Bintou", "Salimata", "Lamine", "Yacouba", "Alassane", "Assetou", "Sékou", "Modibo",
    "Fanta", "Salif", "Drissa", "Amadou", "Maimouna", "Issa", "Korotoumou", "Mahamadou"
]

LAST_NAMES = [
    "COULIBALY", "DIARRA", "TRAORE", "KEITA", "SISSOKO", "KONATE", "KANTE", "DEMBELE",
    "SANOGO", "MAIGA", "BARRY", "CAMARA", "CISSE", "TOURE", "DIALLO", "DICKO",
    "SANGARE", "TANGARA", "BAGAYOKO", "KONE", "SAMAKE", "DABO", "DAOU", "GUINDO",
    "N'DIAYE", "DACKO", "SACKO", "NIAMBELE", "SYLLA", "TALL", "DIABATE", "KANOUTE"
]

COMMUNES = [
    "Bamako - Commune I", "Bamako - Commune II", "Bamako - Commune III",
    "Bamako - Commune IV", "Bamako - Commune V", "Bamako - Commune VI",
    "Kati", "Ségou", "Sikasso", "Kayes", "Mopti"
]

QUARTIERS = [
    "Lafiabougou", "Hamdallaye", "Badalabougou", "Korofina", "Kalaban-Coro",
    "Magnambougou", "Djélibougou", "Sabalibougou", "Daoudabougou", "Hippodrome",
    "Faladié", "Sotuba", "Baco-Djicoroni", "Missira", "Niamakoro", "Sébénikoro"
]

LETTER_CODES = ["CH", "BA", "KT", "SG", "SK", "KY", "MP"]

class Command(BaseCommand):
    help = 'Genere 3000 citoyens dans le Registre National NINA du Mali'

    def handle(self, *args, **options):
        self.stdout.write("Génération de 3 000 citoyens dans le Registre National NINA Mali...")
        
        # Keep existing citizens or count
        count_existing = RegistreNationalNINA.objects.count()
        needed = 3000 - count_existing
        
        if needed <= 0:
            self.stdout.write(f"[OK] Le registre contient déjà {count_existing} citoyens.")
            return

        objs = []
        start_id = count_existing + 1
        
        # Phone prefixes in Mali: 6, 7, 8, 9
        phone_prefixes = ['65', '66', '70', '72', '75', '76', '90', '92', '95', '98']

        for i in range(needed):
            idx = start_id + i
            fn = random.choice(FIRST_NAMES)
            ln = random.choice(LAST_NAMES)
            year = random.randint(1965, 2005)
            
            nina = f"NINA-{year}-{idx:04d}-{random.randint(100, 999)}-ML"
            phone = f"+223 {random.choice(phone_prefixes)} {random.randint(10, 99):02d} {random.randint(10, 99):02d} {random.randint(10, 99):02d}"
            permis = f"PERMIS-ML-{year % 100}{idx:04d}" if random.random() > 0.15 else ""
            statut_p = random.choice([RegistreNationalNINA.STATUT_PERMIS_VALIDE, RegistreNationalNINA.STATUT_PERMIS_VALIDE, RegistreNationalNINA.STATUT_PERMIS_VALIDE, RegistreNationalNINA.STATUT_PERMIS_SUSPENDU, RegistreNationalNINA.STATUT_PERMIS_EXPIRE])
            vehicule = f"{random.choice(LETTER_CODES)}-{random.randint(1000, 9999)}-MD" if random.random() > 0.3 else ""
            
            objs.append(RegistreNationalNINA(
                nin_nina=nina,
                first_name=fn,
                last_name=ln,
                telephone=phone,
                numero_permis=permis,
                statut_permis=statut_p,
                adresse_quartier=random.choice(QUARTIERS),
                commune=random.choice(COMMUNES),
                immatriculation_vehicule=vehicule
            ))

        RegistreNationalNINA.objects.bulk_create(objs, batch_size=1000)
        self.stdout.write(self.style.SUCCESS(f"[OK] 3 000 citoyens enregistres avec succes dans le Registre National NINA (Total: {RegistreNationalNINA.objects.count()})."))
