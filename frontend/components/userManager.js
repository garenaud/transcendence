import { renderApp } from './stateManager.js';

let appState = {
    user: null
};

function setUser(user) {
    appState.user = user; 
}

function getUser() {
    return appState.user;
}

function setUserPoints(pts){
    appState.points = pts;
}

export function loadUser() {
    return fetch('components/fakeUser.json')
        .then(response => response.json())
        .then(user => {
            setUser(user);
            console.log('Données utilisateur chargées avec succès:', user);
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données utilisateur:', error);
            console.log('Données utilisateur:', appState.user);
        });
}

export { getUser, setUser  };