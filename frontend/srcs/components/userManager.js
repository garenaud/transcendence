import { renderNavbar } from './navbar.js';
import { renderApp, appState, changeView} from './stateManager.js';

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
            sessionStorage.clear();
            appState.isLogged = false;
            changeView('login');
            window.location.reload();
        } else {
            console.error('Logout failed');
        }
    });
}

function updateUserOnServer(user) {
    let csrfToken = getCookie('csrftoken');
    let userForBackend = {
        first_name: user.user.first_name,
        last_name: user.user.last_name,
        username: user.user.username,  // Assumant que 'username' est le nom d'utilisateur
        email: user.user.email,  // Assumant que 'email' est le login
        password: user.user.password  // Vous devez vous assurer que le mot de passe est correctement géré
    };
    fetch('https://localhost/api/user/' + appState.userId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(userForBackend),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        getUserFromServer(appState.userId);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}
export function getProfilePicture(userId) {
	return fetch(`/api/get_image/${userId}`)
	.then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.blob();
	})
	.then(imageBlob => {
        const imageUrl = URL.createObjectURL(imageBlob);
        return imageUrl;
	})
	.catch(error => {
		console.error('Erreur lors du chargement de l\'image de l\'utilisateur:', error.message);
	});
}

export function setProfilePicture(file) {
    let formData = new FormData();
    formData.append('filename', file);
    let csrfToken = getCookie('csrftoken');

    fetch(`/api/post_image/${appState.userId}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(json => {
        if (json.image_url) {
            appState.user.profilePicture = json.image_url;
            sessionStorage.setItem('user', JSON.stringify(appState.user));
        }
    })
    .catch(error => {
        console.error('Erreur lors de la sauvegarde de l\'image de l\'utilisateur:', error);
    });
}

export async function getUserFromServer(userId) {
    const response = await fetch('/api/user/' + userId);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user = await response.json();
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
    updateUserOnServer(appState);
}

function setUserPoints(pts){
    appState.user.pts = pts;
    sessionStorage.setItem('user', JSON.stringify(appState.user));
}

function setUserProfilePicture(profilePicture){
    appState.user.profilePicture = profilePicture;
    sessionStorage.setItem('user', JSON.stringify(appState.user));
}

function getUser() {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
        appState.user = JSON.parse(storedUser);
    }
}

export { getUser, setUsername, setUserPoints, setUserProfilePicture };

export async function loadUser() {
    try {
        const response = await fetch('/api/userlist');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const users = await response.json();
        await loadUserProfile();
        appState.users = users;
        appState.userId = Number(sessionStorage.getItem('userId'));
        appState.isLogged = true;
        appState.user = users.find(user => user.id === appState.userId);
        appState.userProfile = appState.usersProfile.find(usersProfile => usersProfile.user === appState.userId);
/*         if (!appState.userProfile.profile_picture) {
            appState.user.profilePicture = 'Design/User/Max-R_Headshot.jpg';
        }
        else {
            getProfilePicture(appState.userId);
        } */
        appState.user.pts = 100;
        sessionStorage.setItem('user', JSON.stringify(appState.user));
    } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
    }
}

export function loadUserProfile() {
    return fetch('/api/userprofilelist')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(usersProfile => {
        appState.usersProfile = usersProfile;
    })
    .catch(error => {
        console.error('Erreur lors du chargement des données utilisateur:', error);
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
            appState.games = Array.isArray(games) ? games : [];
            return "";
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données de jeu:', error);
        });
}

window.onload = function() {
    loadUser();
};