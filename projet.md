

<!-- Start of picture text -->
||<br>| [ | |<br>||<br>| |<br>| |<br>| |<br>| F |<br>| Bsa |<br>| ob<br>P|<br>yRam<br>||<br>||<br>||<br>||<br>||<br>||<br>||<br>||<br>||<br>||<br>| |<br><!-- End of picture text -->

Oumou COULIBALY | Boubacar Sidiki DEMBELE | | Tahirou DIAKITE | | Daouda Faran SAMAKE | Seydou SANOGO **|** ~~— —_~~ **|** ~~|~~ | ~~| |~~ | ~~|~~ <u>||</u> ~~1~~ 

# Table des matières 

|Table des matières ............................................................................................................... II|
|---|
|Remerciements..........................................................................................................................I|
|Liste des figures........................................................................................................................ II|
|Sigles et abréviations................................................................................................................ III|
|INTRODUCTION GENERALE................................................................................................. 1|
|CHAPITRE 1 : GENERALITES................................................................................................ 2|
|Introduction.......................................................................................................................... 2|
|1.1 Présentation de la gestion des contraventions routières au Mali.............................................. 2|
|1.2 Processus actuel de gestion des contraventions.................................................................... 2|
|1.3 Limites du système actuel................................................................................................. 3|
|1.4 Solution proposée............................................................................................................ 3|
|1.5 Conclusion...................................................................................................................... 4|
|CHAPITRE 2 : PRESENTATION DU PROJET........................................................................... 5|
|Introduction.......................................................................................................................... 5|
|2.1 Contexte du projet............................................................................................................ 5|
|2.2 Justification du projet....................................................................................................... 5|
|2.3 Objectif général............................................................................................................... 5|
|2.4 Objectifs spécifiques........................................................................................................ 5|
|2.5 Résultats attendus............................................................................................................ 6|
|2.6 Présentation de la structure d'accueil.................................................................................. 6|
|2.7 Étude de l'existant............................................................................................................ 6|
|2.8 Critique de l'existant......................................................................................................... 7|
|2.9 Solution proposée............................................................................................................ 7|
|2.10 Conclusion.................................................................................................................... 7|
|CHAPITRE 3 : ANALYSE ET CONCEPTION........................................................................... 8|
|Introduction.......................................................................................................................... 8|
|3.1 Analyse des besoins......................................................................................................... 8|
|3.1.1 Besoins fonctionnels.................................................................................................. 8|
|3.1.2 Besoins non fonctionnels............................................................................................ 9|
|3.2 Conception du système..................................................................................................... 9|
|3.2.1 Diagramme de cas d'utilisation.................................................................................... 9|



I 

|3.2.2 Diagramme de classes.............................................................................................. 11|
|---|
|3.2.3 Diagrammes de séquence.......................................................................................... 12|
|3.3 Conclusion.................................................................................................................... 16|
|CHAPITRE 4 : REALISATION ET PRESENTATION DE L'APPLICATION.............................. 17|
|Introduction........................................................................................................................ 17|
|4.1 Technologies utilisées..................................................................................................... 17|
|4.1.1 Backend.................................................................................................................. 17|
|4.1.2 Frontend................................................................................................................. 18|
|4.1.3 Base de données...................................................................................................... 20|
|4.2 Architecture de l'application............................................................................................ 20|
|4.3 Présentation des principales interfaces.............................................................................. 20|
|4.3.1 Interface de connexion.............................................................................................. 20|
|4.3.2 Tableau de bord Administrateur................................................................................. 22|
|4.3.3 Tableau de bord Agent............................................................................................. 23|
|4.3.4 Tableau de bord Citoyen........................................................................................... 24|
|4.3.5 Gestion des infractions............................................................................................. 25|
|4.3.6 Gestion des contraventions........................................................................................ 26|
|4.3.7 Paiement des amendes.............................................................................................. 27|
|4.3.8 Tableau de bord statistique........................................................................................ 28|
|4.4 Tests de l'application...................................................................................................... 29|
|4.5 Conclusion.................................................................................................................... 29|
|CONCLUSION GENERALE...................................................................................................... i|
|1.<br>Ouvrages et Documentation Technique............................................................................. ii|
|2.<br>Ressources Complémentaires........................................................................................... ii|



II 

## **Remerciements** 

Au terme de ce travail, nous tenons avant tout à remercier Dieu Tout-Puissant pour la santé, la force et la persévérance qu'il nous a accordées tout au long de notre formation et durant la réalisation de ce projet. 

Nous exprimons notre profonde gratitude à l'ensemble du corps enseignant de **TechnolabISTA** pour la qualité de la formation reçue, les connaissances transmises et les conseils qui ont contribué à notre réussite académique. 

Nos sincères remerciements s'adressent particulièrement à notre encadreur pour sa disponibilité, ses orientations, ses remarques constructives et son accompagnement tout au long de la réalisation de ce mémoire. 

Nous remercions également les responsables et les agents des services chargés de la sécurité routière au Mali, qui ont accepté de partager leurs expériences et les informations nécessaires à la compréhension du fonctionnement actuel de la gestion des contraventions routières. 

Nous adressons une pensée particulière à nos parents, à notre famille ainsi qu'à nos proches pour leur soutien moral, matériel et leurs encouragements permanents. 

Enfin, nous remercions toutes les personnes qui, de près ou de loin, ont participé à la réalisation de ce travail. 

À toutes et à tous, nous exprimons notre profonde reconnaissance. 

I 

## **Liste des figures** 

|Figure 1 : Diagramme de cas d'utilisation..................................................................................  9|
|---|
|Figure 2 : Diagramme de classes..............................................................................................  10|
|Figure 3 : Diagramme de séquence – Authentification.............................................................  11|
|Figure 4 : Diagramme de séquence – Création d'une contravention........................................   12|
|Figure 5 : Diagramme de séquence – Validation d'une contravention......................................  13|
|Figure 6 : Diagramme de séquence – Paiement d'une amende.................................................  14|
|Figure 7 : Interface de connexion............................................................................................  20|
|Figure 8 : Tableau de bord Administrateur...............................................................................  21|
|Figure 9 : Tableau de bord Agent.............................................................................................  22|
|Figure 10 : Tableau de bord Citoyen........................................................................................  23|
|Figure 11 : Gestion des infractions...........................................................................................  24|
|Figure 12 : Gestion des contraventions.....................................................................................  25|
|Figure 13 : Paiement des amendes............................................................................................  26|
|Figure 14 : Tableau de bord statistique.....................................................................................  27|



II 

## **Sigles et abréviations** 

**API** : Application Programming Interface 

**BDD** : Base de Données 

**CSS** : Cascading Style Sheets 

**DRF** : Django REST Framework 

**HTML** : HyperText Markup Language 

**HTTP** : HyperText Transfer Protocol 

**HTTPS** : HyperText Transfer Protocol Secure 

**JWT** : JSON Web Token 

**JSON** : JavaScript Object Notation 

**MySQL** : Système de Gestion de Base de Données Relationnelle 

**REST** : Representational State Transfer 

**TIC** : Technologies de l'Information et de la Communication 

**UML** : Unified Modeling Language 

**UI** : User Interface 

**UX** : User Experience 

III 

## **INTRODUCTION GENERALE** 

Le développement des technologies de l'information et de la communication (TIC) a profondément transformé les méthodes de gestion dans les administrations publiques et les entreprises. Aujourd'hui, la numérisation des services permet d'améliorer la rapidité des traitements, la sécurité des données, la transparence des procédures et la qualité des services offerts aux usagers. 

Au Mali, la gestion des contraventions routières constitue une activité essentielle pour assurer le respect du Code de la route et contribuer à la sécurité des usagers. Cependant, dans plusieurs services, cette gestion repose encore sur des procédures manuelles basées sur des documents papier et des registres administratifs. Cette méthode présente plusieurs limites, notamment les erreurs de saisie, la difficulté de retrouver rapidement les informations, le manque de traçabilité des dossiers et les délais importants dans le traitement des contraventions. 

Face à ces difficultés, le recours à une application web apparaît comme une solution efficace pour moderniser ce processus. Une telle application permet de centraliser les données, de faciliter le travail des agents chargés des contrôles routiers, d'améliorer le suivi des contraventions et de permettre aux citoyens de consulter leurs dossiers et de suivre le paiement de leurs amendes. 

C'est dans cette optique que s'inscrit notre projet intitulé **« Conception et développement d'une application web de gestion des contraventions routières au Mali »** . L'objectif principal est de concevoir une plateforme web sécurisée permettant de gérer l'ensemble du processus de traitement des contraventions, depuis leur création jusqu'au paiement des amendes, tout en offrant des outils de suivi et d'analyse aux différents utilisateurs. 

Pour la réalisation de ce projet, nous avons utilisé des technologies modernes. Le backend a été développé avec **Python** , **Django** , **Django REST Framework** , **Django Channels** , **Celery** , **Redis** et **JWT** . Le frontend repose sur **React** , **TypeScript** , **Vite** , **Tailwind CSS** , **ShadCN UI** , **React Query** et **Recharts** . Les données sont stockées dans une base de données **MySQL** , garantissant leur intégrité et leur disponibilité. 

Le présent mémoire est organisé en quatre chapitres. Le premier présente les généralités sur la gestion des contraventions routières au Mali. Le deuxième expose le contexte du projet, ses objectifs et la solution proposée. Le troisième est consacré à l'analyse des besoins et à la conception du système à l'aide des diagrammes UML. Enfin, le quatrième présente les technologies utilisées ainsi que les principales fonctionnalités de l'application développée. 

1 

## **CHAPITRE 1 : GENERALITES** 

### Introduction 

La sécurité routière est un enjeu majeur pour le développement économique et social d'un pays. Au Mali, l'accroissement du nombre de véhicules et de la circulation entraîne une augmentation des infractions au Code de la route. Afin de garantir le respect de la réglementation et de protéger les usagers, les services compétents sont chargés de constater les infractions et de délivrer les contraventions. 

Cependant, la gestion de ces contraventions est encore largement basée sur des procédures manuelles, ce qui entraîne des lenteurs, des erreurs et des difficultés dans le suivi des dossiers. Ce chapitre présente le fonctionnement actuel de la gestion des contraventions routières au Mali, ses principales limites ainsi que l'intérêt de mettre en place une solution informatique. 

### 1.1 Présentation de la gestion des contraventions routières au Mali 

La contravention routière est une sanction administrative appliquée lorsqu'un conducteur ne respecte pas les dispositions du Code de la route. Elle permet de sanctionner les infractions commises afin de renforcer la discipline routière et de réduire les accidents de la circulation. 

Au Mali, les contraventions sont établies par les agents habilités lors des contrôles routiers. Après avoir constaté une infraction, l'agent identifie le contrevenant, relève les informations concernant le véhicule et rédige une contravention précisant la nature de l'infraction ainsi que le montant de l'amende. 

Ces informations sont ensuite utilisées pour le suivi administratif des dossiers et le paiement des amendes. Ce processus contribue au maintien de l'ordre public et à l'amélioration de la sécurité routière. 

### 1.2 Processus actuel de gestion des contraventions 

Le traitement d'une contravention suit généralement plusieurs étapes. 

Lors d'un contrôle routier, l'agent vérifie les documents du conducteur et du véhicule. En cas d'infraction, il établit une contravention contenant les informations relatives au contrevenant, au véhicule, à l'infraction constatée, à la date et au lieu du contrôle. 

La contravention est ensuite enregistrée par les services administratifs compétents. Le contrevenant doit s'acquitter de l'amende auprès des structures habilitées avant que le dossier ne soit clôturé. 

Ce processus implique principalement trois acteurs : 

- L’agent verbalisateur ; 

- L’administrateur chargé du suivi des dossiers ; 

- Le citoyen concerné par la contravention. 

Bien que cette méthode permette de gérer les infractions, elle nécessite souvent un traitement manuel qui ralentit les opérations administratives. 

2 

### 1.3 Limites du système actuel 

L'analyse du système actuel met en évidence plusieurs difficultés. 

La gestion manuelle des contraventions augmente le risque d'erreurs lors de la saisie des informations et complique la recherche des dossiers. Les documents papier peuvent être perdus ou détériorés, ce qui réduit la fiabilité des archives. 

Par ailleurs, le suivi des paiements reste complexe, car les informations sont souvent dispersées entre plusieurs services. Cette situation entraîne des retards dans le traitement des dossiers et limite la production de statistiques fiables. 

Les principales limites observées sont : 

- Lenteur des procédures administratives ; 

- Manque de centralisation des informations ; 

- Difficultés de suivi des paiements ; 

- Risque de perte des documents ; 

- Absence de statistiques automatiques ; 

- Faible traçabilité des opérations. 

Ces insuffisances justifient la mise en place d'un système informatisé permettant d'améliorer la gestion des contraventions. 

### 1.4 Solution proposée 

Pour répondre aux difficultés rencontrées, nous proposons le développement d'une application web de gestion des contraventions routières. 

Cette application permettra de centraliser toutes les informations dans une base de données unique et de simplifier les différentes opérations liées au traitement des contraventions. 

Les principales fonctionnalités proposées sont : 

- L’authentification des utilisateurs ; 

- La gestion des agents, des citoyens et des administrateurs ; 

- L’enregistrement des infractions ; 

- La création et le suivi des contraventions ; 

- La consultation des dossiers par les citoyens ; 

- Le suivi des paiements des amendes ; 

- La génération de rapports et de statistiques. 

Grâce à cette solution, les traitements administratifs seront plus rapides, plus fiables et mieux sécurisés. 

3 

### **1.5 Conclusion** 

Dans ce chapitre, nous avons présenté le contexte général de la gestion des contraventions routières au Mali ainsi que le fonctionnement du système actuellement utilisé. Cette analyse a permis de mettre en évidence les limites des procédures manuelles, notamment en matière de rapidité, de sécurité et de traçabilité des informations. 

Face à ces difficultés, le développement d'une application web apparaît comme une solution adaptée pour moderniser la gestion des contraventions. Cette application permettra d'améliorer le travail des services administratifs tout en offrant un meilleur service aux citoyens. 

Le chapitre suivant est consacré à la présentation du projet, à ses objectifs ainsi qu'à la solution retenue pour répondre aux besoins identifiés. 

4 

## **CHAPITRE 2 : PRESENTATION DU PROJET** 

### **Introduction** 

La modernisation des services publics constitue aujourd'hui un levier essentiel pour améliorer l'efficacité administrative et la qualité des services rendus aux citoyens. Dans le domaine de la sécurité routière, l'utilisation d'une application web permet d'automatiser les procédures, de sécuriser les données et de faciliter le suivi des contraventions. 

Ce chapitre présente le contexte du projet, les raisons qui ont motivé sa réalisation, les objectifs poursuivis, les résultats attendus ainsi que la solution proposée. 

### 2.1 Contexte du projet 

Au Mali, les services chargés de la sécurité routière effectuent quotidiennement des contrôles afin de veiller au respect du Code de la route. Les contraventions établies lors de ces contrôles sont généralement traitées à l'aide de procédures administratives manuelles. 

Cette méthode présente plusieurs difficultés, notamment le temps nécessaire au traitement des dossiers, les risques d'erreurs de saisie, la dispersion des informations et la difficulté de produire des statistiques fiables. Face à ces contraintes, la mise en place d'une application web apparaît comme une solution adaptée pour améliorer la gestion des contraventions routières. 

### 2.2 Justification du projet 

Le développement de cette application répond à la nécessité de moderniser le système actuel de gestion des contraventions. Une solution numérique permet de centraliser les informations, d'automatiser les traitements et d'assurer un meilleur suivi des opérations. 

Elle offre également plusieurs avantages : 

- Réduction des délais de traitement ; 

- Amélioration de la fiabilité des données ; 

- Accès rapide aux informations ; 

- Meilleure traçabilité des contraventions ; 

- Génération automatique de statistiques et de rapports ; 

- Renforcement de la sécurité des données. 

### 2.3 Objectif général 

L'objectif général de ce projet est de concevoir et de développer une application web permettant d'assurer une gestion centralisée, sécurisée et efficace des contraventions routières au Mali. 

### 2.4 Objectifs spécifiques 

Pour atteindre cet objectif, il est prévu de : 

- Développer une plateforme web sécurisée ; 

- Gérer les utilisateurs selon leurs rôles ; 

- Enregistrer les infractions routières ; 

5 

- Créer et suivre les contraventions ; 

- Permettre la consultation des contraventions par les citoyens ; 

- Assurer le suivi des paiements des amendes ; 

- Produire des statistiques et des rapports de gestion. 

### 2.5 Résultats attendus 

À l'issue de ce projet, les résultats suivants sont attendus : 

- Une application web opérationnelle ; 

- Une gestion centralisée des contraventions ; 

- Un meilleur suivi des paiements ; 

- Une réduction des erreurs administratives ; 

- Une amélioration de la sécurité des données ; 

- Des tableaux de bord permettant le suivi des activités ; 

- Une meilleure qualité des services offerts aux citoyens. 

### 2.6 Présentation de la structure d'accueil 

La structure concernée par ce projet est le service chargé de la gestion des contraventions routières au Mali. Sa mission est d'assurer l'application du Code de la route, le traitement des infractions et le suivi des paiements des amendes. 

L'application est destinée à trois catégories d'utilisateurs : 

- **L'administrateur** , qui gère les utilisateurs, les contraventions, les paiements et les statistiques ; 

- **L'agent verbalisateur** , qui enregistre les infractions et établit les contraventions ; 

- **Le citoyen** , qui consulte ses contraventions et suit le paiement de ses amendes. 

### 2.7 Étude de l'existant 

L'analyse du système actuel montre que la gestion des contraventions est essentiellement réalisée de manière manuelle. Les informations sont enregistrées sur des formulaires papier ou dans des fichiers administratifs, ce qui rend leur consultation et leur mise à jour plus difficiles. 

Cette méthode présente plusieurs inconvénients : 

- Lenteur des traitements ; 

- Risque d'erreurs lors de la saisie ; 

- Difficultés d'archivage ; 

- Manque de centralisation des informations ; 

- Faible production de statistiques. 

6 

### 2.8 Critique de l'existant 

Les limites du système actuel montrent la nécessité de moderniser le processus de gestion des contraventions. Les principales insuffisances concernent : 

- Le traitement manuel des dossiers ; 

- L’absence de suivi en temps réel ; 

- Le manque de sécurité des informations ; 

- La difficulté de retrouver rapidement une contravention ; 

- L’absence d'un tableau de bord pour le suivi des activités. 

Ces contraintes réduisent l'efficacité du service et compliquent le travail des agents. 

### 2.9 Solution proposée 

Pour répondre à ces difficultés, nous proposons une application web reposant sur une architecture moderne. 

L'application permettra notamment : 

- L’authentification sécurisée des utilisateurs ; 

- La gestion des agents, des citoyens et des administrateurs ; 

- L’enregistrement des infractions ; 

- La création et la consultation des contraventions ; 

- Le suivi des paiements des amendes ; 

- L’envoi de notifications ; 

- La génération automatique de rapports et de statistiques. 

Cette solution contribuera à améliorer la qualité des services administratifs tout en garantissant la sécurité et la disponibilité des données. 

### **2.10 Conclusion** 

Ce chapitre a présenté le contexte dans lequel s'inscrit le projet ainsi que les objectifs poursuivis. L'étude du système existant a permis d'identifier les principales insuffisances de la gestion actuelle des contraventions routières et de justifier la nécessité d'une solution informatique. 

La solution proposée vise à moderniser les procédures administratives grâce à une application web sécurisée, capable d'améliorer le suivi des contraventions, la gestion des paiements et la production des statistiques. 

Le chapitre suivant sera consacré à l'analyse des besoins et à la conception du système à l'aide des diagrammes UML. 

7 

## **CHAPITRE 3 : ANALYSE ET CONCEPTION** 

### **Introduction** 

La réussite d'un projet informatique dépend en grande partie de la qualité de son analyse et de sa conception. Cette étape permet d'identifier les besoins des utilisateurs, de définir les fonctionnalités attendues et de représenter le fonctionnement du système avant son développement. 

Dans ce chapitre, nous présentons les besoins fonctionnels et non fonctionnels de l'application ainsi que les principaux diagrammes UML utilisés pour modéliser le système. 

### 3.1 Analyse des besoins 

L'analyse des besoins consiste à déterminer les fonctionnalités que devra offrir l'application afin de répondre aux attentes des différents utilisateurs. 

Le système comporte trois principaux acteurs : 

- L’administrateur ; 

- L’agent verbalisateur ; 

- Le Citoyen. 

Chaque acteur dispose de droits et de fonctionnalités spécifiques. 

#### 3.1.1 Besoins fonctionnels 

Les besoins fonctionnels correspondent aux services que l'application doit fournir. 

#### **Besoins de l'Administrateur** 

L'administrateur doit pouvoir : 

- S’authentifier ; 

- Gérer les utilisateurs ; 

- Gérer les agents et les citoyens ; 

- Gérer les infractions ; 

- Consulter et valider les contraventions ; 

- Suivre les paiements ; 

- Consulter les statistiques ; 

- Générer des rapports. 

#### **Besoins de l'Agent verbalisateur** 

L'agent doit être capable de : 

- Se connecter à l'application ; 

- Enregistrer une infraction ; 

- Créer une contravention ; 

- Consulter l'historique des contraventions créées ; 

8 

####  Suivre l'état des contraventions. 

#### **Besoins du Citoyen** 

Le citoyen doit pouvoir : 

- Consulter ses contraventions ; 

- Consulter les détails d'une contravention ; 

- Suivre le paiement de ses amendes ; 

- Recevoir des notifications. 

#### 3.1.2 Besoins non fonctionnels 

L'application doit répondre aux exigences suivantes : 

- Garantir la sécurité des données ; 

- Assurer une authentification sécurisée avec JWT ; 

- Offrir une interface simple et intuitive ; 

- Être disponible et performante ; 

- Assurer la confidentialité des informations ; 

- Permettre une maintenance et une évolution faciles. 

### 3.2 Conception du système 

Après l'analyse des besoins, la conception a été réalisée à l'aide du langage UML ( _Unified Modeling Language_ ). Cette modélisation facilite la compréhension du système avant son développement. 

Les diagrammes retenus sont : 

- Le diagramme de cas d'utilisation ; 

- Le diagramme de classes ; 

- Les diagrammes de séquence. 

#### 3.2.1 Diagramme de cas d'utilisation 

Le diagramme de cas d'utilisation présente les interactions entre les utilisateurs et les différentes fonctionnalités offertes par l'application. 

Les principaux cas d'utilisation sont : 

- Authentification ; 

- Gestion des utilisateurs ; 

- Gestion des infractions ; 

- Création des contraventions ; 

- Validation des contraventions ; 

- Consultation des contraventions ; 

9 



<!-- Start of picture text -->
Diagramme de cas d'utilisation<br>Gérer les utilisateurs wooo 2-22 -- 2+ +--+ +--+ -------------------------<<Include>>-----,<br>Gérer les Infractions core c errr cere reer renee renee eee e+ -------<<include>>------, H<br>ZA Valider / Rejeter les Contravention )}--------------------------------<<Include>>--------, : '<br><!-- End of picture text -->



<!-- Start of picture text -->
Administrateur —S&S Traiter les litiges cores eceec eee ec ees eee es e-- + <cincluder>----------5 :| io<br>Consulterles paiements ++----------------------<<Include>> ------------, | ' : H<br>it : ‘<br>Consulter les statistiques ooeeeeeeeeeeeee-s+s-ceincludes>--------------) 1 : io<br>Générer les rapports ooo eee eee een eo +o ---------- <<Include>>---, biti i ot<br><!-- End of picture text -->



<!-- Start of picture text -->
C) jouter les preuves (photos' nec eeen enue,<br>17s pI (o ) <<Include>>-----..._> S'authentifier<br>— | <<include>> gored<br>Ajouter la géolocalisation “-* Prat _ ' a ' '<br>—] 7 wooo<<Include>> we \' :7 tt AAAha<br>Consulterses contraventions Pobotpor ds<br><!-- End of picture text -->



<!-- Start of picture text -->
Consulterses contraventions }------------------------------ceincludesseeee! so ott<br><!-- End of picture text -->



