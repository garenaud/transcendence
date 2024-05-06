import { createButtonComponent, createToastComponent, renderDiv, createPhotoComponent } from "./globalComponent.js";
import { loadGameList } from "./userManager.js";
import { appState } from "./stateManager.js";

export function  showUserList() {
    const users = appState.users;
    const modalBody = document.querySelector('#addFriend .modal-body');
    const table = document.createElement('table');
    table.className = 'userlist-table';
    users.forEach(user => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const idCell = document.createElement('td');
      const emailCell = document.createElement('td');
      const buttonCell = document.createElement('td');
      const photoCell = document.createElement('td');
      const photoComponent = createPhotoComponent('./Design/User/Max-R_Headshot.jpg', 100);
      const buttonComponent = createButtonComponent('+', 'addFriendButton', '+', (event) => {
        console.log(`Button clicked for user ${user.id}`);});
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
  
    });
    modalBody.appendChild(table);
  }

  export async function showGameList() {
    const games = await loadGameList();
    const table = document.createElement('table');
    table.className = 'game-list-table';
  
    games.forEach(game => {
        const row = document.createElement('tr');
        const p1Cell = document.createElement('td');
        const p2Cell = document.createElement('td');
        const statusCell = document.createElement('td');
  
        const p1PhotoComponent = createPhotoComponent('./Design/User/Max-R_Headshot.jpg', game.p1_id);
        const p2PhotoComponent = createPhotoComponent('./Design/User/Max-R_Headshot.jpg', game.p2_id);
  
        p1Cell.appendChild(p1PhotoComponent);
        p1Cell.appendChild(document.createTextNode(`Score: ${game.p1_score}`));
        p2Cell.appendChild(p2PhotoComponent);
        p2Cell.appendChild(document.createTextNode(`Score: ${game.p2_score}`));
  
        // Create a span for the game status
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
    });
  
    return table.outerHTML;
  }