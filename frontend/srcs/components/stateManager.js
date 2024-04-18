import { getUser, loadUser, getCurrentUser } from './userManager.js';
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
import { createToastComponent, createButtonComponent, renderDiv } from './globalComponent.js';

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
}

// Écouteur d'événement pour changer la vue lorsque l'URL change (rajoute le # à l'URL lorsqu'on change de vue)
window.addEventListener("hashchange", function() {
    appState.currentView = location.hash.substring(1);
    renderApp();
});

// Fonction pour que l'historique du navigateur fonctionne correctement avec les vues de l'application
window.addEventListener("popstate", function() {
    appState.currentView = location.hash.substring(1);
});

export function getCurrentView() {
    return appState.currentView;
}

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
            }
            switch(appState.currentView) {
                case 'hero':
                    if (!appState.renderedComponents.hero || !appState.renderedComponents.navbar) {
                        await LanguageBtn();
                        await renderHero();
                        renderNavbar(appState.user);
                        const toastBtn = createButtonComponent('test', 'test', 'test', (event) => {
                            const toast = createToastComponent(null, 'cooooool', '<p>rigolo</p>');
                            document.body.appendChild(toast);
                          });
                        renderDiv([toastBtn], 'row');
                        appState.renderedComponents.hero = true;
                        appState.renderedComponents.navbar = true;
                    }
                    break;
                case 'game':
                    if (!appState.renderedComponents.game || !appState.renderedComponents.navbar) {
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