<!-- Start of picture text -->
Vérifier le QR Code annnennencennnneeneeeencnenencectncluderracesseeeeet of ob |<br>Citoyen toy<br>Contesterune contravention )}----------------------------------<<Include>>_--22--222222/ |<br>Consulter les notifications ttt nnn nna eeeeee nnn n nee ------ 2-22 ---<<include>>--------2-2-4<br><!-- End of picture text -->



<!-- Start of picture text -->
eS<br>-telephone : string<br>-motDePasse- string<br>-role = string<br>“| -statutsoging :  string L<br>+creerContravention() +validerContravention()<br>+ajouterPreuve() +rejeterContravention()<br>+consulterContraventions() -nomComplet : string +consulterPaiements()<br>4 -telepnone : string +consulterStatistiques()<br>+consulterContraventions() 1 *genererRapportsO<br><!-- End of picture text -->



<!-- Start of picture text -->
+verifierQRCode()<br>Gre +payerAmende()<br>+contesterContravention()<br>+consulterNotifications()<br>1<br>ue<br>. ><br>| _wrection “aSoaarareaca “dLitige<br>FEROGONS:§-gravite : stringSUNS * | numero-dateCreation: string- date = -dateDepot-motif: string= int: date<br>enema: secs -montant : decimal -statut : string<br>-idinfraction = int * 1 | -statut : string 0..1 | -decision : string<br>+creer() -typeVehicule - string Peut ne +soumettre()<br>+modifier(Q)+acEverD, creer GEavoir +analyserO.<br>+desactiver() pony+modifierO 4 +accepterO)+rejeterO<br><!-- End of picture text -->



