import { loadUser, getUser } from './userManager.js';
import { changeView } from './stateManager.js';

export function renderNavbar(){
  console.log('renderNavbar');
    const user = getUser();
    console.log(user);
    if (!user) {
      console.error('Aucun utilisateur n\'a été trouvé');
      return;
    }

    function displayUserInfo(user) {
        console.log('on commence les user info');
        console.log(user);
        let currentUser = user[0];
        const userInfoDiv = document.getElementById('nav-user');
        if (userInfoDiv) {
            userInfoDiv.innerHTML = `
            <div class="nav-user-info">
            <h4>${currentUser.name}</h4>
            <h6>${currentUser.points} pts</h6>
            </div>
            <div class="nav-user-img">
                    <div class="img_cont_nav">
                    <img src="${currentUser.profilePicture}" alt="User Image">
                    </div>
            </div>
            `;
        }
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
    console.log('je viens de faire la navbar html');
    console.log(user);
    //displayUserInfo(user);
    }
    insertNavbarHTML();
    console.log(document.getElementById('nav-user'))
    displayUserInfo(user);
    setupButtonListener();
}

function    setupButtonListener() {
  document.getElementById('navChatBtn').addEventListener('click', function() {
      changeView('chat');
  });
  document.getElementById('navGameBtn').addEventListener('click', function() {
      changeView('game');
  });
}