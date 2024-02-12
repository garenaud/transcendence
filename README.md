# ft_transcendence

## REGLES

* **site avec/sans backend:** 
* 	Avec:  
	**->** pur [Ruby](https://rubyonrails.org/); (peut etre outrepassé via module Framework);  
	**->** Base de données: voir modules;

* **Frontend:**  
	**->** Developpé en [Javascript](https://fr.wikipedia.org/wiki/JavaScript) (OG sans Framework, ni extensions);  
	**/!\\** (modifié via un [Module: Frontend](https://i.ytimg.com/vi/JBT8DCVb8cw/maxresdefault.jpg));

* **Application simple-page:**  
		**->** Chargement dynamique des données;  
		**->** Bouton précédent et suivant du NAV;
* **Doit etre compatible avec la derniere maj stable de Chrome**  
	**->** 121.0.6167.65 / 18 January 2024;

* **Le projet est compilé avec docker compose:**  
	- [ ] Docker file;

## Jeu

# Contraintes  

*	**Doit avoir les memes contraintes que le FrontEnd;**  
			Sauf si Module graphique, [Module FrontEnd](https://www.google.com/search?client=firefox-b-d&q=toujours+pas);  
			Sinon, [Pong](https://worldwidegolf.vtexassets.com/assets/vtex.file-manager-graphql/images/972338f0-bfa6-4db1-aeab-6311e3efb297___1dad2ce064edff31ca2e142f772bbebb.png) Original 1972;  

* **Les 2joueurs sur le meme clavier:**  
		**->** Directement sur le Site web, avec le meme clavier;  
			*(Sauf si module a Distance);*  
*	**Joueur peut organiser un tournoi :**  
			**->** Plusieurs joueurs dans le tournoi;  
			**->** Indiquer clairement qui joue contre qui, ainsi que l'ordre de passage;  
*	**Systeme d'inscription obligatoire:**  
			**->** Début du tournoi, chaque joueur doit entrer son Alias;  
			**->** Les alias sont effacés a chaque nouveau tournoi;  
			*(Sauf si [Module de Gestion des Users](https://m.media-amazon.com/images/M/MV5BNTU4MDI1YzMtODIzMS00NzNhLTllMDUtZGE4MjZjZDBkMzI5XkEyXkFqcGdeQXVyMTI3MTYyMTkx._V1_.jpg));*  
*	**Systeme de Matchmaking:**  
			**->** Systeme du tournoi organise les match, et annonce la prochaine partie;  
*	**Systeme de Jeu:**  
			**->** La barre est a la meme speed pour les 2joueurs ([obvious](https://i.kym-cdn.com/entries/icons/facebook/000/002/658/cptobvious.jpg) ?);  
			*Meme si c'est une IA;*  

**Sécurité**
*	***Tout mot de passe stocké doit etre chiffré;***  
*	***Protégé contre les SQL et XSS injection;***  
*	***Backend ou autre fonctionnalités = connection HTTPS (wss);*** 
> [!CAUTION]
> FICHIER .ENV EN LOCAL UNIQUEMENT, INTERDIT SUR LE GIT FINAL (echec immédiat);


## ***Modules:***  
> [!NOTE]
>	7 Modules majeurs sont requis pour terminé.

>[!TIP]
>	Les modules mineurs = 0.5 d'un majeur  

## Web:
* **Majeur: Framework en Backend;**  
    **->** Framework a utilisé est [Django](https://www.djangoproject.com/).
* Mineur: Framework ou toolkit en frontend;  
	**->** Utilisation de [Bootstrap toolkit](https://getbootstrap.com/);  
*	Mineur: Database en Backend;  
	**->** Utilisation de [PostgreSQL](https://www.postgresql.org/); (en lien avec le Framework Backend;)  
*	**Majeur:	Stocker les pointages dans une blockchain;**  
	Blockchain choisie est [Ethereum](https://www.google.com/search?client=firefox-b-d&q=ethereum+blokchain);  
	Language: [Solidity](https://soliditylang.org/);  
	Le reste ? trop long aller voir vous [memes](https://www.reddit.com/r/memes/);

#
## Gestion utilisateur:
* **Majeur: Gestion user standard, authentification et user tournoi;**  
  **->** S'inscrire de maniere sécure;  
  **->** Player enregistré peuvent se co;  
  **->** Player choisit un alias visible en tournoi (unique);  
  **->** Player peuvent mettre a jour leurs info;  
  **->** Player peut choisir un avatar; Sinon un par [default](https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-blue-default-avatar-png-image_2813123.jpg);  
  **->** Player peut voir les autres player (co, pas co, en game);  
  **->** Profile du player affiche les Victoires, et les defaites;  
  **->** Players ont un historique de partie 1v1, [dates](https://images.immediate.co.uk/production/volatile/sites/30/2019/12/dates-fb2647e.jpg?resize=768,574), heures;  

> [!CAUTION]
> Gestion des doublons des Username et courriels; Justification demandé;

* **Majeur: Authentification a distance;**  
  **->**  Implémenter l'authentification ***[OAuth 2.0 authentification with 42](https://api.intra.42.fr/apidoc/guides/getting_started);***  
  **->**  Systeme d'authentification pour acceder en toute sécurité;  
  **->**  Obtenir les infos et permissions de l'autorité (42 api?) pour activer;  
  **->**  Échange sécurisé des tokens d'authentification;  
  **->**  More too see [here](https://www.youtube.com/watch?v=6elK8VI1rPs);

## Jouabilité et expérience user
* **Majeur: Joueur a distance;**  
  **->** Possible d'avoir 2joueurs distant (ordi différent, meme site meme [pong](https://worldwidegolf.vtexassets.com/assets/vtex.file-manager-graphql/images/972338f0-bfa6-4db1-aeab-6311e3efb297___1dad2ce064edff31ca2e142f772bbebb.png))

> [!TIP]
> Penser a au pb reséau, déco/crash, latence ([ping](https://seeklogo.com/images/P/pong-logo-9B33AA1261-seeklogo.com.png)).  

* **Majeur: Joueurs Multiples;**  
  **->** Plus de deux joueurs, chacun son clavier (jeu impair 3, 5); (Possible de faire un jeu a 4, map carré);  
* **Majeur: Ajout d'un second jeu avec historique et "Matchmaking"**  
  * Nouveau jeu, avec les memes fonctionnalités;  
  * Implémentez grosso merdo les memes fonctionnalités que dans le jeu pong (historique, stats, matchmaking)  
* **Mineur: Option de personnalisation du jeu**  
  * Offrir des options de personnalisation (power-ups), attaques, differentes map;  
  **->**  Pouvoir choisir le jeu, classique ou avec power-ups;  
  **->**  Toutes les personnalisation de jeu doivent s'appliquer aux autres jeux (jeu bonus);  
  **->**  Menu de réglages et interfaces pour ajuster le jeu (convivialement);  
  **->**  Constance dans les fonctionnalités (balanced game);  
* **Majeur: [Clavardage](https://www.google.com/search?client=firefox-b-d&q=clavardage) en direct;**  
  **->**  User doit pouvoir envoyer des **messages directs** aux autres;  
  **->**  User peut en bloquer, donc plu de visibilité de chat;  
  **->**  User peut inviter d'autres User a jouer via le chat;  
  **->**  Le systeme de tournoi doit envoyer un chat pour prevenir le User;  

## IA-Algo
* **Majeur: Adversaire controlé par une [IA](https://www.youtube.com/watch?v=-Zr7nI_Putk);**  

> [!CAUTION]
> l’utilisation d’un [A* algorithm](https://www.simplilearn.com/tutorials/artificial-intelligence-tutorial/a-star-algorithm) n’est pas permise pour réaliser cette tâche;  

  **->** IA qui a un bon niveau.  
  **->** IA a un comportement humain, IA doit simuler les entrées clavier, l'IA refresh toute les secondes, doit anticiper les rebons;  
> [!TIP]
> L'IA doit pouvoir utiliser les power-ups si [Module personnalisation de jeu](https://www.youtube.com/watch?v=yAmiCjrBTik);

  **->**  Logique de L'IA + processus de décision intelligente strategiquement;  
  **->**  IA s'adapte aux differents scénarios de gameplay, et user interactions;  
> [!CAUTION]
> Des explications en détails seront demandé, elle doit pouvoir gagner des games;

* **Mineur: tableau de bord user et statistique;**  
  **->**  Créer des statistiques dans un beau tableaux de bord;  
  **->**  Tableau de bord séparé pour les sessions de jeu, montrant des stats en details, données sur les resultats(?) et historique des matchs;  
  **->**  Tableau de bords ont une interface informative et intuitive pour analyser/suivre les données;  
  **->**  User peut voir son propre historique et statistiques de performances;  
  **->**  On peut ajouter n'importe quel métrique pertinente;  

## Cybersécurité  
  ***Les modules majeur** permettent de renforcer la sécurité du projet. Configuration de Pare-feu d'Application Web ([WAF](https://www.cloudflare.com/fr-fr/learning/ddos/glossary/web-application-firewall-waf/)) et de [ModSecurity](https://www.linode.com/docs/guides/securing-apache2-with-modsecurity/) et gestion sécurisé des secrets(?) avec [HashiCorp Vault](https://www.vaultproject.io/)*  
  ***Les modules mineur** complètent avec les options de conformité [RGPD](https://commission.europa.eu/law/law-topic/data-protection/data-protection-eu_en) anonymisations des données, suppréssion de compte, la [2FA](https://www.microsoft.com/fr-ch/security/business/security-101/what-is-two-factor-authentication-2fa) et les tokens web [JSON (JWT)](https://jwt.io/)*

* **Majeur: Pare-feu d'app WEB (WAF) ou ModSecurity avec config renforcé et use HashiCorp Vault (gestion secrets);**  
  **->** HashiCorp Vault poour gérer et stocker toute info sensible, comme clefs API, info de login et le .env.  
  **->** Configurer le pare-feu d'app (WAF) et ModSecurity afin de proteger contre les attaques;  
* **Mineur: Option de conformité RGPD;**  
  **->** Fonctionnalités RGPD: Les users peuvent demandé l'anonymisations des données;  
  **->** Outils permettant de gerer leurs données locales, voir, modifier ou suppr leurs infos perso;  
  **->** Outils permettant la suppression d'un compte;  
  **->** Communication claire et transparente avec les users sur leurs droit a la protec;
* **Majeur: 2FA et JWt;**  
  **->**  Implémenter la 2FA comme on la connait;  
  **->**  Utiliser un JWT comme methode d'authentication et d'autorisation.  
  **->**  Fournir une interface de config pour l'activaiton du 2FA avec option SMS, authentication app ou mail;  
  **->**  S'assurer que les jetons JWT sont envoyés et validé de manieres safe, pour check les accès non autorisé;

## Devops
  *Amélioration de l'infrastructure et de l'architecture du projet:*
   *Les modules majeurs traite de la config et de l'infra pour une gestion efficace en utilisant [ELK](https://aws.amazon.com/fr/what-is/elk-stack/), la conception du backend en tant que microservices pour plus de flexibilités et de [scalabilités](https://www.youtube.com/watch?v=Hy8kmNEo1i8), et MEP de [Prometheus](https://prometheus.io/)/[Grafana](https://grafana.com/) pour surveillance systeme;*
* **Majeur: Configuration de l'infra avec ELK pour la gestion des logs;**  
  **->** Deployer [Elasticsearch](https://www.elastic.co/fr/) pour stocker et indexer efficacement les données de journal, facile a consulter;   
  **->** Configurer [Logstash](https://www.oracle.com/fr/database/logstash-analyse-logs/) pour collecter, traiter et transformer les donnée et les envoyers vers Elasticsearch;   
  **->** Mettre en place [Kibana](https://www.elastic.co/fr/kibana) pour visualiser les données de journal, creation de tableaux de bord, et générations d'info via des evenements;  
  **->** Definir des politiques de rétention et d'archivage des données pour gerer le stockage;  
  **->** Mettre en place des mesures de sécurité pour proteger les donnes, et l'acces a ELK;  
* **Mineur: Systeme de monitoring**  
  **->** Deployer Prometheus en tant que trousse d'outils de surveillance/alertes pour surveiller la santé et les performances du systemes;  
  **->** Configurer des exportateurs de données/intégrations pour capturer les metriques de diffrents service/base de données et composants d'infra;  
  **->** Creer des tableaux de bord personnalisées et des visualisation a l'aide de Grafana pour founir les infos en temps reel;  
  **->** Configurer des regles d'alertes dans Prometheus pour detecter/reagir aux pb critiques et anomalies;  
  **->** Mettre en place des meca d'authentication sécurisés/controle d'acces pour Grafana pour proteger les données de surveillance;  
* **Majeur: Design de backend en microservices;**  
  **->** Diviser le backend en plus petits microservices peu couplés (?), chacun responsable de fonctions/fonctionnalités spé;  
  **->** Definir les limites claires et des interfaces de microservices pour developper/deployer et mettre a l'echelle indépendamment;  
  **->** Mettre en place des meca de com entre les microservices tels que des [API RESTful](https://www.redhat.com/fr/topics/api/what-is-a-rest-api) ou des files de messages, pour les echange de données et la coordination;  
  **->** Veiller a ce que chaques microservices est sa propre tache/metier unique.
## Graphiques
* **Majeur: Implémentations des techniques 3D avancées;**  
  *Utilisation de techniques 3D avancées avec [ThreeJS](https://threejs.org/)/[WebGL](https://get.webgl.org/)*  
  **->** compatible et optimales;  
## Accessibilités
 *Améliorer l'accessibilité de l'app web, compatibilité avec tous les appareils, extension de prise en charge des navigateurs, prise en charge de plusieurs langue, accessibilité pour les utilisateurs malvoyants et intégration du rendu coté serveur ([SSR]()) pour les performances et exp users;*  
* **Mineur: Support sur tout type d'appareils;**  
 **->** Reaction a différentes taille d'écran et orientations, user exp cohérente, ordi, tablettes et smartphone;  
 **->** Prise en compte des écrans tactiles, selon ce qui doit etre utilisé;  
* **Mineur: Étendre la compatibilité des navigateurs web;**  
 **->** Étendre les compatibilité de navigateur; (Deja fait avec la base Chromium);**  
 **->** Effectuer des test approfondis et des opti pour le nouveau navigateur;  
 **->** Gerer et regler tt problemes de compatibilités du nouveau nav;  
 **->** S'assurer une exp constante sur tout les navs;  
* **Mineur: Support d'autre langues**  
 **->** Minimums 3 langues;  
 **->** Menu déroulant de languages, facile a utiliser;  
 **->** Traduire les menus, en-tetes et informations importantes;  
 **->** User peut choisir sa langue préféré; Et la garder en memoire;  
* **Mineur: Accessibilité pour les malvoyants**
 **->** Prise en charge des lecteurs d'ecran;  
 **->** Texte altenartif clair et descriptif pour les images;  
 **->** Schema de couleur a fort contraste pour une meilleur lisibilité;  
 **->** Options pour la taille du texte;  
 **->** MAJ regulieres pour respecter les normes d'accessibilités;  
* **Mineur: Intégration du rendu coté serveur (SSR);**  
 **->** Implémenter [SSR](https://www.heavy.ai/technical-glossary/server-side-rendering) pour améliorer les temps de chargements/performance;  
 **->** S'assurer que le contenu est pré-rendu sur le server, et donné au user ensuite, pour de chargements plus rapides;  
 **->** Optimiser le référencement [(SEO)](https://www.lesdigivores.ch/bases-seo-referencement-site-web/) en donnant au moteur de recherche du contenu HTML pré-rendu;  
 **->** exp user cohérente en bénéficiant des avantages du SSR;  

## Orienté objet
* **Majeur: Remplacer le jeu pong de base, par un jeu [Pong](https://worldwidegolf.vtexassets.com/assets/vtex.file-manager-graphql/images/972338f0-bfa6-4db1-aeab-6311e3efb297___1dad2ce064edff31ca2e142f772bbebb.png) coté server**
 **->** Développer la logique coté server, afin de gérer le gameplay, mouvement de balle, comptage de points et interactions avec les joueurs;  
 **->** Créer une API qui expose les ressources nécessaires et les points d'acces pour Pong, permettant une utilisation du partiel du jeu via CLI et interface web;  
 **->** Concevoir et mettre en place des points d'accés de l'API pour prendre en charge l'init du jeu, le controle des joueurs et MAJ du jeu;  
 **->** Le jeu doit etre agréable et fluide;
 **->** Intégrer le jeu coté serveur, avec l'app web, permettant de jouer directement sur le site web;  
* **Majeur: Activation du gameplay du Jeu, via interface CLI contre les users Web, avec une intégration API**  
 *Créer une interface en ligne de commande (CLI) qui permet aux users de jouer au jeu, contre les joueurs utilisant le web*  
 **->** Créer une app CLI robuste, permettant aux users de la CLI de start des games/d'y participer;  
 **->** Utiliser l'api pour la communication entre la CLI et l'app web.  
 **->** Developper un méca d'authentification des users CLI au sein du CLI, avec accès sécurisé a l'app WEB;  
 **->** Synchro en temps réel entre la CLI et les users WEB garantissanet des intéraction cohérentes;
 **->** User CLI peut creer des games avec un joueurs WEB;
 **->** Fournir une documentation pour utiliser efficacement la CLI; (tuto ?)  

> [!CAUTION]
> Le Module Majeur CLI est fortement recommandé avec le Module API;  

## **Bonus**  
* Cinq points par **module mineur**;
* Dix points par **module majeur**;

> [!CAUTION]
> L’utilisation de librairies et de frameworks qui font le travail à votre place est strictement interdite. Chaque partie du sujet va explicitement présenter les technologies autorisées que vous pouvez utiliser. Cependant, il est autorisé et même recommandé d’utiliser tout ce qui est possible pour simplifier certaines actions. Il est important de noter que tous les outils ou ressources utilisés doivent être justifiés. Veullez noter que simplifier ne signifie pas accomplir votre travail.

# **GLHF**


# What is chosen:
- [ ] Module Graphique 10pts;
- [ ] Module IA 10pts;
- [ ] 2FA cyber 10pts;
- [ ] BakcEnd MicroServices 10pts;
- [ ] Joueurs a distance 10pts;
- [ ] Jeu en CLI 10pts ?;
- [ ] Jeu coté serveur 10pts;
- [ ] Multilangues ????? 5pts;