<!-- Start of picture text -->
bosséde +c iotdkerohangerStatutQ) 1<br>[Pavement | sf cout<br>-montant : decimal 4 [____Notincation|<br>-datePaiement : date ‘¥ | -idNotification : int<br>-reference - string 4 -canal- string<br>~Statut : string GSES wt -etat - string<br>+effectuerPaiement() ee ~denerwol: date<br>+validerPaiement() 4longitude : double +envoyer()<br>+genererRecu() -adresse: string +marquerCommeLue()<br>-commune: string *erchiverO<br>+enregistrerPosition()<br>+obtenirCoordonnees()<br><!-- End of picture text -->



<!-- Start of picture text -->
1. Authentification<br>Utilisateur<br>1. saisirldentifiants() '<br>2. envoyeridentifiants()<br>3. vérifierldentifiants()<br><!-- End of picture text -->



<!-- Start of picture text -->
5. générerToken() |<br>6. retournerToken() ' !<br>Informations vérifiées:<br>-username / telephone<br>-mot de passe<br>-rdle de l'utilisateur<br><!-- End of picture text -->



<!-- Start of picture text -->
2. Creation d'une<br>Contravention par Agent<br>Agent ! ! ! !<br>| f.remplirFormulaireCTR() | : !<br>2. envoyerDonnées() !<br>3, créerContravention()<br>4, enregistrer()<br><!-- End of picture text -->



<!-- Start of picture text -->
5. confirmation<br>6. ajouterPreuves()<br>(géolocalisation, photos) _ | 7. enregistrer()<br>8. confirmation<br>9. retour(Succes) 7 ?<br>10. afficherConfirmation()<br><!-- End of picture text -->



<!-- Start of picture text -->
Consulte les infractions, calcule le montant,<br>genere le numéro automatique<br><!-- End of picture text -->



<!-- Start of picture text -->
3, Validation d'une Contravention<br>par 'Adminitrateur<br>| 4. rechercherContravention()<br>2. envoyerRecherche() !<br>3. eécupérerContraventio()<br><!-- End of picture text -->



<!-- Start of picture text -->
5. afficherContravention() eee4, donneesCTR |<br>6. valider<br>/ rejeter / | ! | :<br>demander complement _'<br>7. envoyerDécision() :<br>8.changerStatut) | !<br>9. enregistrer()<br>10. confirmation<br><!-- End of picture text -->



<!-- Start of picture text -->
11. notifierCitoyen() ree |<br>12. retoyr(Succés) <—<£ —___<br><!-- End of picture text -->



<!-- Start of picture text -->
[Décision}<br>[Valider] Statut = VALIDEE<br>[Rejeter] Statut = ANNULEE<br>[Demander complement] Statut = EN_ATTENTE_COMPLEMENT<br><!-- End of picture text -->



<!-- Start of picture text -->
4, Paiement dune Amende par le<br>Citoyen<br>“Interface feet Servicede<br>Olen ! ! ! ! |<br>| {.choisiContravention() : | |<br>2.demanderPaiement) | |<br>3. iniierPaiement()<br><!-- End of picture text -->



<!-- Start of picture text -->
4. rediigeVersOpérateur ! !<br>5, sasirCode| Confimer() Reser cp | |<br>' 6. verfierPaiement{) | !<br>1soa !<br>ay ! 8 enegitePaiement) ! !<br><!-- End of picture text -->



<!-- Start of picture text -->
(Paiement reussi !<br>}<br>! 0, changerStatut/Payée)|<br>| {{, envoyerNttication( /<br>| | ' —{2-nolfication envgyée<br>' | Paementéchoud) | | ! !<br>! | (3retourEchec) !<br><!-- End of picture text -->

### **3.3 Conclusion** 

Ce chapitre a permis d'identifier les besoins des différents utilisateurs et de définir les principales fonctionnalités de l'application. La modélisation réalisée à l'aide des diagrammes UML facilite la compréhension du système et constitue une base solide pour son développement. 

Le chapitre suivant présente les technologies utilisées, l'architecture de l'application ainsi que les principales interfaces développées. 

16 





django 

framework 

django ~ channels * 

















4 Shadcn/ui 



**Recharts** : permet la création de graphiques et de tableaux statistiques. 



#### 4.1.3 Base de données 

Les données de l'application sont stockées dans **MySQL 8** , un système de gestion de base de données relationnelle reconnu pour sa fiabilité, sa sécurité et ses bonnes performances. 



### 4.2 Architecture de l'application 

L'application adopte une architecture **client-serveur** . 

Elle est composée de trois couches principales : 

- Le **Frontend** , qui gère l'interface utilisateur ; 

- Le **Backend** , qui traite les requêtes et applique les règles métier ; 

- La **Base de données MySQL** , qui assure le stockage des informations. 

Les échanges entre le frontend et le backend sont réalisés via des API REST sécurisées par JWT. 

### 4.3 Présentation des principales interfaces 

Cette section présente les principales interfaces de l'application. 

#### 4.3.1 Interface de connexion 

Cette interface permet aux utilisateurs de s'authentifier en saisissant leur adresse électronique 

et leur mot de passe. Après vérification des informations, l'utilisateur est redirigé vers son espace de travail. 

20 



<!-- Start of picture text -->
Plateforme de Gestion<br>des Contraventions Routiéres<br>Systémne numérique centralise pour la gestion, le suivi et le paiement des<br>CcOMraventions routiéres: du District de Bamako.<br>Adminisiratenr Agent de Police Cifoyen<br>Mutetetios% cominwwertioms = Cawrbordies mcaetm (CreerCcccueanon ume comtrevecctcGES. StetetumeSaunt ech Comattelatechercer conteerto CUE U e saco| Sus e peaom re  boo<br><!-- End of picture text -->



<!-- Start of picture text -->
Aout ea<br>fe<br>Connexion<br>ial<br>Republique du Mali ‘tne alpoten<br>Platede Gaston des Conavetons<br>Mite paca?<br>i}<br><!-- End of picture text -->



<!-- Start of picture text -->
Fin nua<br>AN Conexioni<br>: i ar<br>= Aste<br>Republiguern Mali 4<br>Pivade sin: Cokes lento!<br>9 ites!<br><!-- End of picture text -->



<!-- Start of picture text -->
£) . Conexon<br>République du Mai ‘Numéro de-ilgphone: RSE XOXEKIO*<br>Pltefomede Gaston des Contraventons<br>tonsa<br>Mt<br>—<br>F ‘Sinaerite<br><!-- End of picture text -->



<!-- Start of picture text -->
«Créer un compte<br>£ a<br>République. m  du Mati; Primo’<br>Plateforme de Geston des Contraventions<br>TWtphae men<br>a Mote pasee®<br>ete;<br>o Seconnectar<br><!-- End of picture text -->



<!-- Start of picture text -->
Thee = lableal de bord &|<br>EPR 8 35000 FCFA |<br>Agants<br>lnfrmations 3 5 d 2 ‘a<br>S Commans,<br>( Poemante Evolution des revenus xo «= Matus<br>() Ltigae in iy i<br>Hotfiogtions i , — _—s a<br>a<br>© RapportAut } if eefea _<P ‘<br>Params en J<br>gl date 4<br>gina I<br>een ian I<br>Contraventions par commune CarteGPS — District de Bamako<br>iiecerm b — 4 inc a Hamas TLE WLUWa<br><!-- End of picture text -->



<!-- Start of picture text -->
7) hon Tableau de bord<br>+ Nouvelle contravention<br>cS Mes-coniaventions<br>Nolifiestions oie . ; .<br>Activite de la semaine Acces rapide<br>| Mon profil<br>fowls conwrbor ean conramerhoce<br>Nothcabor Bos graft<br>’ i i at Orn<br>Mes dernieres contraventions Vor iat<br>AUN DAME Coven BUN IAN! SHAE!<br>CTE-BID-2614 POOR E- Boubacar Girt 26000 POF ‘Ex atieme<br>CIE-BID-2614 -BO00T : Mariam Olata 20000 FOFA vance<br>CTR-ED-20)4-200000 Ta Qumar Tounkars BED POF Nottie<br>a CTRBED 2804-20 Hale Boutesar Ceca 20000 EFA ae<br><!-- End of picture text -->



