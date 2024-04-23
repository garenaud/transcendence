export function createListCardComponent(listItems) {
    const listCardHTML = `
    <div class="card-game-wrapper glowing">
        <div class="card-game-test">
          ${listItems}
        </div>
    </div>
    `;

    return listCardHTML;
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
export function renderDiv(components, className) {
    const div = document.createElement('div');
    div.classList.add(className);
    div.innerHTML = '';
    for (const component of components) {
        div.appendChild(component);
    }
    document.body.appendChild(div);
}

export function createPhotoComponent(imageSrc, points) {
  const photoContainer = document.createElement('div');
  const profileHeader = document.createElement('div');
  profileHeader.innerHTML = profileHeaderHTML;
  profileHeader.querySelector('.profile-header-img img').src = imageSrc;
  profileHeader.querySelector('.rank-label-container .rank-label').textContent = points + ' pts';
  photoContainer.appendChild(profileHeader);
  return photoContainer;
}