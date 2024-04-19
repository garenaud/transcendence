import { createButtonComponent, createToastComponent, renderDiv, createPhotoComponent } from "./globalComponent";

function  showUserList() {
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