<!-- Start of picture text -->
< Ema Gop Tableau de bord<br>) Tekiemuoo bord Pr a<br>ssi<br>OnE<br>iets " odinoil =: 155 000 FER<br>Mor prot<br>a ke, COA ES s t bane a fae BY IGE<br>= 8 Oy a) Oy<br>1 * 455000 FCFA 35000 FCFA 1<br>Yad Secs Paper ant ag carthata Qeohoboe<br>Nes contraventions récentes worked<br>RREHC GE Uy ke SuADE<br>[72-40~HGt-Haa a S000 FORA po attenia<br>Ca Ha ae 0000 FGFA ‘tice<br>Ti d-Ho Sa cla ES O00 FGRA Uchha<br><!-- End of picture text -->



<!-- Start of picture text -->
a) Tableaude bord<br>2 Contraventions how CAI: renin mua SAIUI AGIIDNS<br>i Agents Eunde de wilerce . rey 4p000 FoRA AC 3<br>S Ciloyens<br>A timation Seccomcen Rear Snare rautne 6000 FCFA ace ¢<br>8 Commune Condulte cans opinture bial lai ace +0000 FORA ACE 2<br>& Pasmants<br>(0) Utes esahariga arabe aera rutin ever 20000 FORA ace Zi<br>Notfeaiions<br>Non respeat du feu rouge bund CMITIOUE 26000 FORA atch ;<br>Rapport<br>a Audit Porat TALciaie Uncirata CNW 30000 FORA ace ,<br>Parambines<br>Condulte en diet d'Wrecee alive avila ciMioue BO000 FORA ach :<br>Furcharga de-pacragers iced rine mUvEnE 3000 RCRA ACE 5<br>Careotabon 8 sonfrerans resi emit 20000 FORA ace @<br>rena<br>beensde cone Paco] Seta hi mtn 5000 FORA Acie i<br><!-- End of picture text -->



