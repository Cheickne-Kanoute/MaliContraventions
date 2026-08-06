# Application Web de Gestion des Contraventions Routières au Mali 🇲🇱

MVP d'application web de gestion, verbalisation, validation et paiement en ligne des contraventions routières au Mali.

Projet basé sur le rapport de projet tutoré (Licence MIAGE).

---

## 🛠️ Stack Technique

- **Backend** : Python 3.14 + Django 5.2 + Django REST Framework + SimpleJWT
- **Base de Données** : MySQL 8 (via WAMP Server - base `contravention_db`)
- **Frontend** : Django Templates + Bootstrap 5 + FontAwesome (Charte graphique couleurs nationales du Mali)

---

## 🚀 Installation et Lancement du Projet

### 1. Prérequis
- **Python 3.10+** (ou version récente de Python 3)
- **MySQL 8.0+** (activé via WAMP Server, XAMPP ou service MySQL local sur le port `3306`)
- **Git**

---

### 2. Procédure d'installation pas à pas

#### Étape A : Cloner le dépôt et accéder au dossier
```bash
git clone https://github.com/Cheickne-Kanoute/MaliContraventions.git
cd MaliContraventions
```

#### Étape B : Créer et activer l'environnement virtuel
- **Sur Windows (PowerShell) :**
  ```powershell
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  ```
- **Sur Windows (CMD) :**
  ```cmd
  python -m venv venv
  .\venv\Scripts\activate.bat
  ```
- **Sur Linux / macOS :**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

#### Étape C : Installer les dépendances
```bash
pip install -r requirements.txt
```

#### Étape D : Préparer la base de données MySQL
1. Démarrer votre serveur MySQL (ex: **WAMP Server** - icône verte dans la barre des tâches).
2. Créer la base de données nommée **`contravention_db`** (via phpMyAdmin à l'adresse `http://localhost/phpmyadmin` ou en ligne de commande MySQL) :
   ```sql
   CREATE DATABASE contravention_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

#### Étape E : Exécuter les migrations et alimenter la base
```bash
# Exécuter les migrations Django
python manage.py migrate

# Injecter les données de démonstration (comptes démo, infractions, PVs, etc.)
python manage.py seed_data
```

#### Étape F : Lancer le serveur local
```bash
python manage.py runserver
```

L'application est immédiatement accessible dans votre navigateur à l'adresse :
👉 **`http://127.0.0.1:8000/`**

---

## 🔑 Comptes de Démonstration (Accès Rapide)

| Rôle | Identifiant | Mot de passe | Description / Fonctionnalités |
|---|---|---|---|
| **Administrateur** | `admin` | `admin123` | Supervision globale, validation/rejet des PV, catalogue infractions, recettes |
| **Agent Verbalisateur** | `agent1` | `agent123` | Verbalisation d'infractions (création de PV), suivi de ses contraventions |
| **Agent Verbalisateur 2** | `agent2` | `agent123` | Agent Gendarmerie Nationale |
| **Citoyen Contrevenant** | `citoyen1` | `citoyen123` | Consultation de ses amendes (Mamadou TRAORE), paiement Orange Money simulé |
| **Citoyen Contrevenant 2** | `citoyen2` | `citoyen123` | Consultation (Mariam DIALLO), aperçu amende acquittée |

*Note: Sur la page de connexion, des boutons "Démo Rapide" permettent de remplir automatiquement les identifiants.*

---

## 🔄 Flux de Démonstration (Parcours Complet)

1. **Connexion Agent (`agent1` / `agent123`)** :
   - Accéder au formulaire "Verbaliser (Nouvelle CTR)".
   - Sélectionner un citoyen, un type de véhicule, l'infraction (ex. *Excès de vitesse*) et le lieu.
   - Soumettre le PV. Un numéro unique (ex. `CTR-BKO-2026-XXXX`) est généré au statut *En attente*.

2. **Connexion Administrateur (`admin` / `admin123`)** :
   - Consulter le tableau de bord global avec les statistiques d'encaissement et la répartition par commune.
   - Ouvrir la contravention créée et cliquer sur **Valider la Contravention** (Statut passe à *Validée*).

3. **Connexion Citoyen (`citoyen1` / `citoyen123`)** :
   - Le citoyen voit son amende à régler dans son tableau de bord.
   - Ouvrir la contravention et cliquer sur **Payer l'amende maintenant**.
   - Choisir *Orange Money* ou *Moov Money*, saisir le numéro et valider.
   - Le statut passe immédiatement à **ACQUITTÉE (PAYÉE)** et un reçu avec QR code est délivré.

---

## 📡 API REST & Endpoints JWT

- **Token JWT (Obtain)** : `POST http://127.0.0.1:8000/api/token/`
- **Token JWT (Refresh)** : `POST http://127.0.0.1:8000/api/token/refresh/`
- **Liste des Infractions (JSON)** : `GET http://127.0.0.1:8000/api/infractions/`
- **Liste des Contraventions (JSON)** : `GET http://127.0.0.1:8000/api/contraventions/`
- **Liste des Paiements (JSON)** : `GET http://127.0.0.1:8000/api/paiements/`
