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
        console.log('Server response:', response);
        if (response.ok) {
            sessionStorage.clear();
            appState.userId = 0;
            changeView('login');
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

export function getProfilePicture(userId) {
    fetch(`/api/get_picture/${appState.userId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
    })
    .then(imageBlob => {
        let objectURL = URL.createObjectURL(imageBlob);
        appState.user.profilePicture = objectURL;
    })
    .catch(error => {
        console.error('Erreur lors du chargement de l\'image de l\'utilisateur:', error);
    });
}

export function setProfilePicture(file) {
        let formData = new FormData();
    formData.append('filename', file);

    fetch(`/api/post_picture/${appState.userId}`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('+++++++++++++++++++++++++Server response:', response)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(json => {
        console.log(json.message);
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
    console.log('Fetching user with id:', userId);
    const response = await fetch('/api/user/' + userId);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user = await response.json();
    console.log('User fetched:', user);
    console.log('appState.user:', appState.Id);
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
            loadUserProfile();
            appState.users = users;
            appState.userId = Number(sessionStorage.getItem('userId'));
            console.log('userId:', appState.userId);
            appState.user = users.find(user => user.id === appState.userId);
            appState.userProfile = appState.usersProfile.find(userProfile => appState.userId === appState.userId);
            console.log('appState.userProfile = ', appState.userProfile);
            console.log('???????????????????????????????????????????????????????????appState.userProfile.profilePicture = ', appState.userProfile.profilePicture);
            if (!appState.userProfile.profilePicture) {
                appState.user.profilePicture = 'Design/User/Max-R_Headshot.jpg';
            }
            else {
                getProfilePicture(appState.userId);
            }
            appState.user.pts = 100;
            console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%appState = ', appState);
            sessionStorage.setItem('user', JSON.stringify(appState.user));
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données utilisateur:', error);
        });
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
        console.log('Userprofile chargées avec succès:', usersProfile);
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
            console.log('Données de jeu chargées avec succès:', games);
            appState.games = games;
            return "";
            //console.log('appState.games:', appState.games);
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données de jeu:', error);
        });
}