import { renderApp } from './components/stateManager.js';
import { renderRoulette } from './components/roulette.js';

document.addEventListener('DOMContentLoaded', () => {
    renderApp(); // Cela rendra la vue initiale basée sur l'état actuel
});