<!-- Start of picture text -->
miei = Contfaventions 0@<br>Tabisau de bord Rochocchar conbeverdion Taig si‘ (, Eaicae | i, oY |<br>8 Contraventions fuera wade iw ACEH CUTER CMU wuWIaN statu ACtIONS<br>bt. Agents<br>Cioyens CIN-BED-24 0000 224-06 oy Petz Hdoucsa Disrra Bouaaoa Osnd Commure:| 25000 FCFA en altri: ; @<br>infrentions CTR ED-28 20 T02E6-11 Parks Fetoumats Kond Maram Distlo Commun || 20000 FCRA valde |<br>} Communes<br>j CRD Sod EL 2004-06-12 ae] Amingis Treord Oumar Tounkava Commune Iv BE 000 FCF Noten<br>& Palsmants<br>CR ED- 284-0 2-1] > elie Sbkou Benoge Boubanar Cian Comrie 20000 FCFA Payee i<br>(:) Litiges<br>Noliioatione CT 2854 f00085 UE. sss Mua Dare Heachaln Ban Commun | BODDD FFA eninge ;<br>Rapport. = ae - - : a<br>EHD 2-0 7408-16 Mh Hamidou Malgs Adama Sdite Commune | E000 FORA En attache a)<br>Audit<br>CRD OT 2004-06-08 ae Wabi Fatoumata Kont Oumar Tounkeva Commune Il E0000 FORA En retard i<br>Paradies:<br>CEAID- 2-H 206-05 oe Velirat ‘Amninats Treord Miarhare Diallo Commins:| TBOD0 FORA Cibunie i<br>Stoner<br><!-- End of picture text -->



