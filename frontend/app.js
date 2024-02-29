import { loadUser } from './components/userManager.js';
import { renderApp } from './components/stateManager.js';
import { renderNavbar } from './components/navbar.js';



/* loadUser().then(() => {
    console.log('de la merde!!!!');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('fuck it');
        renderApp();
        renderNavbar();
    });
}); */

//import { renderApp } from './components/stateManager.js';

document.addEventListener('DOMContentLoaded', () => {
    renderApp(); // Cela rendra la vue initiale basée sur l'état actuel
});