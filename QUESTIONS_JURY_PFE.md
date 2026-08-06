# 🎓 Guide de Préparation à la Soutenance (PFE)
## 100 Questions & Réponses Probables du Jury
### Application Web de Gestion des Contraventions Routières au Mali 🇲🇱

---

> **À propos de ce document** : 
> Ce document rassemble **100 questions réelles et probables** susceptibles d'être posées par le jury lors de la soutenance du Projet de Fin d'Études (PFE / Licence MIAGE). 
> Les réponses sont rédigées de manière **claire, synthétique et pédagogique**, compréhensibles aussi bien pour les membres du jury **non techniciens** que pour les **experts techniques**.

---

## 📋 Table des Matières
1. [Contexte, Problématique & Présentation du Projet (Q1 - Q15)](#1-contexte-problématique--présentation-du-projet-q1---q15)
2. [Processus Métier & Fonctionnalités (Q16 - Q30)](#2-processus-métier--fonctionnalités-q16---q30)
3. [Analyse, Conception UML & Base de Données (Q31 - Q45)](#3-analyse-conception-uml--base-de-données-q31---q45)
4. [Backend, Python & Framework Django (Q46 - Q60)](#4-backend-python--framework-django-q46---q60)
5. [API REST & Sécurité avec JWT (Q61 - Q75)](#5-api-rest--sécurité-avec-jwt-q61---q75)
6. [Frontend, Interface & Technologies Web (Q76 - Q88)](#6-frontend-interface--technologies-web-q76---q88)
7. [Généralités du Développement, Git & Perspectives (Q89 - Q100)](#7-généralités-du-développement-git--perspectives-q89---q100)

---

## 1. Contexte, Problématique & Présentation du Projet (Q1 - Q15)

#### Q1 : Quel est le sujet principal de votre projet de fin d'études ?
**Réponse :**
Notre projet porte sur la conception et le développement d'une **application web de gestion, verbalisation, validation et paiement en ligne des contraventions routières au Mali**. L'objectif est de digitaliser tout le processus d'infraction routière, depuis le constat sur le terrain jusqu'au règlement de l'amende.

#### Q2 : Pourquoi avez-vous choisi ce sujet particulièrement ?
**Réponse :**
Au Mali, la gestion des contraventions routières repose encore largement sur des reçus papier manuels. Ce système traditionnel entraîne des pertes de recettes pour l'État, des risques de corruption/arrangements informels, des risques de falsification et des tracasseries pour les citoyens (perte de temps pour aller payer en caisse). Notre projet répond à un besoin réel de modernisation administrative.

#### Q3 : Quels sont les objectifs principaux (général et spécifiques) de votre application ?
**Réponse :**
- **Objectif Général** : Digitaliser et sécuriser la gestion des contraventions routières au Mali.
- **Objectifs Spécifiques** :
  1. Permettre aux agents de verbaliser rapidement via une interface dédiée.
  2. Offrir un contrôle et une validation centrale par les administrateurs.
  3. Permettre aux citoyens de consulter leurs amendes et de les régler à distance via Mobile Money (Orange Money, Moov Money).
  4. Générer automatiquement des reçus officiels sécurisés avec QR Code.
  5. Fournir des tableaux de bord statistiques pour le suivi des recettes et des infractions.

#### Q4 : À qui s'adresse cette application ? Qui sont les utilisateurs finaux (qui fait quoi) ?
**Réponse :**
L'application distingue 3 profils d'utilisateurs clés :
1. **L'Agent Verbalisateur (Police / Gendarmerie)** : Il dresse les procès-verbaux (PV) en enregistrant le contrevenant, le véhicule, le lieu et le type d'infraction.
2. **L'Administrateur (Direction des Transports / Sécurité)** : Il valide ou rejette les PV soumis, gère le catalogue des infractions/tarifs, gère les comptes utilisateurs et consulte les statistiques globales.
3. **Le Citoyen Contrevenant** : Il se connecte pour visualiser ses contraventions en attente, effectuer le paiement en ligne et télécharger son reçu de paiement.

#### Q5 : Quelles sont les limites du système manuel actuel au Mali ?
**Réponse :**
- **Lenteur et erreur humaine** : Rédaction manuelle illisible ou incomplète sur carnet papier.
- **Manque de transparence** : Difficulté de tracer les sommes réellement collectées.
- **Fraude et perte de reçus** : Reçus souches facilement égarés, dégradés ou falsifiés.
- **Inconfort pour le citoyen** : Obligation de se déplacer physiquement aux caisses ou commissariats pour payer ou récupérer des pièces retenues.

#### Q6 : Qu'est-ce que votre solution apporte de nouveau par rapport au système actuel ?
**Réponse :**
Elle apporte **la centralisation**, **la traçabilité instantanée**, **la réduction des paiements informels**, et **le confort du paiement à distance 24h/24**. Chaque contravention possède un identifiant unique (ex: `CTR-BKO-2026-XXXX`) incrémenté et infalsifiable.

#### Q7 : S'agit-il d'un projet réel ou d'une simulation académique ?
**Réponse :**
C'est un **MVP (Minimum Viable Product / Produit Minimum Viable)** fonctionnel développé dans un cadre académique (Licence MIAGE), mais conçu selon des normes professionnelles réelles pour être déployable auprès des services publics de sécurité routière au Mali.

#### Q8 : Quelles ont été les contraintes rencontrées lors de l'étude du domaine ?
**Réponse :**
- La complexité du cadre juridique et de la grille tarifaire des infractions routières au Mali.
- La prise en compte du niveau de digitalisation des citoyens (nécessité d'interfaces très simples).
- L'indisponibilité d'une API réelle Mobile Money en environnement de test académique, nécessitant une simulation réaliste des flux bancaires/mobile banking.

#### Q9 : Votre application est-elle adaptée aux réalités technologiques du Mali ?
**Réponse :**
Oui. La prédominance du réseau mobile au Mali a orienté notre choix vers une interface web responsive (accessible sur smartphone) et l'intégration du paiement par Mobile Money (Orange Money, Moov Money), qui est le moyen de paiement numérique le plus populaire au Mali.

#### Q10 : Quels sont les bénéfices de ce projet pour l'État malien ?
**Réponse :**
- Augmentation et sécurisation des recettes fiscales/amendes.
- Statistiques précises en temps réel sur les zones accidentogènes ou à forte infraction.
- Amélioration de l'image de marque de l'administration publique à travers la transformation digitale.

#### Q11 : Quels sont les bénéfices pour le citoyen ?
**Réponse :**
Gain de temps considérable, transparence sur le montant légal de l'amende sans surcoût arbitraire, et obtention d'une preuve de paiement infalsifiable avec QR Code.

#### Q12 : Pourquoi avoir choisi les couleurs vert, jaune, rouge dans le design ?
**Réponse :**
Il s'agit de la charte graphique nationale du Mali. Ce choix renforce l'ancrage institutionnel de l'application et la crédibilité visuelle auprès des usagers.

#### Q13 : Comment avez-vous structuré le travail d'équipe pour ce projet ?
**Réponse :**
Nous avons réparti les tâches selon les spécialités de l'équipe : l'analyse des besoins et modélisation UML, la mise en place du backend/base de données sous Django, le développement frontend et l'intégration des interfaces, ainsi que la phase de tests et de rédaction du rapport.

#### Q14 : Quelle méthodologie de développement avez-vous adoptée ?
**Réponse :**
Nous avons adopté une approche hybride inspirée des **méthodes agiles (Scrum/Kanban)**, en travaillant par itérations successives : modélisation, développement du cœur métier (verbalisation), ajout de la validation et du paiement, puis phases d'optimisation UI/UX et de recette.

#### Q15 : Résumez votre projet en une seule phrase pour le jury.
**Réponse :**
*"C'est une plateforme web complète qui modernise la sécurité routière au Mali en numérisant la verbalisation des infractions, la validation administrative et le règlement des amendes par Mobile Money."*

---

## 2. Processus Métier & Fonctionnalités (Q16 - Q30)

#### Q16 : Pouvez-vous décrire le parcours complet d'une contravention (de la création au paiement) ?
**Réponse :**
1. **Verbalisation** : L'agent crée le PV avec les détails de l'infraction. Le statut initial est *En attente*.
2. **Validation** : L'administrateur vérifie la conformité et valide le PV. Le statut devient *Validée*.
3. **Paiement** : Le citoyen se connecte, consulte l'amende et effectue le paiement Mobile Money. Le statut devient *Acquittée (Payée)*.
4. **Délivrance du Reçu** : Un reçu téléchargeable avec QR Code certifie le règlement.

#### Q17 : Que se passe-t-il si un administrateur rejette une contravention ?
**Réponse :**
Si le PV comporte une erreur ou un vice de forme, l'admin clique sur "Rejeter". Le statut passe à *Rejetée* avec un motif de rejet, et la contravention n'est pas réclamée au citoyen.

#### Q18 : Comment un citoyen retrouve-t-il ses contraventions dans le système ?
**Réponse :**
Lorsqu'il se connecte à son espace personnel, le système filtre automatiquement les contraventions associées à son profil utilisateur ou au numéro d'immatriculation / NIF de son véhicule.

#### Q19 : Comment le numéro unique de contravention (ex: `CTR-BKO-2026-0012`) est-il généré ?
**Réponse :**
Il est généré automatiquement au niveau du code backend à l'aide d'un préfixe (`CTR`), du code de la région/commune (`BKO`), de l'année en cours (`2026`) et d'un numéro séquentiel unique garanti par la base de données.

#### Q20 : Comment fonctionne la simulation du paiement Orange Money / Moov Money ?
**Réponse :**
Le citoyen saisit son numéro de téléphone mobile et valide. Le backend simule l'interrogation de la passerelle de paiement (vérification du solde/débit) et retourne un statut de succès avec une référence de transaction unique. La contravention bascule alors immédiatement à l'état *Acquittée*.

#### Q21 : À quoi sert le QR Code présent sur le reçu de paiement ?
**Réponse :**
Le QR Code contient les informations chiffrées/signées de la transaction (numéro CTR, date, montant, nom du citoyen). Lors d'un contrôle routier ultérieur, un agent peut scanner ce code pour vérifier instantanément l'authenticité du reçu sans risque de fausse pièce papier.

#### Q22 : Un agent verbalisateur peut-il modifier ou supprimer un PV une fois soumis ?
**Réponse :**
Non, pour des raisons d'intégrité et de lutte contre la corruption. Une fois soumis, le PV est verrouillé et seul l'administrateur peut intervenir pour valider ou rejeter motivé.

#### Q23 : Comment gérez-vous la recherche et le filtrage des contraventions ?
**Réponse :**
Dans les tableaux de bord, les utilisateurs disposent de barres de recherche multi-critères : recherche par numéro de contravention, par nom du citoyen, par statut (*En attente*, *Validée*, *Acquittée*, *Rejetée*) ou par plage de dates.

#### Q24 : Quelles sont les données enregistrées lors de la création d'une infraction dans le catalogue ?
**Réponse :**
Un libellé (ex: *Défaut de casque*, *Excès de vitesse*), un code d'article de la loi, une description détaillée, le montant forfaitaire légal de l'amende (en FCFA), et le niveau de gravité.

#### Q25 : Est-il possible d'affecter plusieurs infractions à une même contravention ?
**Réponse :**
Dans la modélisation de notre base de données, une contravention peut inclure une infraction principale ou plusieurs types d'infractions cumulées, calculant automatiquement le total cumulé de l'amende.

#### Q26 : Comment les droits d'accès sont-ils cloisonnés selon les rôles ?
**Réponse :**
Grâce au système d'autorisation de Django (`User Groups & Permissions` / décorateurs de vues). L'agent ne peut pas accéder aux statistiques de recettes globales ; le citoyen ne voit que ses propres contraventions ; seul l'admin possède les privilèges complets.

#### Q27 : Que se passe-t-il si un citoyen conteste une contravention ?
**Réponse :**
Le citoyen peut signaler une réclamation via son espace. L'administrateur reçoit une alerte pour réexaminer le PV concerné avec l'agent verbalisateur.

#### Q28 : Comment est gérée la date limite de paiement d'une amende ?
**Réponse :**
Chaque contravention calculée possède une date d'émission et une date d'échéance légale. Si le délai est dépassé, le système peut appliquer automatiquement une majoration ou marquer le dossier comme *En retard / Transmis au tribunal*.

#### Q29 : Comment sont présentées les statistiques dans le tableau de bord Admin ?
**Réponse :**
Sous forme d'indicateurs synthétiques (cartes KPI) : Montant total collecté (FCFA), nombre de PV émis, taux de recouvrement (%), et répartition géographique par commune sous forme d'histogrammes/graphiques.

#### Q30 : L'application gère-t-elle la réimpression des reçus ?
**Réponse :**
Oui. Tout citoyen ayant acquitté une amende peut revenir à n'importe quel moment sur son tableau de bord pour retélécharger ou imprimer son reçu officiel au format PDF.

---

## 3. Analyse, Conception UML & Base de Données (Q31 - Q45)

#### Q31 : Quels diagrammes UML avez-vous élaborés et pourquoi ?
**Réponse :**
Nous avons réalisé :
1. **Diagramme de cas d'utilisation** : Pour structurer les besoins fonctionnels par rôle (Agent, Admin, Citoyen).
2. **Diagramme de classes** : Pour modéliser la structure statique des données et leurs relations.
3. **Diagrammes de séquence** : Pour expliciter la dynamique des échanges (ex: flux d'authentification, flux de verbalisation, flux de paiement).

#### Q32 : Expliquez simplement ce qu'est un Diagramme de Cas d'Utilisation.
**Réponse :**
C'est un schéma qui montre **qui** (les acteurs/utilisateurs) peut faire **quoi** (les cas d'utilisation ou fonctionnalités) dans le système, sans entrer dans le détail technique du code.

#### Q33 : Quelles sont les entités principales de votre Diagramme de Classes / Modèle de Données ?
**Réponse :**
- **Utilisateur (User/Profil)** : Informations de compte et rôles.
- **Infraction** : Catalogue des types de contraventions et montants.
- **Contravention** : Le PV dressé (numéro, date, statut, lieu, agent, contrevenant).
- **Vehicule** : Immatriculation, marque, modèle, type.
- **Paiement** : Transaction de règlement (mode de paiement, référence, date, montant).

#### Q34 : Quelle est la différence entre MCD et MLD en base de données ?
**Réponse :**
- **MCD (Modèle Conceptuel de Données)** : Représentation abstraite des entités et associations métiers, indépendante de toute technologie.
- **MLD (Modèle Logique de Données)** : Traduction du MCD en tables, colonnes, clés primaires et clés étrangères adaptées aux SGBD relationnels (MySQL).

#### Q35 : Qu'est-ce qu'une clé primaire (`Primary Key`) et une clé étrangère (`Foreign Key`) ?
**Réponse :**
- **Clé primaire** : Un identifiant unique pour chaque ligne d'une table (ex: `id_contravention` ou `id_user`).
- **Clé étrangère** : Une colonne dans une table qui pointe vers la clé primaire d'une autre table, créant ainsi un lien entre elles (ex: `agent_id` dans la table Contravention pointe vers la table User).

#### Q36 : Quelle relation existe-t-il entre l'entité *User* et l'entité *Contravention* ?
**Réponse :**
C'est une relation de type **1 à plusieurs (1:N)**. Un agent peut dresser plusieurs contraventions, mais une contravention est émise par un seul agent. De même, un citoyen peut avoir plusieurs contraventions à son nom.

#### Q37 : Qu'est-ce que la normalisation d'une base de données et l'avez-vous appliquée ?
**Réponse :**
La normalisation est une technique de conception qui consiste à organiser les tables pour éliminer la redondance des données et éviter les anomalies de mise à jour. Nous avons respecté la **3ème Forme Normale (3FN)**.

#### Q38 : Pourquoi avoir choisi MySQL 8 comme Système de Gestion de Base de Données (SGBD) ?
**Réponse :**
MySQL 8 est un SGBD relationnel robuste, très populaire, performant, Open Source et supportant parfaitement le langage SQL standard ainsi que l'intégrité référentielle et les transactions ACID.

#### Q39 : Qu'est-ce que le principe ACID en base de données ?
**Réponse :**
ACID garantit la fiabilité des transactions :
- **A**tomicité : La transaction réussit complètement ou échoue complètement.
- **C**ohérence : La base reste dans un état valide.
- **I**solation : Les transactions simultanées n'interfèrent pas.
- **D**urabilité : Une fois validée, la donnée est enregistrée de façon permanente.

#### Q40 : Pourquoi le principe d'Atomicité est-il crucial pour le paiement d'une contravention ?
**Réponse :**
Si le paiement Mobile Money est débité, le statut de la contravention doit passer à *Acquittée* simultanément. Si une erreur survient au milieu, le système effectue un **rollback** (annulation) pour éviter qu'un citoyen soit débité sans que sa contravention soit marquée payée.

#### Q41 : Comment gérez-vous l'historique des modifications des contraventions ?
**Réponse :**
Chaque enregistrement possède des champs d'audit automatique : `created_at` (date de création) et `updated_at` (dernière modification), assurant la traçabilité temporelle.

#### Q42 : Comment les images ou documents (ex: permis, carte grise) sont-ils stockés ?
**Réponse :**
Les fichiers media ne sont pas stockés directement sous forme binaire dans la base de données (ce qui l'alourdirait). Seul le **chemin relatif du fichier** est stocké en base (`CharField`/`FileField`), tandis que le fichier lui-même est conservé dans le dossier serveur `media/`.

#### Q43 : Quel est le rôle de la table d'association dans le cas d'une relation Beaucoup-à-Beaucoup (N:M) ?
**Réponse :**
Si une contravention peut comporter plusieurs infractions et qu'une infraction peut figurer sur plusieurs contraventions, la table d'association (ex: `ContraventionInfraction`) stocke les couples `(id_contravention, id_infraction)` pour rompre la relation N:M en deux relations 1:N.

#### Q44 : Qu'est-ce qu'un index en base de données et en avez-vous utilisé ?
**Réponse :**
Un index est une structure de données qui accélère les requêtes de recherche (comme un index à la fin d'un livre). Des index sont créés sur le numéro de contravention `numero_ctr` et sur les clés étrangères pour optimiser les performances lors des recherches.

#### Q45 : Quel outil avez-vous utilisé pour gérer la base de données en local ?
**Réponse :**
Nous avons utilisé **WAMP Server** intégrant **phpMyAdmin**, un outil web intuitif d'administration MySQL.

---

## 4. Backend, Python & Framework Django (Q46 - Q60)

#### Q46 : Pourquoi avoir choisi Python 3 et le framework Django pour le backend ?
**Réponse :**
Python est reconnu pour sa lisibilité, sa sobriété et sa puissance. Django est un framework web robuste qui intègre le principe *"Batteries included"* (tout est fourni de base : ORM, authentification, panneaux d'administration, sécurité anti-faille).

#### Q47 : Qu'est-ce que l'architecture MVT de Django et en quoi diffère-t-elle du modèle MVC classique ?
**Réponse :**
- **M (Modèle)** : Accès et structure des données (équivalent au Model MVC).
- **V (Vue)** : Logique métier et traitement de la requête (équivalent au Controller MVC).
- **T (Template)** : Rendu visuel HTML (équivalent à la View MVC).
En résumé, Django gère lui-même la partie "Contrôleur" intermédiaire.

#### Q48 : Qu'est-ce que l'ORM de Django (`Object-Relational Mapping`) et quel est son avantage ?
**Réponse :**
L'ORM permet de manipuler la base de données directement avec des objets et du code Python (ex: `Contravention.objects.filter(statut='EN_ATTENTE')`) sans écrire de requêtes SQL brutes à la main. 
*Avantage* : Portabilité de la base, gain de temps et protection automatique contre les injections SQL.

#### Q49 : Qu'est-ce qu'une "Migration" dans Django (`makemigrations` et `migrate`) ?
**Réponse :**
- `python manage.py makemigrations` : Analyse les modifications faites dans les modèles Python (`models.py`) et génère les fichiers d'instructions.
- `python manage.py migrate` : Applique réellement ces instructions dans la base de données MySQL pour créer ou modifier les tables.

#### Q50 : À quoi sert l'environnement virtuel (`venv`) en Python ?
**Réponse :**
Il permet d'isoler les dépendances et packages d'un projet spécifique (ex: Django 5.2, SimpleJWT) sans polluer le système d'exploitation général ou créer de conflits de versions avec d'autres projets.

#### Q51 : Quel est le rôle du fichier `requirements.txt` ?
**Réponse :**
Il contient la liste exacte de tous les modules et librairies Python nécessaires à l'application avec leurs versions. Il permet à n'importe quel autre développeur d'installer le projet en une commande (`pip install -r requirements.txt`).

#### Q52 : À quoi sert le fichier `manage.py` ?
**Réponse :**
C'est l'outil en ligne de commande de Django spécifique au projet. Il permet d'exécuter des tâches administratives : démarrer le serveur de développement (`runserver`), appliquer les migrations, créer des superutilisateurs, ou exécuter des scripts de données (`seed_data`).

#### Q53 : À quoi sert la commande personnalisée `python manage.py seed_data` que vous avez créée ?
**Réponse :**
C'est un script de démonstration automatisé ("seeder") qui alimente instantanément la base de données vierge avec des données fictives réalistes (comptes démo admin/agent/citoyen, infractions types du code de la route malien, contraventions de test).

#### Q54 : Quelle est la fonction du fichier `settings.py` dans Django ?
**Réponse :**
C'est le fichier central de configuration du projet. On y définit les applications installées (`INSTALLED_APPS`), les paramètres de connexion à MySQL (`DATABASES`), les règles de sécurité (`SECRET_KEY`, `ALLOWED_HOSTS`), et la configuration des fichiers statiques/medias.

#### Q55 : Quelle est la différence entre WSGI et ASGI dans le déploiement de Django ?
**Réponse :**
- **WSGI** : Standard traditionnel de communication synchrone entre le serveur web et Django.
- **ASGI** : Standard moderne supportant l'asynchronisme (ex: WebSockets pour notifications en temps réel).

#### Q56 : Comment gérez-vous la validation des formulaires côté backend ?
**Réponse :**
Nous utilisons les formulaires Django (`forms.ModelForm`) ou les sérialiseurs DRF (`serializers.Serializer`). Ils contrôlent automatiquement la présence des champs obligatoires, le format des données (ex: format téléphone, montants positifs) et renvoient des messages d'erreur explicites.

#### Q57 : Qu'est-ce que le panneau d'administration natif de Django (`Django Admin`) ?
**Réponse :**
C'est une interface de gestion pré-générée par Django permettant aux superutilisateurs de consulter, modifier ou supprimer rapidement les enregistrements de toutes les tables de la base de données.

#### Q58 : Comment gérez-vous la sécurité des mots de passe en base de données ?
**Réponse :**
Django ne stocke jamais les mots de passe en clair. Il les chiffre automatiquement avec l'algorithme robuste **PBKDF2** associé à un hachage SHA-256 et un sel (`salt`) unique, garantissant qu'ils restent indéchiffrables même en cas d'accès direct à la base de données.

#### Q59 : Qu'est-ce qu'un middleware dans Django ?
**Réponse :**
C'est un composant d'arrière-plan qui intercepte chaque requête entrant dans l'application et chaque réponse sortante. Il sert par exemple à vérifier la session de l'utilisateur, à gérer la protection CSRF ou la sécurité des en-têtes HTTP.

#### Q60 : Pourquoi éviter d'écrire des requêtes SQL personnalisées brutes dans les vues Django ?
**Réponse :**
Parce que l'ORM de Django s'occupe d'échapper proprement tous les paramètres, protégeant ainsi l'application contre les failles d'injection SQL. Écrire du SQL brut réintroduit un risque de sécurité inutile.

---

## 5. API REST & Sécurité avec JWT (Q61 - Q75)

#### Q61 : Qu'est-ce qu'une API REST ?
**Réponse :**
Une **API REST** (Representational State Transfer) est une interface de communication standardisée permettant à différentes applications (ex: un site web, une application mobile, un logiciel tiers) d'échanger des données de manière structurée à travers le protocole HTTP.

#### Q62 : Pourquoi avoir intégré Django REST Framework (DRF) dans votre projet ?
**Réponse :**
Pour exposer des endpoints API réutilisables. Cela permet à l'application d'être prête pour de futurs développements, comme la création d'une **application mobile Android/iOS pour les agents de police sur le terrain**.

#### Q63 : Quels sont les verbes HTTP principaux utilisés dans votre API REST et à quoi servent-ils ?
**Réponse :**
- **GET** : Récupérer des données (ex: lister les infractions).
- **POST** : Créer une nouvelle donnée (ex: enregistrer une nouvelle contravention).
- **PUT / PATCH** : Mettre à jour une donnée existante (ex: valider le statut d'un PV).
- **DELETE** : Supprimer une donnée.

#### Q64 : Qu'est-ce que le format JSON (`JavaScript Object Notation`) ?
**Réponse :**
C'est un format textuel très léger et universel de structuration de données composé de clés et de valeurs (ex: `{"id": 1, "montant": 5000, "statut": "PAYEE"}`). Il est lisible par les humains et facilement interprétable par n'importe quel langage de programmation.

#### Q65 : Qu'est-ce qu'un Token JWT (`JSON Web Token`) ?
**Réponse :**
Un JWT est un jeton d'authentification numérique compact et sécurisé. Une fois qu'un utilisateur fournit ses identifiants valides, le serveur lui délivre ce jeton qu'il renvoie ensuite dans l'en-tête HTTP (`Authorization: Bearer <token>`) à chaque requête protégée.

#### Q66 : Quelles sont les 3 parties qui composent un jeton JWT ?
**Réponse :**
1. **Header (En-tête)** : Indique l'algorithme de chiffrement (ex: HS256).
2. **Payload (Charge utile)** : Contient les informations de l'utilisateur (ID, rôle, expiration).
3. **Signature** : Permet au serveur de vérifier que le jeton n'a pas été altéré ou falsifié.

#### Q67 : Quelle est la différence entre un `Access Token` et un `Refresh Token` dans JWT ?
**Réponse :**
- **Access Token** : Jeton à durée de vie très courte (ex: 15 à 60 minutes) utilisé pour autoriser les requêtes API courantes.
- **Refresh Token** : Jeton à durée de vie plus longue (ex: 7 jours) permettant d'obtenir un nouvel *Access Token* sans réobliger l'utilisateur à ressaisir son mot de passe.

#### Q68 : Quels sont les endpoints JWT configurés dans votre projet ?
**Réponse :**
- `POST /api/token/` : Obtenir le couple Access Token & Refresh Token.
- `POST /api/token/refresh/` : Renouveler un Access Token expiré.

#### Q69 : Quelle est la différence entre l'Authentification et l'Autorisation ?
**Réponse :**
- **Authentification** : Répond à la question *"Qui êtes-vous ?"* (Vérifier l'identité via login/mot de passe).
- **Autorisation** : Répond à la question *"Qu'avez-vous le droit de faire ?"* (Vérifier si un citoyen peut valider un PV -> Refusé ; seul l'Admin a la permission).

#### Q70 : Pourquoi utiliser JWT au lieu des sessions traditionnelles par cookies pour l'API ?
**Réponse :**
JWT est **stateless (sans état)** : le serveur n'a pas besoin de stocker la session en base de données. Cela rend l'application beaucoup plus évolutive et idéale pour s'interconnecter avec des applications mobiles natives.

#### Q71 : Qu'est-ce que la faille CSRF (`Cross-Site Request Forgery`) et comment Django s'en protège-t-il ?
**Réponse :**
C'est une attaque où un site malveillant force un utilisateur connecté à exécuter des actions indésirables à son insu. Django la bloque grâce au **token CSRF** unique injecté dans tous les formulaires HTML (`{% csrf_token %}`).

#### Q72 : Qu'est-ce qu'une injection SQL et comment votre application l'évite-t-elle ?
**Réponse :**
Une injection SQL consiste pour un pirater à insérer du code SQL malveillant dans un champ de saisie pour manipuler la base. L'utilisation de l'ORM de Django et le paramétrage automatique des requêtes annulent totalement ce risque.

#### Q73 : Qu'est-ce que le mécanisme CORS (`Cross-Origin Resource Sharing`) ?
**Réponse :**
C'est une sécurité des navigateurs web qui restreint les requêtes provenant d'un domaine ou d'un port différent. Dans une architecture découplée (ex: frontend React sur le port 3000 et backend Django sur le port 8000), CORS doit être configuré pour autoriser les échanges.

#### Q74 : Comment empêchez-vous l'accès direct aux URLs réservées aux administrateurs ?
**Réponse :**
Au niveau des vues Django, nous appliquons des contrôles de sécurité stricts (`@login_required`, vérification du rôle `request.user.is_staff` ou appartenance au groupe Admin). Si la condition n'est pas remplie, l'accès est immédiatement bloqué avec une erreur HTTP `403 Forbidden`.

#### Q75 : Comment les erreurs de l'API sont-elles renvoyées au client ?
**Réponse :**
Elles sont renvoyées sous forme de réponses JSON normées accompagnées du code statut HTTP correspondant (ex: `400 Bad Request` pour des données invalides, `401 Unauthorized` pour un jeton manquant ou expiré, `404 Not Found` si la contravention n'existe pas).

---

## 6. Frontend, Interface & Technologies Web (Q76 - Q88)

#### Q76 : Quelles technologies ont été utilisées pour la réalisation du Frontend ?
**Réponse :**
Nous avons utilisé le moteur de gabarits **Django Templates**, du **HTML5**, du **CSS3**, le framework **Bootstrap 5**, la bibliothèque d'icônes **FontAwesome** et du **JavaScript** pour la dynamisation des formulaires.

#### Q77 : Pourquoi avoir opté pour Django Templates + Bootstrap 5 plutôt qu'un framework Single Page (ex: React, Vue.js) ?
**Réponse :**
Ce choix garantit une excellente productivité pour le périmètre du projet, un rendu côté serveur (SSR) rapide, une grande simplicité de maintenance et une intégration native des mécanismes de sécurité de Django (protection CSRF, messages flash).

#### Q78 : Qu'est-ce que le "Responsive Design" et comment l'avez-vous mis en œuvre ?
**Réponse :**
C'est la capacité d'une interface web à s'adapter automatiquement à la taille de n'importe quel écran (ordinateurs de bureau, tablettes, smartphones). Nous l'avons réalisé grâce au système de grille flexible de **Bootstrap 5** (classes `col-md-`, `col-lg-`).

#### Q79 : Qu'est-ce qu'un Template Hérité dans Django (`Template Inheritance`) ?
**Réponse :**
C'est un principe de réutilisation du code HTML. On définit une page de base (`base.html`) contenant le menu, l'en-tête et le pied de page, puis les autres pages étendent cette base (`{% extends 'base.html' %}`) et n'injectent que leur contenu propre (`{% block content %}`).

#### Q80 : Quel est le rôle de Bootstrap dans votre application ?
**Réponse :**
Bootstrap fournit des composants graphiques prêts à l'emploi (boutons, cartes, tableaux, fenêtres modales, barres de navigation) et un design épuré, garantissant un rendu esthétique et moderne.

#### Q81 : Comment les messages de confirmation ou d'erreur sont-ils affichés à l'utilisateur ?
**Réponse :**
Grâce au framework de messages de Django (`django.contrib.messages`). Lorsqu'un PV est validé ou un paiement effectué, un message d'alerte temporaire (succès/erreur) apparaît en haut de l'écran.

#### Q82 : À quoi servent les filtres de gabarit Django (`Template Filters`) ?
**Réponse :**
Ils permettent de formater directement l'affichage des variables dans l'HTML (ex: `{{ contravention.date_creation|date:"d/m/Y" }}` pour afficher la date au format francophone ou `{{ amende|floatformat:0 }}` pour les montants).

#### Q83 : Comment avez-vous dynamisé la saisie sur le formulaire de verbalisation ?
**Réponse :**
Des scripts JavaScript légers permettent de calculer automatiquement le montant total de l'amende au fur et à mesure que l'agent coche ou sélectionne des infractions.

#### Q84 : Comment générez-vous le fichier PDF du reçu de paiement ?
**Réponse :**
Nous utilisons une bibliothèque Python (telle que `ReportLab` ou `WeasyPrint` / template HTML vers PDF) qui prend les données de la transaction enregistrée et génère à la volée un document PDF téléchargeable contenant la mise en page officielle et le QR code.

#### Q85 : Qu'est-ce que l'accessibilité web et y avez-vous pensé ?
**Réponse :**
L'accessibilité garantit que le site est utilisable par tous, y compris les personnes ayant des déficiences visuelles. Nous avons veillé à utiliser des contrastes de couleurs suffisants, des libellés de formulaires clairs (`labels`) et la sémantique HTML5 (`nav`, `main`, `footer`).

#### Q86 : Comment l'interface s'assure-t-elle que le citoyen ne saisit pas un montant erroné lors du paiement ?
**Réponse :**
Le champ de montant est pré-rempli et verrouillé en lecture seule avec la valeur exacte de l'amende enregistrée en base. Le citoyen ne choisit que son mode de paiement (Orange Money / Moov Money) et son numéro.

#### Q87 : Quelle est l'utilité des icônes FontAwesome dans le projet ?
**Réponse :**
Elles améliorent l'expérience utilisateur (UX) en fournissant des repères visuels intuitifs (ex: une coche verte pour validé, un symbole d'œil pour consulter, un imprimante pour le reçu).

#### Q88 : Comment la charte graphique aux couleurs du Mali a-t-elle été intégrée ?
**Réponse :**
Nous avons personnalisé le fichier CSS (`style.css`) en utilisant des variables CSS globales pour le vert (`#008751`), le jaune (`#FCD116`) et le rouge (`#E21836`) du drapeau malien, réparties harmonieusement sur la barre de navigation et les boutons d'action.

---

## 7. Généralités du Développement, Git & Perspectives (Q89 - Q100)

#### Q89 : Qu'est-ce que Git et pourquoi l'avez-vous utilisé pour ce projet ?
**Réponse :**
Git est un système de gestion de versions décentralisé. Il permet de suivre l'historique complet des modifications apportées au code source, de revenir en arrière en cas de bogue et de travailler en équipe sans risquer de supprimer le travail des autres.

#### Q90 : Quelle est la différence entre Git et GitHub ?
**Réponse :**
- **Git** : L'outil logiciel local sur la machine qui gère le versionnement.
- **GitHub** : Le service en ligne (hébergeur cloud) qui stocke le dépôt Git à distance et facilite la collaboration.

#### Q91 : Que font les commandes `git add`, `git commit` et `git push` ?
**Réponse :**
- `git add` : Prépare les fichiers modifiés pour l'enregistrement.
- `git commit` : Enregistre localement les modifications avec un message explicatif.
- `git push` : Envoie les commits locaux vers le dépôt distant sur GitHub.

#### Q92 : Qu'est-ce qu me branche Git (`Branch`) ?
**Réponse :**
Une branche permet d'isoler le développement d'une nouvelle fonctionnalité (ex: `feature/paiement`) sans impacter la version stable du projet (`main` ou `master`). Une fois la fonction terminée et testée, on la fusionne (`merge`).

#### Q93 : Avez-vous effectué des tests sur votre application et de quel type ?
**Réponse :**
Oui. Nous avons réalisé :
1. **Tests unitaires** : Vérification isolée des fonctions de calcul d'amendes et de génération de numéros CTR.
2. **Tests d'intégration** : Vérification du flux complet (agent verbalise -> admin valide -> citoyen paie).
3. **Tests d'interface (recette manuelle)** : Vérification du comportement sur ordinateur et mobile.

#### Q94 : Qu'est-ce qu'une boucle de redirection et comment l'avez-vous évitée ?
**Réponse :**
C'est une erreur de configuration où une page redirige vers une autre qui redirige en retour vers la première (ex: page de connexion qui redirige vers elle-même). Nous l'avons évitée en configurant soigneusement `LOGIN_URL` et les redirections de fin de connexion.

#### Q95 : Si l'application recevait 100 000 utilisateurs simultanés au Mali, tiendrait-elle le coup ? Que faudrait-il adapter ?
**Réponse :**
En l'état de développement local, le serveur intégré de Django (`runserver`) est monothread. Pour passer à l'échelle en production, il faudrait :
- Remplacer le serveur local par un serveur WSGI/ASGI de production (**Gunicorn** ou **uWSGI**) couplé à un serveur web **Nginx**.
- Héberger MySQL sur un serveur dédié avec système de cache (**Redis**).
- Déployer l'application sur une architecture Cloud évolutive (ex: Docker / VPS / AWS).

#### Q96 : Comment envisagez-vous l'intégration réelle avec les opérateurs télécoms (Orange Mali / Moov Africa) ?
**Réponse :**
Dans une version finale déployée pour l'État, il suffira de remplacer notre module de simulation par les SDK/APIs officielles Webhook REST des services **Orange Money Open API** et **Moov Money API**, avec échange de clés d'API sécurisées (`API Key`, `Secret Key`).

#### Q97 : Comment les citoyens ne possédant pas de smartphone (téléphones classiques/feature phones) pourraient-ils payer ?
**Réponse :**
Comme perspective d'évolution, nous prévoyons de mettre en place un **service USSD** (ex: menu composite type `*123#`). Le citoyen pourrait saisir son numéro de contravention directement via un code USSD et valider son code secret Mobile Money.

#### Q98 : Quelles sont les améliorations futures (perspectives) que vous projetez pour cette application ?
**Réponse :**
- Développement d'une **application mobile Android dédiée aux agents** avec capture photo des plaques d'immatriculation (reconnaissance OCR).
- Envoi automatique de notifications **SMS** d'alerte de contravention au citoyen dès la validation du PV.
- Géolocalisation GPS automatique du lieu d'infraction au moment de la verbalisation.

#### Q99 : Qu'avez-vous personnellement appris ou retiré de la réalisation de ce projet de fin d'études ?
**Réponse :**
Ce projet nous a permis de concrétiser l'ensemble des connaissances théoriques acquises durant notre cursus MIAGE : modélisation UML, maîtrise d'un framework professionnel (Django), gestion de base de données relationnelle, sécurité informatique et travail collaboratif rigoureux avec Git.

#### Q100 : Quel est le mot de la fin pour conclure votre présentation devant le jury ?
**Réponse :**
*"Nous vous remercions pour votre bienveillante attention. Ce projet constitue une preuve de concept solide qu'une solution numérique accessible, moderne et sécurisée peut contribuer de manière significative à la modernisation de la gestion routière au Mali. Nous sommes désormais à votre disposition pour répondre à toutes vos questions."*

---

> 💡 **Conseil d'Équipe pour le Jour J** : 
> - **Sourire et sérénité** : Écoutez attentivement chaque question du jury avant de répondre.
> - **Répartition de la parole** : Laissez l'un des membres distribuer la parole de façon fluide ("Mon camarade X va détailler la partie base de données...").
> - **Honneteté intellectuelle** : Si vous ne connaissez pas la réponse exacte à une question pointue, dites par exemple : *"C'est un aspect très pertinent que nous n'avons pas inclus dans ce périmètre MVP, mais que nous intégrerons dans les perspectives."*
