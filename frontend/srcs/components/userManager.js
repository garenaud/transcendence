import { renderNavbar } from './navbar.js';
import { renderApp, appState, changeView, resetAppState } from './stateManager.js';

/* export let appState = {
    user: null
}; */

export function logoutUser() {
    fetch('auth/logout/' + appState.userId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            changeView('login');
            resetAppState();
            // appState.urlHistory = ['login'];
            sessionStorage.clear();
            window.location.reload();
        } else {
            console.error('Logout failed');
        }
    });
}

function updateUserOnServer(user) {
    console.log(user);
    let csrfToken = getCookie('csrftoken');
    let userForBackend = {
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,  // Assumant que 'username' est le nom d'utilisateur
        email: user.email,  // Assumant que 'email' est le login
        password: user.password  // Vous devez vous assurer que le mot de passe est correctement géré
    };
    console.log('Updating user:', userForBackend);
    fetch('https://localhost/api/user/' + user.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(userForBackend),
    })
    .then(response => {
        console.log('Server response:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('User updated:', data);
        getUserFromServer(user.id);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

export async function getUserFromServer(userId) {
    console.log('Fetching user with id:', userId);
    const response = await fetch('/api/user/' + userId);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user = await response.json();
    console.log('User fetched:', user);
    return user;
}

async function loadUserFromServer() {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
        const user = await getUserFromServer(userId);
        sessionStorage.setItem('user', JSON.stringify(user));
    }
}

export function getCurrentUser() {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
}

// Fonction pour définir l'utilisateur actuellement connecté
export function setCurrentUser(user) {
    sessionStorage.setItem('user', JSON.stringify(user));
}

function setUsername(username) {
    appState.user.username = username;
    sessionStorage.setItem('user', JSON.stringify(appState.user));
    updateUserOnServer(appState.user);
}

function setUserPoints(pts){
    appState.user.pts = pts;
    sessionStorage.setItem('user', JSON.stringify(appState.user));
}

function setUserProfilePicture(profilePicture){
    console.log('je commence le set picture');
    appState.user.profilePicture = profilePicture;
    sessionStorage.setItem('user', JSON.stringify(appState.user));
    console.log('appState.user apres setProfilePicture:', appState.user);
}

function getUser() {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
        appState.user = JSON.parse(storedUser);
    }
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
            appState.userId = Number(sessionStorage.getItem('userId'));
            console.log('userId:', appState.userId);
            appState.user = users.find(user => user.id === appState.userId);
            if (!appState.user.profilePicture) {
                appState.user.profilePicture = 'Design/User/Max-R_Headshot.jpg';
            }
            else {
                console.log('ben pas de photo par defaut');
            }
            appState.user.pts = 100;
            sessionStorage.setItem('user', JSON.stringify(appState.user));
            //console.log('appState.user:', appState.user);
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données utilisateur:', error);
            //console.log('Données utilisateur:', getUser());
        });
}

export function loadGameList() {
    return fetch('/api/gamelist')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(games => {
            console.log('Données de jeu chargées avec succès:', games);
            appState.games = games;
            return games;
            //console.log('appState.games:', appState.games);
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données de jeu:', error);
        });
}