<!-- Start of picture text -->
Tesaeau Oe board et uk dik ecu :<br>Z 30 000 FCFA 0<br>ccontmemntione Fa @<br>pani, —<br>Gtoyens Gog<br>infrmotions Hibeeoteac fi OLY LI inet iin ld ith | HELE ale sia<br>oe ad THAT Bouhpoar Clete mood FFA UUnenys Wix89 at WA:<br>© Palomante<br>a 704 00 TBF Oem Marisen Deatio 18000 FOFS foe 04 vee<br>Littges<br>Aotifioatant<br>Ranportt<br>7 Audit<br>Faremaiet<br>eee<br><!-- End of picture text -->



<!-- Start of picture text -->
Tete = lalleau de bord &(<br>5 t iM i, 0<br>eee 8 35000 FCFA or<br>Agunts<br>infractions 5 5 d rs) ia<br>) Commans<br>© Paamants Evolution des revenus a ‘Status<br>() Ltiges i lle t<br>Hobfioalions 3 / — _— P<br>Rapports as<br>Aut : ue aeseae = Le sas ‘\<br>Paramdires ea J<br>pS ears d<br>gina I<br>Dey 1<br>Contraventions par commune Carte GPS — District de Bamako<br>iiicones b ps 4 oi da Keak °TAS1 LAWa<br><!-- End of picture text -->

