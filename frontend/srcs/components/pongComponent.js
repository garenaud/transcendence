//import { initPong } from "../pong/javascript/pong.js";

export function renderPong() {
    const pongHTML = `
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
    const originalModalContent = `
        <div class="goldTitle">
            <div class="bg">Pong</div>
            <div class="fg">Pong</div>
        </div>
        <div class="pong-glowing-btn">
            <button id='localPongBtn' class='glowing-btn'><span class='glowing-txt'>L<span class='faulty-letter'>O</span>CAL</span></button>
            <button id='multiPongBtn' class='glowing-btn'><span class='glowing-txt'>M<span class='faulty-letter'>U</span>LTIPLAYER</span></button>
            <button id='tourPongBtn' class='glowing-btn'><span class='glowing-txt'>T<span class='faulty-letter'>O</span>URNAMENT</span></button>
        </div>
    `;
    const pongElement = document.createElement('div');
    pongElement.classList.add('col-12', 'col-md-6');
    pongElement.innerHTML = pongHTML;
/*     const originalModalContent = pongElement.querySelector('.card-game-inside').innerHTML;
 */
    /**
     * Ajoute des gestionnaires d'événements aux boutons dans la modale.
     * - Le bouton 'localPongBtn' déclenche le jeu Pong en mode local.
     * - Le bouton 'multiPongBtn' change le contenu de la modale pour le mode multijoueur -> a faire.
     * - Le bouton 'tourPongBtn' change le contenu de la modale pour le mode tournoi -> a faire.
     */
    function addEventListeners() {
        pongElement.querySelector('#localPongBtn').addEventListener('click', function() {
            changeDivContent(pongLocal);
            initPong();
        });

        pongElement.querySelector('#multiPongBtn').addEventListener('click', function() {
            changeDivContent('Contenu pour le mode tournoi');
        });

        pongElement.querySelector('#tourPongBtn').addEventListener('click', function() {
            changeDivContent('Contenu pour le mode tournoi');
        });
    }

    addEventListeners();

    // Réinitialise le contenu de la modale lorsque celle-ci est fermée.
    pongElement.querySelector('#pong').addEventListener('hidden.bs.modal', function () {
        pongElement.querySelector('.card-game-inside').innerHTML = originalModalContent;
        addEventListeners();
    });

    return pongElement;
}

// Change le contenu de la modale.
function changeDivContent(newContent) {
    const div = document.querySelector('.card-game-inside');
    div.innerHTML = newContent;
}