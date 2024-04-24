import { getUser, loadUser, getCurrentUser, loadGameList } from './userManager.js';
import { renderNavbar } from './navbar.js'; 
import { renderHero } from './hero.js';
import { renderPong } from './pongComponent.js';
import { renderChat } from './chat.js';
import { renderRoulette, setupRoulette, runRoulette } from './roulette.js';
import { renderLogin } from './login.js';
import { renderRun } from './runGame.js';
import { renderUserMenu } from './userMenu.js';
import { LanguageBtn, loadLanguage } from './languageManager.js';
import { renderScratchGame } from './scratchGame.js';
import { createToastComponent, createButtonComponent, createPhotoComponent, createListCardComponent, renderDiv } from './globalComponent.js';
import { showUserList, showGameList } from './listComponent.js';

// Initialisation de l'état de l'application et du current user
export let appState = {
    currentView: 'login',
    user: null,
    users: [],
    renderedComponents: {},
    language: 'fr',
};

// Fonction pour changer la vue actuelle de l'application
export function changeView(newView) {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
        appState = JSON.parse(savedState);
    }
    if (appState.currentView !== newView) {
        appState.renderedComponents = {};
    }
    location.hash = newView;
    localStorage.setItem('appState', JSON.stringify(appState));

    history.pushState({ view: newView }, '');
}

// Écouteur d'événement pour changer la vue lorsque l'URL change (rajoute le # à l'URL lorsqu'on change de vue)
window.addEventListener("hashchange", function() {
    appState.currentView = location.hash.substring(1);
    renderApp();

    history.pushState({ view: appState.currentView }, '');
});

// Fonction pour que l'historique du navigateur fonctionne correctement avec les vues de l'application
window.addEventListener("popstate", function() {
    appState.currentView = location.hash.substring(1);
});

export function getCurrentView() {
    return appState.currentView;
}

window.addEventListener('beforeunload', function (e) {
    // Vérifiez si l'utilisateur est connecté et si l'état précédent était la page de connexion
    if (appState.user && history.state && history.state.view === 'login') {
        // Annulez l'événement par défaut et affichez une boîte de dialogue de confirmation
        console.error('User is logged in and going back to login page');
        e.preventDefault();
        var confirmationMessage = 'Si vous revenez à cette page, vous serez déconnecté. Êtes-vous sûr de vouloir continuer ?';
        e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
        return confirmationMessage; // Gecko, WebKit, Chrome <34
    }
});

// Fonction principale pour rendre l'application en fonction de l'état actuel
export async function renderApp() {
    if (!location.hash) {
        location.hash = '#login';
        await renderApp();
        return;
    }
    const savedState = localStorage.getItem('appState');
    if (savedState) {
        appState = JSON.parse(savedState);
        loadLanguage(appState.language);
    } else {
        const view = window.location.pathname.substring(1);
        appState.currentView = ['login', 'hero', 'game', 'chat'].includes(view) ? view : 'login';
        appState.language = 'fr';
    }
    appState.currentView = location.hash.substring(1) || 'login';
    document.body.innerHTML = '';
    if (!appState.renderedComponents) {
        appState.renderedComponents = {};
    }
    switch(appState.currentView) {
        case 'login':
            if (!appState.renderedComponents.login) {
                await LanguageBtn();
                renderLogin();
                appState.renderedComponents.login = true;
            }
            else {
                await LanguageBtn();
                renderLogin();
            }
            break;
        default:
            if (!appState.user) {
                console.log('loading user');
                await loadUser();
                await loadGameList();
            }
            switch(appState.currentView) {
                case 'hero':
                    if (!document.querySelector('.navbar')) {
                        await LanguageBtn();
                        await renderHero();
                        renderNavbar(appState.user);
                        appState.renderedComponents.hero = true;
                        appState.renderedComponents.navbar = true;
                    }
                    break;
                case 'game':
                    if (!document.querySelector('.navbar')) {
                        const game = await renderPong();
                        const game2 = await renderRun();
                        const roulette = await renderRoulette();
                        const test = await renderRoulette();
                        const test2 = await renderRoulette();
                        const test3 = await renderRoulette();
                        await renderDiv([roulette, test, test2, test3, game, game2], 'row');
                        await LanguageBtn();
                        renderNavbar(appState.user);
                        appState.renderedComponents.game = true;
                        appState.renderedComponents.navbar = true;
                    }
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

/* window.addEventListener('beforeunload', function (e) {
    // Vérifiez si l'utilisateur est connecté et n'est pas sur la page de connexion
    if (appState.user && window.location.hash !== '#login') {
        // Annulez l'événement par défaut et affichez une boîte de dialogue de confirmation
        e.preventDefault();
        var confirmationMessage = 'Si vous revenez à cette page, vous serez déconnecté. Êtes-vous sûr de vouloir continuer ?';
        e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
        return confirmationMessage; // Gecko, WebKit, Chrome <34
    }
});

window.addEventListener('unload', function () {
    // Déconnectez l'utilisateur
    appState.user = null;
    localStorage.removeItem('appState');
}); */