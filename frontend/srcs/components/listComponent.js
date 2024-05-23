import { createButtonComponent, createToastComponent, renderDiv, createPhotoComponent } from "./globalComponent.js";
import { loadGameList, getUserFromServer, getProfilePicture } from "./userManager.js";
import { appState } from "./stateManager.js";
import { sendFriendRequest, acceptFriendRequest, denyFriendRequest, getFriendRequestList } from "./friendsList.js";

let gameList = [];

export async function showUserList() {
    const users = appState.users;
    const modalBody = document.querySelector('#addFriend .modal-body');
    const table = document.createElement('table');
    table.className = 'userlist-table';

    getFriendRequestList().then(async (requests) => {
        for (const user of users) {
            if (user.id === appState.userId) {
                continue;
            }
            if (appState.userProfile.friendlist.includes(user.id)) {
                continue;
            }
            const userProfile = appState.usersProfile.find(profile => profile.user === user.id);
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const idCell = document.createElement('td');
            const emailCell = document.createElement('td');
            const buttonCell = document.createElement('td');
            const photoCell = document.createElement('td');
            const photoComponent = await createPhotoComponent(user.id, userProfile.winrate);

            const pendingRequest = requests.find(request => request.from_user === appState.userId && request.to_user === user.id);
            let buttonComponent;
            if (pendingRequest) {
                const pElement = document.createElement('p');
                pElement.textContent = 'En attente de la confirmation';
                pElement.setAttribute('data-lang-key', 'waitConfirmFriend');
                buttonComponent = pElement;
            } else {
                buttonComponent = createButtonComponent('+', 'addFriendButton', '+', (event) => {
                    sendFriendRequest(appState.userId, user.username);
                    event.target.parentNode.removeChild(event.target);
                });
            }

            idCell.textContent = user.id;
            nameCell.textContent = user.username;
            emailCell.textContent = user.email;
            photoCell.appendChild(photoComponent);
            buttonCell.appendChild(buttonComponent);
            row.appendChild(photoCell);
            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(emailCell);
            row.appendChild(buttonCell);
            table.appendChild(row);
        }

        modalBody.appendChild(table);
    });
}

  async function updateGameList() {
    const newGameList = await loadGameList();
    if (JSON.stringify(newGameList) !== JSON.stringify(gameList)) {
        gameList = newGameList;
        // Define and implement showGameList function here
        showGameList();
    }
}

  export async function showGameList() {
    loadGameList();
    let games = appState.games;
    if (!Array.isArray(games)) {
        games = [];
    }
    const table = document.createElement('table');
    table.className = 'game-list-table';
    for (const game of games) {
        try {
            const row = document.createElement('tr');
            const p1Cell = document.createElement('td');
            const p2Cell = document.createElement('td');
            const statusCell = document.createElement('td');
  
            const p1User = await getUserFromServer(game.p1_id);
            const p2User = await getUserFromServer(game.p2_id);
            const p1PhotoUrl = await getProfilePicture(game.p1_id)
            const p1PhotoComponent = createPhotoComponent(p1PhotoUrl, p1User.username);
            const p2PhotoComponent = createPhotoComponent('./Design/User/Max-R_Headshot.jpg', p2User.username);
  
            p1Cell.appendChild(p1PhotoComponent);
            p1Cell.appendChild(document.createTextNode(`Score: ${game.p1_score}`));
            p2Cell.appendChild(p2PhotoComponent);
            p2Cell.appendChild(document.createTextNode(`Score: ${game.p2_score}`));
  
            const statusSpan = document.createElement('span');
            statusSpan.className = `status-game bg-${game.finished ? 'success' : 'danger'}`;
            statusSpan.textContent = game.finished ? 'Finished' : 'In Progress';
            statusCell.appendChild(statusSpan);
  
            if (game.p1_score > game.p2_score) {
                p1Cell.style.backgroundColor = 'green';
                p2Cell.style.backgroundColor = 'red';
            } else if (game.p1_score < game.p2_score) {
                p1Cell.style.backgroundColor = 'red';
                p2Cell.style.backgroundColor = 'green';
            } else if (game.p1_score === game.p2_score) {
                p1Cell.style.backgroundColor = 'yellow';
                p2Cell.style.backgroundColor = 'yellow';
            }
  
            row.appendChild(p1Cell);
            row.appendChild(statusCell);
            row.appendChild(p2Cell);
            table.appendChild(row);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }
  
    return table.outerHTML;
}

export async function showRanking() {
    let players = appState.players;
    if (!Array.isArray(players)) {
        players = [];
    }
    players.sort((a, b) => b.userProfile.winrate - a.userProfile.winrate)
    const table = document.createElement('table');
    table.className = 'ranking-table';
  
    for (const player of players) {
        try {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const scoreCell = document.createElement('td');
  
            const user = await getUserFromServer(player.id);
  
            const photoComponent = createPhotoComponent('./Design/User/Max-R_Headshot.jpg', user.username);
  
            nameCell.appendChild(photoComponent);
            nameCell.appendChild(document.createTextNode(user.username));
            scoreCell.appendChild(document.createTextNode(`Score: ${player.score}`));
  
            row.appendChild(nameCell);
            row.appendChild(scoreCell);
  
            table.appendChild(row);
        } catch (error) {
            console.error('Failed to create row for player', player, error);
        }
    }
  
    return table.outerHTML;
}