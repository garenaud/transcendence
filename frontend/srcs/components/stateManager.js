import { getUser, loadUser } from './userManager.js';
import { renderNavbar } from './navbar.js'; 
import { renderHero } from './hero.js';
import { renderGame } from './game.js';
import { renderChat } from './chat.js';
import { renderRoulette, setupRoulette } from './roulette.js';
import { renderLogin } from './login.js';
import { renderBlackJack } from './BlackJack.js';
import { renderUserMenu } from './userMenu.js';
//import { renderSlotMachine } from './slotMachine.js';

export let appState = {
    currentView: 'login',
    user: null,
    users: [],
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

/* loadUser().then(() => {
    renderApp();
}); */

export async function renderApp() {
    document.body.innerHTML = '';
    switch(appState.currentView) {
        case 'login':
            renderLogin();
            break;
        default:
            await loadUser();
            switch(appState.currentView) {
                case 'hero':
                    renderRoulette();
                    await renderHero();
                    console.log('appState.user hero:', getUser());
                    renderNavbar(getUser());
                    break;
                case 'game':
                    const game = await renderGame();
                    const roulette = await renderRoulette();
                    const BlackJack = await renderBlackJack();
                    const test = await renderBlackJack();
                    const test2 = await renderRoulette();
                    const test3 = await renderRoulette();
                    await renderDiv([roulette, BlackJack, test, test2], 'game-div');
                    console.log('appState.user game:', getUser());
                    renderNavbar(getUser());
                    break;
                case 'chat':
                    const chat = await renderChat();
                    await renderDiv([chat], 'chat-div');
                    renderNavbar(getUser());
                    break;
            }
        break;
    }
}

renderApp();