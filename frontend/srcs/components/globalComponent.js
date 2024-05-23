import { showGameList } from "./listComponent.js";
import { getProfilePicture, getUserFromServer } from "./userManager.js";

export async function createListCardComponent(dataLangKey, titre, listHTML) {
  const listCardHTML = `
  <div class="card-game-wrapper glowing">
      <div class="card-game-list">
      <div class="goldTitle">
        <div class="bg" data-lang-key='${dataLangKey}'>${titre}</div>
        <div class="fg" data-lang-key='${dataLangKey}'>${titre}</div>
      </div>
        ${listHTML}
      </div>
  </div>
  `;

  const gameList = document.createElement('div');
  gameList.classList.add('col-12', 'col-md-6');
  gameList.innerHTML = listCardHTML;

  return gameList;
}



export function createToastComponent(className, title, body, autohide = true, delay = 5000) {
    const toastHTML = `
      <div class="toast" role="success" aria-live="assertive" aria-atomic="true" data-autohide="${autohide}" data-delay="${delay}">
        <div class="toast-header">
          <img src="" class="rounded mr-2 h-1 w-1" alt="">
          <strong class="mr-auto">${title}</strong>
          <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="toast-body">
          ${body}
        </div>
      </div>
    `;
  
    const div = document.createElement('div');
    if (className)
      div.className = className;
    else
      div.className = 'd-flex justify-content-center align-items-center';
    div.style.minHeight = '200px';
    div.innerHTML = toastHTML;
  
    const toastElement = div.querySelector('.toast');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
  
    return div;
  }


export function createButtonComponent(text, buttonId, dataLangKey, onClickFunction) {
  const glowingBtnHTML = `
    <button id='${buttonId}' class='glowing-btn h-100'><span class='glowing-txt' data-lang-key='${dataLangKey}'>${text}</span></button>
  `;
  const div = document.createElement('div');
  div.className = 'd-flex justify-content-center align-items-center';
  div.innerHTML = glowingBtnHTML;
  const button = div.querySelector('button');
  button.addEventListener('click', function(event) {
    if (onClickFunction) {
      onClickFunction(event);
    }
  });
  return div;
}

// Fonction pour créer et ajouter un div avec des composants spécifiques à la page
export async function renderDiv(components, className) {
  const existingDiv = document.querySelector(`.${className}`);
  if (existingDiv) {
      // Si le div existe déjà, mettez simplement à jour ses enfants
      existingDiv.innerHTML = '';
      for (let componentPromise of components) {
          const component = await componentPromise;
          if (component instanceof Node) {
              existingDiv.appendChild(component);
          } else {
              console.error('Invalid component:', component);
          }
      }
  } else {
      // Sinon, créez un nouveau div et ajoutez les composants
      const div = document.createElement('div');
      div.className = className;
      for (let componentPromise of components) {
          const component = await componentPromise;
          if (component instanceof Node) {
              div.appendChild(component);
          } else {
              console.error('Invalid component:', component);
          }
      }
      document.body.appendChild(div);
  }
}

export async function createPhotoComponent(userId, points) {
  const photoUrl = await getProfilePicture(userId);
  const profileHeaderHTML = `
  <div class="profile-header-container">   
      <div class="profile-header-img">
          <img class="rounded-circle" src="${photoUrl}" />
          <!-- badge -->
          <div class="rank-label-container">
              <span class="label label-default rank-label">100 pts</span>
          </div>
      </div>
  </div>
  `;
  const photoContainer = document.createElement('div');
  const profileHeader = document.createElement('div');
  profileHeader.innerHTML = profileHeaderHTML;
/*   profileHeader.querySelector('.profile-header-img img').src = imageSrc; */
  profileHeader.querySelector('.rank-label-container .rank-label').textContent = points;
  photoContainer.appendChild(profileHeader);
  return photoContainer;
}