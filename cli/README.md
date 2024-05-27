## CLI

# Install
* **Docker or from sources**
Cette application CLI peut etre compilee depuis les sources ou dockerizee.

* **Docker**
	* Decommenter la partie CLI dans le docker-compose a la racine du projet Transcendence
	* Utiliser [make cli]() pour se connecter au container.
	* Lancer l'application en entrant [cli]() dans le terminal du docker

* **From sources**
	* Pour compiler l'application depuis les sources, il faut avoir [cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html) et [rust]() d'installer.
	* Se deplacer a la racine du dossier [cli]()
	* Lancer la commande [cargo install --path .](). Le binaire sera automatiquement installer dans [/bin] et il sera possible de le lancer avec la commande [cli]()

	* **To uninstall from sources**
		* Se deplacer a la racine du dosser [cli]()
		* Lancer la commande [cargo uninstall]()

# Lancement
* Lors du lancement de l'application, l'IP du serveur nous est demander. Aucun port n'est requis. Le serveur peut etre distant, il est important de noter qu'en cas de lancement de l'application par le docker, localhost ne fonctionnera pas, neanmoins il est possible, uniquement dans le cas de l'application dockerizee, d'atteindre le serveur par le bias de l'adresse [nginx]() (A condition que le serveur soit sur le meme PC que le cli)

# Utilisation
* Une fois le serveur entre, l'app demande un user + password. Il n'est PAS possible de creer un user ou de le modifier depuis le CLI.
* **Menu**
	* Il existe 3 menu:
	*	**->** le principal (apparait apres la connexion de l'utilisateur)
	*	**->** le menu Pong (permet de rejoindre le matchmaking, creer une partie privee ou en rejoindre une)
	*	**->** le menu Tournament (permet de rejoindre ou de creer un tournoi)
	
* **Jouer**
	* ***Settings***
	* W - Monter le paddle
	* S - Descendre le paddle