### 4.4 Tests de l'application 

Avant son déploiement, l'application a été testée afin de vérifier son bon fonctionnement. 

Les tests réalisés ont porté sur : 

- L’authentification des utilisateurs ; 

- La création des contraventions ; 

- La consultation des dossiers ; 

- Le suivi des paiements ; 

- La gestion des utilisateurs ; 

- La génération des statistiques. 

Les résultats obtenus montrent que les principales fonctionnalités répondent aux besoins définis lors de l'analyse du projet. 

### **4.5 Conclusion** 

Dans ce chapitre, nous avons présenté les technologies utilisées pour le développement de l'application ainsi que son architecture générale. Nous avons également décrit les principales interfaces développées et les tests réalisés pour vérifier le bon fonctionnement du système. 

L'application obtenue répond aux objectifs fixés en proposant une solution moderne, sécurisée et efficace pour la gestion des contraventions routières au Mali. 

29 

## **CONCLUSION GENERALE** 

La gestion des contraventions routières constitue un élément essentiel pour garantir le respect du Code de la route et améliorer la sécurité des usagers. Cependant, les méthodes traditionnelles de gestion présentent plusieurs limites, notamment la lenteur des procédures, les risques d'erreurs, les difficultés de suivi des dossiers et le manque de statistiques fiables. 

