import { getUser, loadUser } from './userManager.js';
import { renderNavbar } from './navbar.js'; 
import { renderHero } from './hero.js';
import { renderPong } from './pongComponent.js';
import { renderChat } from './chat.js';
import { renderRoulette, setupRoulette, runRoulette } from './roulette.js';
import { renderLogin } from './login.js';
import { renderBlackJack } from './BlackJack.js';
import { renderUserMenu } from './userMenu.js';
//import { renderSlotMachine } from './slotMachine.js';

// Initialisation de l'état de l'application et du current user
export let appState = {
    currentView: 'login',
    user: null,
    users: [],
    renderedComponents: {},
};

// Fonction pour créer et ajouter un div avec des composants spécifiques à la page
function renderDiv(components, className) {
    const div = document.createElement('div');
    div.classList.add(className);
    for (const component of components) {
        div.appendChild(component);
    }
    document.body.appendChild(div);
}

// Fonction pour changer la vue actuelle de l'application
export function changeView(newView) {
    location.hash = newView;
    appState.currentView = newView;
    localStorage.setItem('appState', JSON.stringify(appState));
    renderApp();
}

// Écouteur d'événement pour changer la vue lorsque l'URL change (rajoute le # à l'URL lorsqu'on change de vue)
window.addEventListener("hashchange", function() {
    appState.currentView = location.hash.substring(1);
    renderApp();
});

export function getCurrentView() {
    return appState.currentView;
}

// Fonction principale pour rendre l'application en fonction de l'état actuel
export async function renderApp() {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
        appState = JSON.parse(savedState);
    } else {
        const view = window.location.pathname.substring(1);
        appState.currentView = ['login', 'hero', 'game', 'chat'].includes(view) ? view : 'login';
    }
    if (!appState.renderedComponents) {
        appState.renderedComponents = {};
    }
    document.body.innerHTML = '';
    switch(appState.currentView) {
        case 'login':
            renderLogin();
            break;
        default:
            if (!appState.user) {
                console.log('loading user');
                await loadUser();
            }
            switch(appState.currentView) {
                case 'hero':
                    await renderHero();
                    renderNavbar(appState.user);
                    break;
                case 'game':
                    const game = await renderPong();
                    const game2 = await renderPong();
                    const roulette = await renderRoulette();
                    const BlackJack = await renderBlackJack();
                    const test = await renderBlackJack();
                    const test2 = await renderRoulette();
                    const test3 = await renderRoulette();
                    await renderDiv([roulette, BlackJack, test, test2, game, game2], 'row');
                    //await renderDiv([game, game2], 'row');
                    //console.log('appState.user game:', getUser());
                    renderNavbar(appState.user);
                    break;
                case 'chat':
                    const chat = await renderChat();
                    await renderDiv([chat], 'chat-div');
                    renderNavbar(appState.user);
                    break;
            }
        break;
    }
}
renderApp();
/* loadUser().then(() => {
    renderApp();
}); */