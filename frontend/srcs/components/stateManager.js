import { getUser, loadUser } from './userManager.js';
import { renderNavbar } from './navbar.js'; 
import { renderHero } from './hero.js';
import { renderGame } from './game.js';
import { renderChat } from './chat.js';
import { renderRoulette, setupRoulette, runRoulette } from './roulette.js';
import { renderLogin } from './login.js';
import { renderBlackJack } from './BlackJack.js';
import { renderUserMenu } from './userMenu.js';
//import { renderSlotMachine } from './slotMachine.js';

export let appState = {
    currentView: 'login',
    user: null,
    users: [],
    renderedComponents: {},
};

function renderDiv(components, className) {
    const div = document.createElement('div');
    div.classList.add(className);
    for (const component of components) {
        div.appendChild(component);
    }
    document.body.appendChild(div);
}

export function changeView(newView) {
    location.hash = newView;
    appState.currentView = newView;
    localStorage.setItem('appState', JSON.stringify(appState));
    renderApp();
}

window.addEventListener("hashchange", function() {
    appState.currentView = location.hash.substring(1);
    renderApp();
});

export function getCurrentView() {
    return appState.currentView;
}

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
                    if (!appState.renderedComponents.hero) {
                        await renderHero();
                        appState.renderedComponents.hero = true;
                    }
                    if (!appState.renderedComponents.navbar) {
                        renderNavbar(appState.user);
                        appState.renderedComponents.navbar = true;
                    }
                    break;
                case 'game':
                    const game = await renderGame();
                    const game2 = await renderGame();
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