Dans le cadre de ce mémoire, nous avons conçu et développé une application web de gestion des contraventions routières au Mali afin de moderniser ce processus. Après l'analyse des besoins, nous avons modélisé le système à l'aide des diagrammes UML avant de procéder à son développement. 

L'application réalisée permet de gérer les utilisateurs, les infractions, les contraventions, les paiements et les statistiques à travers une interface simple, sécurisée et accessible. Elle facilite le travail des administrateurs et des agents verbalisateurs tout en offrant aux citoyens un meilleur accès aux informations relatives à leurs contraventions. 

Le développement de cette application a été réalisé à l'aide des technologies **Python** , **Django** , **Django REST Framework** , **Django Channels** , **Celery** , **Redis** , **React** , **TypeScript** , **Vite** , **Tailwind CSS** , **ShadCN UI** , **React Query** , **Recharts** et **MySQL** , garantissant une solution performante, évolutive et sécurisée. 

Ce projet nous a permis de mettre en pratique les connaissances acquises au cours de notre formation, notamment en analyse, conception, développement web et gestion de bases de données. Il constitue une contribution à la modernisation de la gestion des contraventions routières au Mali. 

## **Perspectives** 

Dans les prochaines versions de l'application, plusieurs améliorations pourront être apportées, notamment : 

- L’intégration des solutions de paiement mobile (Orange Money, Moov Money, etc.) ; 

- Le développement d'une application mobile pour les agents verbalisateurs ; 

- L’ajout de la géolocalisation des infractions ; 

- L’intégration d'un système de QR Code pour les contraventions ; 

- L’envoi automatique de notifications par SMS ou par courrier électronique ; 

- L’interconnexion avec les systèmes d'information des administrations concernées. 

Ces améliorations permettront de renforcer davantage les performances de l'application et d'offrir un service encore plus efficace aux utilisateurs. 

i 

## **BIBLIOGRAPHIE** 

### 1. Ouvrages et documentation technique 

Documentation officielle de Python : https://www.python.org / 20/06/2026 

Documentation officielle de Django : https://www.djangoproject.com / 20/06/2026 

Documentation de Django REST Framework : <u>https://www.django-rest-framework.org</u> / 20/06/2026 

Documentation de Django Channels : https://channels.readthedocs.io / 20/06/2026 

Documentation de Celery : <u>https://docs.celeryq.dev</u> / 22/06/2026 

Documentation de Redis : https://redis.io / 22/06/2026 

Documentation de React : https://react.dev / 23/06/2026 

Documentation de TypeScript : https://www.typescriptlang.org / 23/06/2026 

Documentation de Vite : https://vitejs.dev / 23/06/2026 

Documentation de Tailwind CSS : <u>https://tailwindcss.com</u> / 23/06/2026 

Documentation de ShadCN UI : https://ui.shadcn.com / 24/06/2026 

Documentation de React Query : https://tanstack.com/query / 24/06/2026 

Documentation de Recharts : https://recharts.org / 24/06/2026 

Documentation de MySQL : <u>https://dev.mysql.com/doc</u> / 21/06/2026 

Documentation UML (OMG) : <u>https://www.omg.org/spec/UML/ 20/06/2026</u> 

2. Ressources complémentaires 

   - **UML :** 

Livre : Debrauwer L (Van der Heyde F : _UML 2.5 – Initiation, exemples et exercices corrigés_ , Eyrolles). 

Roques P ( _UML 2 par la pratique_ , Eyrolles). 

Pressman R. S ( _Software Engineering: A Practitioner's Approach_ , McGrawHill). 

Sommerville I ( _Software Engineering_ , Pearson Education). 

Holovaty A. et Kaplan-Moss J., ( _The Definitive Guide to Django_ , Apress). 

Silberschatz A., Korth H. F. et Sudarshan S ( _Database System Concepts_ , McGraw-Hill). 

ii 

