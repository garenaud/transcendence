export function renderGame() {
    const gameHTML = `
        <div class="card-game-wrapper glowing">
            <div class="card-game-test" style="background-image: url(Design/PongCoverImage.webp);">
                <div class="goldTitle">
                    <div class="bg">Pong</div>
                    <div class="fg">Pong</div>
                </div>
                <button type="button" class="btn btn-primary glowing-btn center mx-auto d-block button" data-toggle="modal" data-target="#roulette">
                <span class='glowing-txt'>J<span class='faulty-letter'>O</span>UER</span></button>
            </div>
    `;
    //const gameHTML = `<div>Test</div>`;
    const gameElement = document.createElement('div');
    gameElement.classList.add('col-12', 'col-md-6');
    gameElement.innerHTML = gameHTML;
    return gameElement;
}