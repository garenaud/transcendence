import { changeView } from './stateManager.js';

export function renderNavbar(user){
  //const user = getUser();
  if (!user) {
    console.error('Aucun utilisateur n\'a été trouvé');
    return;
  }  
  
  function displayUserInfo(user) {
      let currentUser = user[0];
      const userInfoDiv = document.getElementById('nav-user');
      if (userInfoDiv) {
          userInfoDiv.innerHTML = `
          <div class="nav-user-info">
          <h4>${currentUser.name}</h4>
          <h6>${currentUser.points} pts</h6>
          </div>
          <div id="user-menu-button" class="nav-user-img">
                  <div id="user-menu-button" class="img_cont_nav">
                  <img src="${currentUser.profilePicture}" alt="User Image">
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
              </div>
              <div class="user-menu-title">
              <h2>${user.name}</h2>
              <h4>${user.points} pts</h4>
              </div>
              <div class="user-menu-info">
                  <li class="active">
                    <h2 class="fas fa-user-plus">    add a friend</h2>
                  </li>
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
    displayUserInfo(user);
    renderUserMenu(user[0]);
    setupButtonListener();
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
  document.querySelector('.close-menu-button').addEventListener('click', function() {
    document.getElementById('user-menu').style.display = 'none';
  });
}