import { renderNavbar } from './navbar.js'; // Ajustez le chemin selon l'organisation de vos fichiers
import { renderHero } from './hero.js';
import { renderGame } from './game.js';
import { renderChat } from './chat.js';
import { renderRoulette } from './roulette.js';
import { renderLogin } from './login.js';
//import { renderSlotMachine } from './slotMachine.js';

let appState = {
    currentView: 'login',
    user: null, // Ajout d'un nouvel état pour l'utilisateur
};

export function changeView(newView) {
    appState.currentView = newView;
    renderApp(); // Appelez renderApp après avoir changé la vue
}

export function getCurrentView() {
    return appState.currentView;
}

export function setUser(user) {
    appState.user = user; // Définit l'utilisateur dans l'état de l'application
}

export function loadUser() {
    // Remplacer 'path/to/your/userData.json' par le chemin réel vers votre fichier JSON
    fetch('components/fakeUser.json')
        .then(response => response.json())
        .then(user => {
            setUser(user);
            renderApp(); // Rendre l'application après le chargement de l'utilisateur$
            console.log('Données utilisateur chargées avec succès:', user);
        })
        .catch(error => console.error('Erreur lors du chargement des données utilisateur:', error));
}

export function renderApp() {
    document.body.innerHTML = ''; // Nettoyez le contenu actuel
    switch(appState.currentView) {
        case 'login':
            renderLogin();
            break;
        case 'hero':
            renderHero();
            renderNavbar(); // Vous pouvez décider si Navbar doit être rendu avec chaque vue ou non
            break;
        case 'game':
            renderRoulette();
            //renderSlotMachine();
            renderGame();
            renderNavbar();
            break;
        case 'chat':
            renderChat();
            renderNavbar(); // Exemple, si vous souhaitez que Navbar soit toujours présent
            break;
        // Ajoutez d'autres cas au besoin
    }
}