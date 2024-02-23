// Importez ici les fonctions nécessaires ou assurez-vous qu'elles soient accessibles globalement.
import { renderNavbar } from './navbar.js'; // Ajustez le chemin selon l'organisation de vos fichiers
import { renderHero } from './hero.js';
import { renderGame } from './game.js';
import { renderChat } from './chat.js';

let appState = {
    currentView: 'hero',
};

export function changeView(newView) {
    appState.currentView = newView;
    renderApp(); // Appelez renderApp après avoir changé la vue
}

export function getCurrentView() {
    return appState.currentView;
}

export function renderApp() {
    document.body.innerHTML = ''; // Nettoyez le contenu actuel
    switch(appState.currentView) {
        case 'hero':
            renderHero();
            renderNavbar(); // Vous pouvez décider si Navbar doit être rendu avec chaque vue ou non
            break;
        case 'game':
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
