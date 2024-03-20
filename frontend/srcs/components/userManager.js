import { renderApp, appState } from './stateManager.js';

/* export let appState = {
    user: null
}; */

function getUser() {
    return appState.user;
}

function setUser(user) {
    appState.user = user; 
}

function setUserPoints(pts){
    appState.points = pts;
}

export { getUser, setUser  };

export function loadUser() {
    return fetch('/api/userlist')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(users => {
            console.log('Données utilisateur chargées avec succès:', users);
            appState.users = users;
            console.log('appState.users:', appState.users);
            let userId = Number(localStorage.getItem('userId'));
            appState.user = users.find(user => user.id === userId);
            appState.user.profilePicture = 'Design/User/Max-R_Headshot.jpg';
            appState.user.pts = 100;
            console.log('appState.user:', appState.user);
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données utilisateur:', error);
            console.log('Données utilisateur:', getUser());
        });
}