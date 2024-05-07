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
    urlHistory: ['login'],
    renderedComponents: {},
    language: 'fr'
};

// Fonction pour changer la vue actuelle de l'application
export function changeView(newView) {
    if (appState.currentView !== newView) {
        appState.currentView = newView;
        if (appState.urlHistory[appState.urlHistory.length - 1] !== newView) { // Ajoutez cette condition
            appState.urlHistory.push(newView);
        }
        // Supprimez les composants de la vue précédente de appState.renderedComponents
        for (let component in appState.renderedComponents) {
            if (component.startsWith(appState.currentView)) {
                delete appState.renderedComponents[component];
            }
        }
        sessionStorage.setItem('renderedComponents', JSON.stringify(appState.renderedComponents));
    }
    location.hash = newView;
    appState.currentView = newView;
    if (appState.urlHistory[appState.urlHistory.length - 1] !== newView) { // Ajoutez cette condition
        appState.urlHistory.push(newView);
    }
}

// Écouteur d'événement pour changer la vue lorsque l'URL change (rajoute le # à l'URL lorsqu'on change de vue)
window.addEventListener("hashchange", function() {
    const newView = location.hash.substring(1);
    if (appState.currentView !== newView) {
        appState.currentView = newView;
    }
    renderApp();
});

// Fonction pour que l'historique du navigateur fonctionne correctement avec les vues de l'application (popstate se declenche lorsque l'on presse sur precedent)
window.addEventListener("popstate", function() {
    const newView = location.hash.substring(1);
    if (newView === 'login' && appState.urlHistory.length === 2) {
        const confirmLogout = window.confirm('Si vous revenez à cette page, vous serez déconnecté. Êtes-vous sûr de vouloir continuer ?');
        if (confirmLogout) {
            // Déconnectez l'utilisateur et mettez à jour l'état de l'application
            // appState.user = null;
            // appState.currentView = newView;
            // appState.urlHistory.pop();
            console.log('bye bye mon ami tu as choisi de nous quitter!!!!');
        } else {
            // Annulez l'action précédente
            history.pushState(null, null, '#' + appState.urlHistory[appState.urlHistory.length - 1]);
        }
    } else {
        appState.currentView = newView;
        appState.urlHistory.pop();
        console.log("!!!!!!!!!!!!!!!!!!!!! urlHistory = ", appState.urlHistory);
    }
});

export function getCurrentView() {
    return appState.currentView;
}

// Fonction principale pour rendre l'application en fonction de l'état actuel
export async function renderApp() {
    if (!location.hash) {
        location.hash = '#login';
        //appState.urlHistory.push('login');
/*         await renderApp();
        return; */
    }
    // const savedState = sessionStorage.getItem('appState');
    if (appState) {
        //appState = JSON.parse(savedState);
        appState.renderedComponents = JSON.parse(sessionStorage.getItem('renderedComponents')) || {};
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
    sessionStorage.removeItem('appState');
}); */