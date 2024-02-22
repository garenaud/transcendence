export function renderGame() {
    const gameHTML = `<div class="game mw-50 col-md-6"><img src="Design/pong-video-game.gif" alt=""></div>`;
    /*const gameElement = document.createElement('div');
    gameElement.innerHTML = gameHtml;

    const navbar = document.querySelector('.navbar');
    const nextSibling = navbar.nextSibling;
    const parent = navbar.parentNode;

    parent.insertBefore(gameElement, nextSibling);*/
    document.body.insertAdjacentHTML('afterbegin', gameHTML);
}