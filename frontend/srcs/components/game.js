import { initPong } from "../pong/javascript/pong.js";
export function renderGame() {
    const gameHTML = `
        <div class="card-game-wrapper glowing">
            <div class="card-game-test" style="background-image: url(Design/PongCoverImage.webp);">
                <div class="goldTitle">
                    <div class="bg">Pong</div>
                    <div class="fg">Pong</div>
                </div>
                <button type="button" class="btn btn-primary glowing-btn center mx-auto d-block button" data-toggle="modal" data-target="#pong">
                <span class='glowing-txt'>J<span class='faulty-letter'>O</span>UER</span></button>
            </div>
        </div>

            <!-- Modal -->
        <div class="modal" id="pong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Pong</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                    <div class="card-game-wrapper glowing inside-card-modal">
                    <div class="card-game-inside" style="background-image: url(Design/PongCoverImage.webp);">
                        <div class="goldTitle">
                            <div class="bg">Pong</div>
                            <div class="fg">Pong</div>
                        </div>
                        <div class="pong-glowing-btn">
                            <button id='localPongBtn' class='glowing-btn'><span class='glowing-txt'>L<span class='faulty-letter'>O</span>CAL</span></button>
                            <button id='multiPongBtn' class='glowing-btn'><span class='glowing-txt'>M<span class='faulty-letter'>U</span>LTIPLAYER</span></button>
                            <button id='tourPongBtn' class='glowing-btn'><span class='glowing-txt'>T<span class='faulty-letter'>O</span>URNAMENT</span></button>
                        </div>
                    </div>
                </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    const pongLocal = `
    <canvas id="background"></canvas>
    `;
    const gameElement = document.createElement('div');
    gameElement.classList.add('col-12', 'col-md-6');
    gameElement.innerHTML = gameHTML;
    gameElement.querySelector('#localPongBtn').addEventListener('click', function() {
        changeDivContent(pongLocal);
        initPong();
    });

    gameElement.querySelector('#multiPongBtn').addEventListener('click', function() {
        changeDivContent('Contenu pour le mode tournoi');
    });

    gameElement.querySelector('#tourPongBtn').addEventListener('click', function() {
        changeDivContent('Contenu pour le mode tournoi');
    });
    return gameElement;
}

function changeDivContent(newContent) {
    const div = document.querySelector('.card-game-inside');
    div.innerHTML = newContent;
}