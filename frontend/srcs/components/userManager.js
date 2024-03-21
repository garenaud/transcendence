import { renderApp, appState } from './stateManager.js';

/* export let appState = {
    user: null
}; */

function getUser() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        appState.user = JSON.parse(storedUser);
    }
    return appState.user;
}

function setUsername(username) {
    appState.user.username = username;
    localStorage.setItem('user', JSON.stringify(appState.user));
}

function setUserPoints(pts){
    appState.user.pts = pts;
    localStorage.setItem('user', JSON.stringify(appState.user));
}

function setUserProfilePicture(profilePicture){
    console.log('je commence le set picture');
    appState.user.profilePicture = profilePicture;
    localStorage.setItem('user', JSON.stringify(appState.user));
    console.log('appState.user apres setProfilePicture:', appState.user);
}

export { getUser, setUsername, setUserPoints, setUserProfilePicture };

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
            //console.log('appState.users:', appState.users);
            let userId = Number(localStorage.getItem('userId'));
            appState.user = users.find(user => user.id === userId);
            if (!appState.user.profilePicture) {
                appState.user.profilePicture = 'Design/User/Max-R_Headshot.jpg';
            }
            appState.user.pts = 100;
            localStorage.setItem('user', JSON.stringify(appState.user));
            //console.log('appState.user:', appState.user);
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données utilisateur:', error);
            //console.log('Données utilisateur:', getUser());
        });
}