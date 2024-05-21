import { getCookie, getProfilePicture } from "./userManager.js";
import { appState } from "./stateManager.js";
import { createPhotoComponent, createButtonComponent, createToastComponent } from "./globalComponent.js";

export function showFriendsList() {
    const users = appState.users;
    const modalBody = document.querySelector('#friendList .modal-body');
    const table = document.createElement('table');
    table.className = 'userlist-table';

    // Afficher les amis
    appState.userProfile.friendlist.forEach(friendId => {
        const friend = users.find(user => user.id === friendId);
        if (friend) {
            const friendProfile = appState.usersProfile.find(profile => profile.user === friend.id);
            addRow(friend, friendProfile, table, 'Ami');
        }
    });

    // Afficher les demandes d'amis
    getFriendRequestList().then(requests => {
        requests.forEach(request => {
            if (request.to_user === appState.userId) {
                const fromUser = users.find(user => user.id === request.from_user);
                if (fromUser) {
                    const fromUserProfile = appState.usersProfile.find(profile => profile.user === fromUser.id);
                    addRow(fromUser, fromUserProfile, table, 'Accepter', 'Refuser', request.id);
                }
            }
        });
    });

    modalBody.appendChild(table);
}

function addRow(user, userProfile, table, buttonText1, buttonText2, requestId) {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const photoCell = document.createElement('td');
    const buttonCell1 = document.createElement('td');
    const buttonCell2 = buttonText2 ? document.createElement('td') : null;

    const photoComponent = createPhotoComponent(getProfilePicture(user.id) ? userProfile.profile_picture : './Design/User/Max-R_Headshot.jpg', 100);
    const buttonComponent1 = createButtonComponent(buttonText1, 'addFriendButton', buttonText1, (event) => {
        if (buttonText1 === 'Accepter') {
            acceptFriendRequest(user.id, requestId);
        } else {
            sendFriendRequest(appState.userId, user.username);
        }
    });
    const buttonComponent2 = buttonText2 ? createButtonComponent(buttonText2, 'denyFriendButton', buttonText2, (event) => {
        denyFriendRequest(appState.userId, requestId);
    }) : null;

    nameCell.textContent = user.username;
    photoCell.appendChild(photoComponent);
    buttonCell1.appendChild(buttonComponent1);
    if (buttonCell2) {
        buttonCell2.appendChild(buttonComponent2);
    }

    row.appendChild(photoCell);
    row.appendChild(nameCell);
    row.appendChild(buttonCell1);
    if (buttonCell2) {
        row.appendChild(buttonCell2);
    }

    table.appendChild(row);
}

export function sendFriendRequest(fromId, toUsername) {
    const data = { username: fromId, password: toUsername };
    const csrfToken = getCookie('csrftoken');
    fetch('/api/send_friend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .then(createToastComponent('toast', 'FriendList', data))
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  export function acceptFriendRequest(userId, requestId) {
    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&userId:', userId, ' requestId:', requestId);
    const data = { username: userId, password: requestId };
    console.log('acceptFriendRequest data:', data);
    const csrfToken = getCookie('csrftoken');
    fetch('/api/accept_friend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  export function denyFriendRequest(userId, requestId) {
    const data = { username: userId, password: requestId };
    const csrfToken = getCookie('csrftoken');
    fetch('/api/deny_friend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  export function getFriendRequestList() {
    return fetch('/api/friendlist', {
      method: 'GET',
    })
    .then(response => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

export function updateFriendRequestsNotification() {
    getFriendRequestList().then(requests => {
        const pendingRequests = requests.filter(request => request.to_user === appState.userId);
        const notificationBubble = document.querySelector('.notification-bubble');
        if (pendingRequests.length > 0) {
            notificationBubble.textContent = pendingRequests.length;
            notificationBubble.style.display = 'block';
        } else {
            notificationBubble.style.display = 'none';
        }
    });
}
