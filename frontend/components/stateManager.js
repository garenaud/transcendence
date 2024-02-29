import { getUser, loadUser } from './userManager.js';
import { renderNavbar } from './navbar.js'; // Ajustez le chemin selon l'organisation de vos fichiers
import { renderHero } from './hero.js';
import { renderGame } from './game.js';
import { renderChat } from './chat.js';
import { renderRoulette, setupRoulette } from './roulette.js';
import { renderLogin } from './login.js';
import { renderBlackJack } from './BlackJack.js';
//import { renderSlotMachine } from './slotMachine.js';

let appState = {
    currentView: 'login',
    user: null, // Ajout d'un nouvel état pour l'utilisateur
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
    appState.currentView = newView;
    renderApp();
}

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
            await renderDiv([roulette, BlackJack, game], 'game-div');
            renderNavbar();
            break;
        case 'chat':
            await renderChat();
            renderNavbar(); 
            break;
    }
}

renderApp(); // Cela rendra la vue initiale basée sur l'état actuel