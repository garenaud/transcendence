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
                            <p><a id="error"></a></p>
                        </div>

                        <!-- pongLocalContent -->

                    	<div id="pongLocal" class="h-100 align-items-center d-none">
						<canvas id="background" class="h-100 w-100"></canvas>
						<div id="countdown"></div>
						<div id="displayscore"></div>
						<div id ="displayvictory"></div>
						</div>
						
                        <!-- joinPongContent -->
						<div id="joinPong" class="h-100 align-items-center d-none">
                        <input id="chat-message-input" type="text" size="20"><br>
                        <input id="chat-message-submit" type="button" value="Send">
						</div>
						
						
                        </div>
                        <div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
						<button type="button" class="btn btn-primary">Save changes</button>
                        </div>
						</div>
						</div>
						</div>
						</div>
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
        const pongModal = element.querySelector('#pong');
    
        // Add event listener to the button
        multiPongBtn.addEventListener('click', toggleVisibility);
        localPongBtn.addEventListener('click', toggleVisibility);

        localPongBtn.addEventListener('click', function() {
            pongMulti.classList.add('d-none');
            document.querySelectorAll('.card-game-inside > div').forEach(div => {
                div.classList.add('d-none');
            });

            pongLocal.classList.remove('d-none');
			var data = document.querySelector('#pongLocal').innerHTML;
			document.querySelector('#pongLocal').innerHTML = data;
            loadScripts();
        });
        pongElement.querySelector('#createBtn').addEventListener('click', function() {
            pongMulti.classList.add('d-none');
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
                    document.querySelectorAll('.card-game-inside > div').forEach(div => {
                    div.classList.add('d-none');
                    });
                    pongLocal.classList.remove('d-none');
                    }
              })
              .catch((error) => {
                  console.error('Error:', error);
              });
          });
        
          pongModal.addEventListener('show.bs.modal', function () {
            console.log('Modal is about to be shown');
        });
        
        pongModal.addEventListener('hidden.bs.modal', function () {
            console.log('Modal is hidden or closed');
            document.querySelectorAll('.card-game-inside > div').forEach(div => {
                div.classList.add('d-none');
            });
            origPong.classList.remove('d-none');
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

    return pongElement;
}



// Change le contenu de la modale.
function changeDivContent(newContent) {
    const div = document.querySelector('.card-game-inside');
    div.innerHTML = newContent;
}

// Pour load les scripts lorsque l'on presse le bouton

function loadScripts() {
    // Supprime les anciens scripts si nécessaire
    document.querySelectorAll('script[type="module"][data-pong="dynamic"]').forEach(script => script.remove());

    // Créer et ajouter le script localpong.js
    const scriptLocalPong = document.createElement('script');
    scriptLocalPong.type = 'module';
    scriptLocalPong.src = '../localpong/localpong.js';
    scriptLocalPong.setAttribute('data-pong', 'dynamic');  // Marqueur pour identifier les scripts chargés dynamiquement
    document.body.appendChild(scriptLocalPong);

    // Créer et ajouter le script ModelHelper.js
    const scriptModelHelper = document.createElement('script');
    scriptModelHelper.type = 'module';
    scriptModelHelper.src = '../localpong/ModelHelper.js';
    scriptModelHelper.setAttribute('data-pong', 'dynamic');
    document.body.appendChild(scriptModelHelper);
}