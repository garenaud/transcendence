import { getUser, loadUser } from './userManager.js';
import { renderNavbar } from './navbar.js'; // Ajustez le chemin selon l'organisation de vos fichiers
import { renderHero } from './hero.js';
import { renderGame } from './game.js';
import { renderChat } from './chat.js';
import { renderRoulette, setupRoulette } from './roulette.js';
import { renderLogin } from './login.js';
import { renderBlackJack } from './BlackJack.js';
//import { renderSlotMachine } from './slotMachine.js';

/* let appState = {
    currentView: 'login',
    user: null,
}; */

function renderDiv(components, className) {
    const div = document.createElement('div');
    div.classList.add(className);
    for (const component of components) {
        div.appendChild(component);
    }
    document.body.appendChild(div);
}

export function changeView(newView) {
    history.pushState({ view: newView }, "", newView);
    appState.currentView = newView;
    renderApp();
}

window.addEventListener("popstate", function(event) {
    if (event.state) {
        appState.currentView = event.state.view;
        renderApp();
    }
});

export function getCurrentView() {
    return appState.currentView;
}

export async function renderApp() {
    await loadUser();
    appState.user = getUser();
    document.body.innerHTML = '';
    switch(appState.currentView) {
        case 'login':
            renderLogin();
            break;
        case 'hero':
            renderRoulette();
            await renderHero();
            renderNavbar();
            break;
        case 'game':
            const game = await renderGame();
            const roulette = await renderRoulette();
            const BlackJack = await renderBlackJack();
            const test = await renderBlackJack();
            const test2 = await renderRoulette();
            const test3 = await renderRoulette();
            await renderDiv([roulette, BlackJack, test, test2, test3], 'game-div');
            renderNavbar();
            break;
        case 'chat':
            const chat = await renderChat();
            await renderDiv([chat], 'chat-div');
            renderNavbar(); 
            break;
    }
}

renderApp(); // Cela rendra la vue initiale basée sur l'état actuel