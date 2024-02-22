import { renderNavbar } from './components/navbar.js';
import { renderGame } from './components/game.js';
import { renderChat } from './components/chat.js';
document.addEventListener('DOMContentLoaded', () => {
    renderChat();
    renderGame();
    renderNavbar();
    // Initialiser d'autres composants ici
});