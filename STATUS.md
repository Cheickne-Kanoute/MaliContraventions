# 📝 État du Projet "MaliContraventions" (Bilan & Reste à faire)

Date de mise à jour : 06 Août 2026

Ce document résume l'ensemble des travaux réalisés sur la base du code existant, ainsi que les éléments restants pour achever complètement le cahier des charges initial.

---

## ✅ Ce qui est FAIT (Opérationnel)

### 1. Backend (Django / API)
- **Automatisation de la création de PV** : Le `ContraventionViewSet` (`api_views.py`) gère désormais automatiquement la génération du numéro de PV (`PV-XXXX`), l'assignation de l'agent connecté, et la définition du montant selon l'infraction.
- **Gestion des Statuts et Notifications** : L'API intercepte les changements de statut (`VALIDEE`, `PAYEE`, `ANNULEE`) via `perform_update` et génère automatiquement les `Notification` Django pour le citoyen concerné, reproduisant le comportement des anciennes vues HTML.
- **Upload de preuve** : Le modèle et l'API acceptent correctement les images (`photo_preuve`) via requêtes `multipart/form-data`.
- **Intégrité** : `python manage.py check` passe sans aucune erreur.

### 2. Frontend (React / Vite)
- **Tableaux de bord responsives** : Ajout d'un menu "Hamburger" fonctionnel sur mobile pour les 3 espaces (`DashboardAgent`, `DashboardAdmin`, `DashboardCitoyen`).
- **Dashboard Agent** : 
  - Intégration de `React Query` pour la récupération des données.
  - Fenêtre modale de création de PV incluant le champ d'upload de fichier (`photo_preuve`).
- **Page de Détail de Contravention (`/contraventions/:id`)** :
  - Affichage complet du PV avec la photo de preuve.
  - Boutons contextuels selon le rôle :
    - **Admin** : Boutons "Valider" et "Rejeter" (actifs et connectés à l'API).
    - **Citoyen** : Bouton "Payer" (actif, simulation de paiement) et "Contester".
  - Lien direct vers la génération du PDF.
- **Compilation** : Le build TypeScript (`npm run build`) passe sans erreurs (nettoyage des variables inutilisées et de la configuration TypeScript dépréciée).

---

## 🚧 Ce qui MANQUE (Reste à faire)

### 1. Fonctionnalités Avancées (Mises en pause)
Ces technologies étaient mentionnées dans le rapport mais n'ont pas été implémentées pour privilégier la stabilité de la soutenance :
- **Django Channels & Redis** : Pour les notifications en temps réel (websockets). Actuellement, il faut rafraîchir la page ou utiliser React Query pour voir les nouvelles notifications.
- **Celery** : Pour l'envoi asynchrone d'emails et la génération de PDF en arrière-plan.

### 2. Frontend & API (À finaliser plus tard)
- **Génération réelle du QR Code** : Sur la page de détail côté React, l'emplacement du QR Code est présent visuellement mais n'utilise pas encore de librairie (ex: `react-qr-code`) pour générer le code scannable.
- **Contestation (Citoyen)** : Le bouton "Contester" déclenche actuellement une simple alerte. Il manque l'interface (modale) pour saisir le motif de contestation et l'envoyer à l'API.
- **Passerelle de Paiement** : Le bouton "Payer" valide le paiement de manière fictive. L'intégration réelle des API Orange Money ou Moov Money reste à coder.
- **Gestion Complète des Utilisateurs (Admin)** : Le tableau de bord Admin gère visuellement les utilisateurs, mais la création, modification et suppression des agents/citoyens depuis l'interface React nécessite d'être totalement branchée à `UtilisateurViewSet`.
- **Authentification du PDF** : L'URL du PDF Django (`/contraventions/<id>/pdf/`) fonctionne, mais si elle requiert une authentification stricte, il faudra s'assurer que le token JWT est passé correctement (ou que le navigateur partage la session cookie).

---
*Ce fichier sert de feuille de route pour les futures itérations du projet après la soutenance.*
