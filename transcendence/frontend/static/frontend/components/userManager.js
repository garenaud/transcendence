import { renderApp } from './stateManager.js';

let appState = {
    user: null
};

function setUser(user) {
    appState.user = user; // Définit l'utilisateur dans l'état de l'application
}

function getUser() {
    return appState.user; // Renvoie l'utilisateur actuel
}

function setUserPoints(pts){
    appState.points = pts;
}

export function loadUser() {
    console.log("je load les user");
    return fetch('components/fakeUser.json')
        .then(response => response.json())
        .then(user => {
            setUser(user);
            console.log('Données utilisateur chargées avec succès:', user);
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données utilisateur:', error);
            console.log('Données utilisateur:', appState.user); // Ajoutez cette ligne
        });
}

//loadUser(); // Chargez l'utilisateur au démarrage de l'application

export { getUser, setUser  };