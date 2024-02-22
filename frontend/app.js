import { renderNavbar } from './components/navbar.js';
import { renderHero } from './components/hero.js';
import { renderGame } from './components/game.js';
import { renderChat } from './components/chat.js';
document.addEventListener('DOMContentLoaded', () => {
    //renderChat();
    //renderGame();
    renderHero();
    renderNavbar();
    // Initialiser d'autres composants ici
});