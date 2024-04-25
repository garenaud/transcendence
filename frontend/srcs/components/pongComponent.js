// import { init } from "../localpong/localpong.js";
// import { makeid } from "../pong/javascript/pong.js"
//import * as PongMenu from "./pong_menu.js";

const errorLink = document.getElementById('error');
let gameid;
let privategame = false;


export let scriptStarted;

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
                <button type="button" class="btn btn-primary glowing-btn center mx-auto d-block button" data-bs-toggle="modal" data-bs-target="#pong">
                <span id="playBtnPong" class='glowing-txt' data-lang-key='playBtn'>JOUER</span></button>
            </div>
        </div>

            <!-- Modal -->
        <div class="modal" id="pong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Pong</h5>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="card-game-wrapper glowing inside-card-modal">

                        <!-- origPongContent -->
                        <div id="origPong" class="card-game-inside">
                            <div class="d-flex flex-row justify-content-between pong-glowing-btn">
							<link rel="stylesheet" type="text/css" href="../pong/css/pong_menu.css">
								<div class="menugrid">
									<nav class="nav">
								  		<a id="localPongBtn" class="nav-link">Local</a>
								  		<a id="multiPongBtn" class="nav-link">Create Private</a>
										  <div class="nav-link">
										  	<a  id="joinPongBtn">Join Private</a>
											<input type="text" id="gameCodeInput" class="inputGame" placeholder="Game ID">
								  			</div>
								  		<a id="searchBtn" class="nav-link">Online Matchmaking</a>
								  		<a href="https://www.exit.ch/en/" target="_blank" class="nav-link">Exit</a>
									</nav>
								</div>
                            </div>
						</div>
						
                        <!-- multiplayerModalContent -->
                        <div id="pongMulti" class="h-100 align-items-center d-none">
						<canvas id="background" class="h-100 w-100"></canvas>
							<div id="countdown"></div>
							<div class="container3">
								<div class="row">
									<div class="col col-display" id="scoreHome">0</div>
								</div>
								<div class="row">
									<div class="col col-display" id="scoreGuest">0</div>
								</div>
							</div>
								<div class="container2">
									<div class="load-3">
										<p id="loading">[WAITING FOR OPPONENT]</p>
									<div class="line"></div>
									<div class="line"></div>
									<div class="line"></div>
								</div>
							</div>
						</div>
							
							<!-- pongLocalContent -->
							<div id="pongLocal" class="h-100 align-items-center d-none">
							<canvas id="background" class="h-100 w-100"></canvas>
								<div id="countdownPong"></div>
								<div id="displayscore"></div>
								<div id ="displayvictory"></div>
							</div>
							
							
							<!-- joinPongContent -->
							<div id="joinPong" class="h-100 align-items-center d-none">
							<a id="error"></a>
							<input id="chat-message-input" type="text" size="20"><br>
							<input id="chat-message-submit" type="button" value="Send">
							</div>
							
							
							</div>
							<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<button type="button" class="btn btn-primary">Save changes</button>
							</div>
							</div>
							</div>
							</div>
							</div>
							`;
							const pongElement = document.createElement('div');
							pongElement.classList.add('col-12', 'col-md-6');
							pongElement.innerHTML = pongHTML;
							
							addEventListeners(pongElement);
							
							function addEventListeners(element) {
        const origPong = element.querySelector('#origPong');
        const multiPongBtn = element.querySelector('#multiPongBtn');
        const joinPongBtn = element.querySelector('#joinPongBtn');
        const pongMulti = element.querySelector('#pongMulti');
        const joinPong = element.querySelector('#joinPong');
        const pongLocal = element.querySelector('#pongLocal');
        const localPongBtn = element.querySelector('#localPongBtn');
        const previousDiv = origPong ? pongMulti.previousElementSibling : null;
        const pongModal = element.querySelector('#pong');

		// * JoinBtn 
		joinPongBtn.addEventListener('click', function() {
			const gameIdInput = document.getElementById('gameCodeInput');
			gameid = gameIdInput.value.trim();
			let url = '/api/game/' + gameid;
			if (!isNaN(gameid) && gameid > 0 && gameid <= 9999) {	
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
						privategame = true;
						sessionStorage.setItem("privategame", privategame);
						sessionStorage.setItem("gameid", gameid);
					}
				})
				.catch((error) => {
					console.error('Error:', error);
				});
			}
			pongLocal.classList.add('d-none');
			origPong.classList.add('d-none');
			document.querySelectorAll('.card-game-inside > div').forEach(div => {
				div.classList.add('d-none');
			});
			pongMulti.classList.remove('d-none');
			var data = document.querySelector('#pongMulti').innerHTML;
			document.querySelector('#pongMulti').innerHTML = data;
			loadMultiPong();		
		});
			
		localPongBtn.addEventListener('click', toggleVisibility);
		//* LOCALPONG
        localPongBtn.addEventListener('click', function() {
			console.log(pongLocal);
			origPong.classList.add('d-none');
            pongMulti.classList.add('d-none');
            document.querySelectorAll('.card-game-inside > div').forEach(div => {
                div.classList.add('d-none');
            });
            pongLocal.classList.remove('d-none');
			var data = document.querySelector('#pongLocal').innerHTML;
			document.querySelector('#pongLocal').innerHTML = data;
            loadLocalPong();
        });

		//* MULTIPONG
		multiPongBtn.addEventListener('click', toggleVisibility);		
		multiPongBtn.addEventListener('click', function() {
			console.log('ici');
			let url = '/api/game/create/';
			console.log(url);
			fetch(url, {
				method: 'GET',
				credentials: 'same-origin' 
			})
			.then(response => response.json())
			.then(data => {
				console.log('Success:', data);
				privategame = true;
				sessionStorage.setItem("privategame", privategame);
				sessionStorage.setItem("gameid", data['id']);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
			pongLocal.classList.add('d-none');
			origPong.classList.add('d-none');
			document.querySelectorAll('.card-game-inside > div').forEach(div => {
				div.classList.add('d-none');
			});
			pongMulti.classList.remove('d-none');
			var data = document.querySelector('#pongMulti').innerHTML;
			document.querySelector('#pongMulti').innerHTML = data;
			loadMultiPong();
		});

		
		
		
        pongModal.addEventListener('show.bs.modal', function () {
			console.log('modal');
			scriptStarted = true;
			document.querySelectorAll('.card-game-inside > div').forEach(div => {
				div.classList.remove('d-none');
			});
			origPong.classList.remove('d-none');
        });
        pongModal.addEventListener('hidden.bs.modal', function () {
			scriptStarted = false;
			unloadScript();
			const pongLocal = element.querySelector('#pongLocal');
			const pongMulti = element.querySelector('#pongMulti');
    		pongLocal.classList.add('d-none');
			pongMulti.classList.add('d-none');
            origPong.classList.remove('d-none');
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

function unloadScript() {
    // Désactiver les scripts chargés dynamiquement
    document.querySelectorAll('script[type="module"][data-pong="dynamic"]').forEach(script => {
		console.log(script);
		script.setAttribute('data-disabled', 'true');
        script.removeAttribute('type');
        script.remove(); // Supprimer le script du DOM
		console.log(script + 'end');
    });
}


function loadLocalPong() {
    // Créer et ajouter le script localpong.js
    document.querySelectorAll('script[data-disabled="true"]').forEach(script => {
        script.setAttribute('type', 'module');
        script.removeAttribute('data-disabled');
    });
    const scriptLocalPong = document.createElement('script');
    scriptLocalPong.type = 'module';
    scriptLocalPong.src = '../localpong/localpong.js?' + new Date().getTime(); // Ajoute un horodatage à l'URL
    console.log('loading');
    scriptLocalPong.setAttribute('data-pong', 'dynamic');  // Marqueur pour identifier les scripts chargés dynamiquement
    document.body.appendChild(scriptLocalPong);
}

function loadMultiPong() {
	document.querySelectorAll('script[data-disabled="true"]').forEach(script => {
        script.setAttribute('type', 'module');
        script.removeAttribute('data-disabled');
    });
    const scriptMultiPong = document.createElement('script');
    scriptMultiPong.type = 'module';
    scriptMultiPong.src = '../pong/javascript/pong.js?' + new Date().getTime(); // Ajoute un horodatage à l'URL
    console.log('loadingMulti');
    scriptMultiPong.setAttribute('data-pong', 'dynamic');  // Marqueur pour identifier les scripts chargés dynamiquement
    document.body.appendChild(scriptMultiPong);
}
