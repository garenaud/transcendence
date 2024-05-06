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
    userId: null,
    users: [],
    urlHistory: [],
    renderedComponents: {},
    language: 'fr'
};

// Fonction pour changer la vue actuelle de l'application
export function changeView(newView) {
    console.log("test appState.currentview =", appState.currentView, " new view =", newView, " appState =", appState);
    if (appState.currentView !== newView) {
        // Supprimez les composants de la vue précédente de appState.renderedComponents
        for (let component in appState.renderedComponents) {
            if (component.startsWith(appState.currentView)) {
                delete appState.renderedComponents[component];
            }
        }
        localStorage.setItem('renderedComponents', JSON.stringify(appState.renderedComponents));
    }
    // Si l'utilisateur revient à la page de connexion
    if (newView === 'login' && appState.user) {
        window.onpopstate = function (event) {
            if (history.state && history.state.view === 'login') {
                const confirmLogout = confirm('Si vous revenez à cette page, vous serez déconnecté. Êtes-vous sûr de vouloir continuer ?');
                if (confirmLogout) {
                    console.log('normalement logout')
                } else {
                    history.forward();
                }
            }
        };
        window.dispatchEvent(new PopStateEvent('popstate', { state: { view: newView } }));
    } else {
        window.onpopstate = null;
    }
    location.hash = newView;
    appState.currentView = newView;
}

// Écouteur d'événement pour changer la vue lorsque l'URL change (rajoute le # à l'URL lorsqu'on change de vue)
window.addEventListener("hashchange", function() {
    appState.currentView = location.hash.substring(1);
    appState.urlHistory.push(appState.currentView);
    renderApp();

    //history.pushState({ view: appState.currentView }, '');
});

// Fonction pour que l'historique du navigateur fonctionne correctement avec les vues de l'application
window.addEventListener("popstate", function() {
    appState.currentView = location.hash.substring(1);
    appState.urlHistory.pop();
});

window.addEventListener('popstate', function(event) {
    console.log('Bouton précédent pressé');
    console.log('URL précédente:', appState.urlHistory[appState.urlHistory.length - 1]);
    console.log('Historique:', history);
    console.log('Longueur de l\'historique:', history.length);
    console.log('État de l\'historique:', history.state);
    console.log('Restauration du défilement:', history.scrollRestoration);
});

export function getCurrentView() {
    return appState.currentView;
}

/* window.addEventListener('beforeunload', function (e) {
    // Vérifiez si l'utilisateur est connecté et si l'état précédent était la page de connexion
    if (appState.user && history.state && history.state.view === 'login') {
        // Annulez l'événement par défaut et affichez une boîte de dialogue de confirmation
        console.error('User is logged in and going back to login page');
        e.preventDefault();
        var confirmationMessage = 'Si vous revenez à cette page, vous serez déconnecté. Êtes-vous sûr de vouloir continuer ?';
        e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
        return confirmationMessage; // Gecko, WebKit, Chrome <34
    }
}); */

// Fonction principale pour rendre l'application en fonction de l'état actuel
export async function renderApp() {
    if (!location.hash) {
        location.hash = '#login';
        appState.urlHistory.push('login');
        await renderApp();
        return;
    }
    // const savedState = localStorage.getItem('appState');
    if (appState) {
        //appState = JSON.parse(savedState);
        appState.renderedComponents = JSON.parse(localStorage.getItem('renderedComponents')) || {};
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
                console.log('loading user, appState = ', appState.user);
                await loadUser();
                await loadGameList();
            }
            switch(appState.currentView) {
                case 'hero':
                    if (!document.querySelector('.navbar')) {
                        console.log('appState = ', appState.user);
                        await LanguageBtn();
                        await renderHero();
                        renderNavbar(appState.user);
                        appState.renderedComponents.hero = true;
                        appState.renderedComponents.navbar = true;
                    }
                    break;
                case 'game':
                    console.log(document.querySelector('.navbar-expand-lg'));
                    console.log("appstate dans game: ", appState);
                    loadLanguage(appState.language);
                    if (!appState.renderedComponents.game) {
                        await LanguageBtn();
                        loadLanguage(appState.language);
                        renderNavbar(appState.user);
                        const game = await renderPong();
                        const game2 = await renderRun();
                        await renderDiv([game, game2], 'row');
                        await LanguageBtn();
                        // renderNavbar(appState.user);
                        appState.renderedComponents.game = true;
                        appState.renderedComponents.navbar = true;
                    } else {
                        renderNavbar(appState.user);
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