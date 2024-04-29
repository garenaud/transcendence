const errorLink = document.getElementById('error');
let gameid;
let privategame = false;

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

export function Multiplayer() {
	let url = '/api/game/create/';
	// console.log(url);
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
		// window.location.href = "/pong/pong.html";
	})
	.catch((error) => {
		console.error('Error:', error);
	});
  }

export function joinGame() {
	errorLink.textContent = "";
	errorLink.style.display = "block";
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
	} else {
		errorLink.textContent = `La partie ${gameid} n'existe pas, veuillez reessayer`;
	}
	setTimeout(function() {
		errorLink.style.display = "none";
	}, 4000);
}

export function onlineMatchmaking() {
// document.getElementById('searchBtn').addEventListener('click', function() {
	let url = '/api/game/search/';
	console.log(url);
	fetch(url, {
		method: 'GET',
		credentials: 'same-origin' 
	})
	.then(response => response.json())
	.then(data => {
		console.log('Success:', data);
		if (data['message'] == "ok") {
			gameid = data['id'];
			privategame = false;
			sessionStorage.setItem("privategame", privategame);
			sessionStorage.setItem("gameid", gameid);
			// window.location.href = "/pong/pong.html";
		} else if (data['message'] == 'ko'){
			gameid = data['id'];
			privategame = false;
			sessionStorage.setItem("privategame", privategame);
			sessionStorage.setItem("gameid", gameid);
			// window.location.href = "/pong/pong.html";
			
			console.log("L'homme methode GET") // IMPORTANT NE PAS ENLEVER!!!
		}
		console.log('id search' + gameid);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
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