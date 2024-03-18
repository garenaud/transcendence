import { loadUser } from './components/userManager.js';
import { renderApp } from './components/stateManager.js';
import { renderNavbar } from './components/navbar.js';


document.addEventListener('DOMContentLoaded', () => {
    renderApp(); // Cela rendra la vue initiale basée sur l'état actuel
});