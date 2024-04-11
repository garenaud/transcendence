//import { initPong } from "../pong/javascript/pong.js";
//import * as PongMenu from "./pong_menu.js";

const errorLink = document.getElementById('error');
let gameid;

function makeid(length) {
	let result = '';
	const characters = '0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
	  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	  counter += 1;
	}
	return result;
  }
  function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
  }

export function renderPong() {
    const pongHTML = `
        <div class="card-game-wrapper glowing">
            <div class="card-game-test" style="background-image: url(Design/PongCoverImage.webp);">
                <div class="goldTitle">
                    <div class="bg">Pong</div>
                    <div class="fg">Pong</div>
                </div>
                <button type="button" class="btn btn-primary glowing-btn center mx-auto d-block button" data-toggle="modal" data-target="#pong">
                <span id="playBtnPong" class='glowing-txt' data-lang-key='playBtn'>JOUER</span></button>
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

                        <!-- origPongContent -->
                        <div id="origPong" class="card-game-inside" style="background-image: url(Design/PongCoverImage.webp);">
                            <div class="goldTitle">
                                <div class="bg">Pong</div>
                                <div class="fg">Pong</div>
                            </div>
                            <div class="d-flex flex-row justify-content-between pong-glowing-btn">
                                <button id='localPongBtn' class='glowing-btn'><span class='glowing-txt'>L<span class='faulty-letter'>O</span>CAL</span></button>
                                <button id='multiPongBtn' class='glowing-btn'><span class='glowing-txt'>M<span class='faulty-letter'>U</span>LTIPLAYER</span></button>
                                <button id='tourPongBtn' class='glowing-btn'><span class='glowing-txt'>T<span class='faulty-letter'>O</span>URNAMENT</span></button>
                            </div>
                        </div>

                    <!-- multiplayerModalContent -->
                    <div id="pongMulti" class="h-100 align-items-center d-none">
                        <button id="createBtn">Create Game</button>
                        <button id="joinBtn">Join Game</button>
                        <button id="searchBtn">List Game</button>
                        <input type="text" id="gameCodeInput" placeholder="Enter Game Code"><br>
                        <p>
                        <a id="error"></a>
                        </p>
                    </div>
                    <div class="collapse w-100" id="createRoomPong">
                        <div class="card  w-100">
                            <form>
                                <div class="form-group row">
                                    <label for="inputEmail3" class="col-sm-2 col-form-label">Email</label>
                                    <div class="col-sm-10">
                                        <input type="email" class="form-control" id="inputEmail3" placeholder="Email">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col-sm-10 offset-sm-2">
                                        <button type="submit" class="btn btn-primary">Sign in</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="collapse w-100" id="joinRoomPong">
                        <div class="card  w-100">
                            <input id="chat-message-input" type="text" size="20"><br>
                            <input id="chat-message-submit" type="button" value="Send">
                        </div>
                    </div>
                    <div class="collapse w-100" id="joinRandomRoomPong">
                        <div class="card  w-100">
                        <form>
                            <div class="form-group row">
                            <label for="inputEmail3" class="col-sm-2 col-form-label">Email</label>
                            <div class="col-sm-10">
                                <input type="email" class="form-control" id="inputEmail3" placeholder="Email">
                            </div>
                            </div>
                            <div class="form-group row">
                            <div class="col-sm-10 offset-sm-2">
                                <button type="submit" class="btn btn-primary">Sign in</button>
                            </div>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>

                    <!-- multiplayerModalContent -->
                <div id="pongLocal" class="h-100 align-items-center d-none">
                    <canvas id="background"></canvas>
                    <h1>coooool</h1>
                </div>

                    <!-- joinPongContent -->
                <div id="joinPong" class="h-100 align-items-center d-none">
                    <input id="chat-message-input" type="text" size="20"><br>
                    <input id="chat-message-submit" type="button" value="Send">
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
        <script type="module" src="pong/javascript/pong.js"></script>
        <script type="module" src="pong/javascript/pong_menu.js"></script>
    `;
    const pongElement = document.createElement('div');
    pongElement.classList.add('col-12', 'col-md-6');
    pongElement.innerHTML = pongHTML;

    addEventListeners(pongElement);

    function addEventListeners(element) {
        const origPong = element.querySelector('#origPong');
        const multiPongBtn = element.querySelector('#multiPongBtn');
        const pongMulti = element.querySelector('#pongMulti');
        const joinPong = element.querySelector('#joinPong');
        const pongLocal = element.querySelector('#pongLocal');
        const localPongBtn = element.querySelector('#localPongBtn');
        const previousDiv = origPong ? pongMulti.previousElementSibling : null;
    
        // Add event listener to the button
        multiPongBtn.addEventListener('click', toggleVisibility);
        localPongBtn.addEventListener('click', toggleVisibility);
        pongElement.querySelector('#createBtn').addEventListener('click', function() {
            gameid = makeid(3);
            let url = '/api/game/create/' + gameid;
              console.log(url);
              fetch(url, {
                  method: 'GET',
                  credentials: 'same-origin' 
              })
              .then(response => response.json())
              .then(data => {
                  console.log('Success:', data);
                  if (data['message'] == "ko") {
                gameid = data['id'];
                sessionStorage.setItem("gameid", gameid);
                //loadModalContent("/pong/pong.html");
                  } else if (data['message'] == 'ok'){
                      sessionStorage.setItem("gameid", gameid);
                      document.querySelectorAll('.card-game-inside > div').forEach(div => {
                        div.classList.add('d-none');
                      });
                      //const pongLocal = document.querySelector('#pongLocal');
                      pongLocal.classList.remove('d-none');
                  }
              })
              .catch((error) => {
                  console.error('Error:', error);
              });
          });
        
        pongElement.querySelector('#joinBtn').addEventListener('click', function() {
            errorLink.textContent = "";
            const gameIdInput = document.getElementById('gameCodeInput');
            gameid = gameIdInput.value.trim();
            let url = '/api/game/' + gameid;
              console.log(url);
              fetch(url, {
                  method: 'GET',
                  credentials: 'same-origin' 
              })
              .then(response => response.json())
              .then(data => {
                  console.log('Success:', data);
                  if (data['message'] == "Not found") {
                    errorLink.textContent = `La partie ${gameid} n'existe pas, veuillez reessayer`;
                  } else{
                      sessionStorage.setItem("gameid", gameid);
                      window.location.href = "/pong/pong.html";
                  }
              })
              .catch((error) => {
                  console.error('Error:', error);
              });
          });
        
        
        pongElement.querySelector('#searchBtn').addEventListener('click', function() {
            let url = '/api/game/search/';
            console.log(url);
            document.getElementsByTagName('body')[0].innerHTML = `
            <div class="container">
              <div class="load-3">
                  <p id="loading">[SEARCHING FOR OPPONENT]</p>
                  <div class="line"></div>
                  <div class="line"></div>
                  <div class="line"></div>
              </div>
            </div>
          `;
        
              fetch(url, {
                  method: 'GET',
                  credentials: 'same-origin' 
              })
              .then(response => response.json())
              .then(data => {
                  console.log('Success:', data);
                  if (data['message'] == "ok") {
                    gameid = data['id'];
                    sessionStorage.setItem("gameid", gameid);
                    window.location.href = "/pong/pong.html";
                  } else if (data['message'] == 'ko'){
                    console.log("L'homme methode GET")
                  }
              })
              .catch((error) => {
                  console.error('Error:', error);
              });
          });
    
        // Define the event handler
        function toggleVisibility() {
            pongMulti.classList.toggle('d-none');
            if (previousDiv) {
                previousDiv.classList.toggle('d-none');
            }
        }
    }


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

        // pongElement.querySelector('#localPongBtn').addEventListener('click', function() {
        //     changeDivContent(pongLocal);
        //     initPong();
        // });

        // pongElement.querySelector('#multiPongBtn').addEventListener('click', function() {
        //     changeDivContent(pongMulti);
        // });

        // pongElement.querySelector('#tourPongBtn').addEventListener('click', function() {
        //     changeDivContent('Contenu pour le mode tournoi');
        // });
        
        