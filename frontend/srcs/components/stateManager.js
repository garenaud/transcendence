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

let currentIndex = -1;

// Initialisation de l'état de l'application et du current user
export let appState = {
    currentView: 'login',
    user: null,
    userId: null,
    users: [],
    urlHistory: ['login'],
    renderedComponents: {},
    language: 'fr',
    newViewAdded: false
};

export function resetAppState() {
    appState = {
        currentView: 'login',
        user: null,
        userId: null,
        users: [],
        urlHistory: ['login'],
        renderedComponents: {},
        language: 'fr',
        newViewAdded: false
    };
}

// Fonction pour changer la vue actuelle de l'application
export function changeView(newView) {
    if (appState.currentView !== newView) {
        appState.currentView = newView;
        // Supprimez les composants de la vue précédente de appState.renderedComponents
        for (let component in appState.renderedComponents) {
            if (component.startsWith(appState.currentView)) {
                delete appState.renderedComponents[component];
            }
        }
        sessionStorage.setItem('renderedComponents', JSON.stringify(appState.renderedComponents));
    }
    appState.newViewAdded = true;
    location.hash = newView;
}

// Écouteur d'événement pour changer la vue lorsque l'URL change (rajoute le # à l'URL lorsqu'on change de vue)
window.addEventListener("hashchange", function() {
    const newView = location.hash.substring(1);
    if (appState.currentView !== newView) {
        appState.currentView = newView;
    }
    const currentUser = getCurrentUser();
    console.log("currentUser = ", currentUser);
    if (!currentUser && newView !== 'login') {
        window.location.hash = 'login';
        return;
    }
    renderApp();
});

// Fonction pour que l'historique du navigateur fonctionne correctement avec les vues de l'application (popstate se declenche lorsque l'on presse sur precedent)
window.addEventListener("popstate", function() {
    const newView = location.hash.substring(1);
    const newIndex = appState.urlHistory.lastIndexOf(newView);
    const currentUser = getCurrentUser();
    console.log("currentUser popstate = ", currentUser);
    if (!currentUser && newView !== 'login') {
        window.location.hash = 'login';
        return;
    }

    if (newView === 'login' && appState.urlHistory.length === 2) {
        const confirmLogout = window.confirm('Si vous revenez à cette page, vous serez déconnecté. Êtes-vous sûr de vouloir continuer ?');
        if (confirmLogout) {
            console.log('bye bye mon ami tu as choisi de nous quitter!!!!');
        } else {
            history.pushState(null, null, '#' + appState.urlHistory[appState.urlHistory.length - 1]);
        }
    } else if (appState.newViewAdded) {
        appState.currentView = newView;
        if (appState.urlHistory[appState.urlHistory.length - 1] !== newView) {
            appState.urlHistory.push(newView);
        }
        currentIndex++;
        appState.newViewAdded = false;
    } else if (newIndex < currentIndex) {
        appState.currentView = newView;
        if (appState.urlHistory[appState.urlHistory.length - 1] !== newView) {
            appState.urlHistory.push(newView);
        }
        currentIndex++;
    } else {
        appState.urlHistory.pop();
        currentIndex--;
    }

    console.log("!!!!!!!!!!!!!!!!!!!!! urlHistory = ", appState.urlHistory);
});

window.addEventListener("pushstate", function() {
    const newView = location.hash.substring(1);
    if (appState.currentView !== newView) {
        appState.currentView = newView;
        if (appState.urlHistory[appState.urlHistory.length - 1] !== newView) {
            appState.urlHistory.push(newView);
        }
    }
});

export function getCurrentView() {
    return appState.currentView;
}

// Fonction principale pour rendre l'application en fonction de l'état actuel
export async function renderApp() {
    initializeAppState();
    validateCurrentView();
    await renderCurrentView();
}

function initializeAppState() {
    if (!location.hash || appState.userId == 0) {
        location.hash = '#login';
    }
    if (appState) {
        appState.renderedComponents = JSON.parse(sessionStorage.getItem('renderedComponents')) || {};
        loadLanguage(appState.language);
    } else {
        const view = window.location.pathname.substring(1);
        appState.currentView = ['login', 'hero', 'game', 'chat'].includes(view) ? view : 'login';
        appState.language = 'fr';
    }
    appState.currentView = location.hash.substring(1) || 'login';
    document.body.innerHTML = '';
}

function validateCurrentView() {
    const validViews = ['login', 'game', 'hero'];
    if (!validViews.includes(appState.currentView)) {
        document.body.innerHTML = 
        '<div class="error-404"><img src="../Design/Mflury404.jpg"><h1 data-lang-key="error-404">Erreur 404 : Page non trouvée</h1><div>';
        throw new Error('Invalid view');
    }
    if (!appState.renderedComponents) {
        appState.renderedComponents = {};
    }
}

async function renderCurrentView() {
    switch(appState.currentView) {
        case 'login':
            await renderLoginView();
            break;
        default:
            await renderDefaultView();
            break;
    }
}

async function renderLoginView() {
    if (!appState.renderedComponents.login) {
        await LanguageBtn();
        renderLogin();
        appState.renderedComponents.login = true;
    } else {
        await LanguageBtn();
        renderLogin();
    }
}

async function renderDefaultView() {
    if (!appState.user) {
        console.log('loading user, appState = ', appState.user);
        await loadUser();
        await loadGameList();
    }
    switch(appState.currentView) {
        case 'hero':
            await renderHeroView();
            break;
        case 'game':
            await renderGameView();
            break;
    }
}

async function renderHeroView() {
    if (!document.querySelector('.navbar')) {
        console.log('appState = ', appState.user);
        await LanguageBtn();
        await renderHero();
        renderNavbar(appState.user);
        appState.renderedComponents.hero = true;
        appState.renderedComponents.navbar = true;
    }
}

async function renderGameView() {
    console.log(document.querySelector('.navbar-expand-lg'));
    console.log("appstate dans game: ", appState);
    if (!appState.renderedComponents.game) {
        await LanguageBtn();
        if(!document.querySelector('.navbar')){
            renderNavbar(appState.user);
        }
        const game = await renderPong();
        const game2 = await renderRun();
        const gameListHTML = await showGameList();
        const cardHistory = createListCardComponent('pongPlayed', 'Games', gameListHTML);
        await renderDiv([cardHistory, game], 'row');
        await LanguageBtn();
        appState.renderedComponents.game = true;
        appState.renderedComponents.navbar = true;
    }
    loadLanguage(appState.language);
}

renderApp();