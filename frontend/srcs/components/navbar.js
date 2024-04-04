import { changeView, appState } from './stateManager.js';
import { getUser, setUserProfilePicture, setUsername } from './userManager.js';

export function renderNavbar(user){
  //const user = getUser();
  if (!user) {
    console.error('Aucun utilisateur n\'a été trouvé');
    return;
  }  
  
function displayUserInfo(user) {
      //let currentUser = user[0];
      const userInfoDiv = document.getElementById('nav-user');
      if (userInfoDiv) {
          userInfoDiv.innerHTML = `
          <div class="nav-user-info d-none d-md-block">
          <h4>${user.username}</h4>
          <h6>${user.pts} pts</h6>
          </div>
          <div id="user-menu-button" class="nav-user-img d-none d-md-block">
                  <div id="user-menu-button" class="img_cont_nav">
                  <img src="${user.profilePicture}" alt="User Image">
                  </div>
          </div>
          `;
      }
  }
  
  function renderUserMenu(user) {
    const userMenuHTML = `
        <div id="user-menu" class="user-menu-hidden">
            <div class="user-menu-img">
                <img src="${user.profilePicture}" alt="User Image">
                <button type="button" class="close close-menu-button" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>
                <button type="button" class="edit edit-menu-button btn btn-primary" aria-label="Edit" data-toggle="modal" data-target="#editPicture"> <span aria-hidden="true">&#9998;</span> </button>
            </div>
            <div class="user-menu-title">
                <h3>${user.username}</h3>
                <h4>${user.pts} pts</h4>
            </div>
            <div class="user-menu-info">
                <button type="button" class="user-menu-li" aria-label="Edit" data-toggle="modal" data-target="#addFriend"> 
                    <i class="fas fa-user-plus"></i><h4>  add a friend</h4>
                </button>
                <li class="user-menu-li">
                    <i class="fa-solid fa-cog"></i><h4>  set your profile</h4>
                </li>
                <button id="logoutBtn" class="btn btn-outline-light btn-lg px-5">Logout</button>
            </div>
        </div>

        <!-- Modal set user -->
        <div class="modal fade" id="editPicture" tabindex="-1" role="dialog" aria-labelledby="editPictureLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editPictureLabel">Edit picture</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                      <form>
                      <label for="newProfilePicture"  class="text-white">Nouvelle image</label>
                        <div class="input-group">
                          <input type="text" class="form-control" placeholder="URL of your new image" id="newProfilePicture" aria-describedby="basic-addon1">
                          <div class="input-group-append">
                            <button class="btn btn-success" type="button">preview</button>
                          </div>
                          <img id="preview" style="display: none;" />
                        </div>
                          <div class="form-group">
                          <label for="formGroupExampleInput"  class="text-white">Nouveau username</label>
                          <input type="text" class="form-control" id="newUsername" placeholder="Username">
                        </div>
                      </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button id="userSaveChange" type="button" class="btn btn-primary"  data-dismiss="modal">Save changes</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal add a friend -->
        <div class="modal fade" id="addFriend" tabindex="-1" role="dialog" aria-labelledby="addFriendLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editPictureLabel">Add a friend</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body text-white">

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button id="userSaveChange" type="button" class="btn btn-primary"  data-dismiss="modal">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;      
    document.body.insertAdjacentHTML('beforeend', userMenuHTML);
}  

    function insertNavbarHTML() {
        const navbarHTML = `
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon fas fa-bars"></span>
      </button>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
      <ul class="nav-div-btn navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-glowing-btn">
          <button id='navChatBtn' class='glowing-btn'><span class='glowing-txt'>C<span class='faulty-letter'>L</span>ASSEMENT</span></button>
        </li>
        <li class="nav-glowing-btn">
          <button id='navGameBtn' class='glowing-btn'><span class='glowing-txt'>O<span class='faulty-letter'>P</span>TIONS</span></button>
        </li>
      </ul>
    </div>
    <a class="collapse navbar-collapse navbar-brand navbar-logo" href="#"><img src="Design/LogoTranscendance3.png" alt=""></a>
      <div class="nav-user" id="nav-user">

        </div>
      </div>
    </div>
  </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
  }
  insertNavbarHTML();
  console.log('users navbar:', appState.users);
  displayUserInfo(user);
  renderUserMenu(user);
  setupButtonListener();
  showUserList();
}

function    setupButtonListener() {
  document.getElementById('navChatBtn').addEventListener('click', function() {
      changeView('hero');
  });
  
  document.getElementById('navGameBtn').addEventListener('click', function() {
      changeView('game');
  });

  document.getElementById('user-menu-button').addEventListener('click', function() {
    const userMenu = document.getElementById('user-menu');
    if (userMenu.style.display === 'block') {
      userMenu.style.display = 'none';
    } else {
      userMenu.style.display = 'block';
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', function() {
    // Supprimez les informations de l'utilisateur de appState
    appState.user = null;

    // Supprimez les informations de l'utilisateur du localStorage
    localStorage.removeItem('appState');

    // Redirigez l'utilisateur vers la page de connexion
    changeView('login');
});

  document.querySelector('.close-menu-button').addEventListener('click', function() {
    document.getElementById('user-menu').style.display = 'none';
  });

  document.querySelector('#newProfilePicture').addEventListener('input', function() {
    var url = document.querySelector('#newProfilePicture').value;
    var preview = document.querySelector('#preview');
    preview.src = url;
    preview.style.display = 'block';
  });

  function updateUserInfoInNavbar(user) {
    const userInfoDiv = document.getElementById('nav-user');
    if (userInfoDiv) {
        userInfoDiv.innerHTML = `
        <div class="nav-user-info">
        <h4>${user.username}</h4>
        <h6>${user.pts} pts</h6>
        </div>
        <div id="user-menu-button" class="nav-user-img">
                <div id="user-menu-button-inner" class="img_cont_nav">
                <img src="${user.profilePicture}" alt="User Image">
                </div>
        </div>
        `;

        document.getElementById('user-menu-button-inner').addEventListener('click', function() {
            const userMenu = document.getElementById('user-menu');
            if (userMenu.style.display === 'block') {
                userMenu.style.display = 'none';
            } else {
                userMenu.style.display = 'block';
            }
        });
    }
}

  document.querySelector('#userSaveChange').addEventListener('click', function() {
    console.log('Click on save changes')
    const newProfilePicture = document.querySelector('#newProfilePicture').value;
    const newUsername = document.querySelector('#newUsername').value;
    console.log('newProfilePicture:', newProfilePicture);
    if (newProfilePicture) {
      setUserProfilePicture(newProfilePicture);
      const displayedProfilePicture = document.querySelector('.user-menu-img img');
      displayedProfilePicture.src = newProfilePicture;
      //const navbarProfilePicture = document.querySelector('navbar-selector img'); 
      updateUserInfoInNavbar(appState.user);
    }
    if (newUsername) {
      setUsername(newUsername);
      const displayedUsername = document.querySelector('.user-menu-title');
      displayedUsername.textContent = newUsername;
      updateUserInfoInNavbar(appState.user);
    }
  });
}

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
    idCell.textContent = user.id;
    nameCell.textContent = user.username;
    emailCell.textContent = user.email;
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(emailCell);
    table.appendChild(row);
  });
  modalBody.appendChild(table);
}