export function renderGame() {
    const gameHTML = `<div class="game mw-50 col-md-6"><img src="Design/pong-video-game.gif" alt=""></div>`;
    //const gameHTML = `<div>Test</div>`;
    const gameElement = document.createElement('div');
    gameElement.insertAdjacentHTML('afterbegin', gameHTML);
    return gameElement;
}