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

document.getElementById('createBtn').addEventListener('click', function() {
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
		window.location.href = "/pong/pong.html";
	})
	.catch((error) => {
		console.error('Error:', error);
	});
  });

document.getElementById('joinBtn').addEventListener('click', function() {
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
				window.location.href = "/pong/pong.html";
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
	});


document.getElementById('searchBtn').addEventListener('click', function() {
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
			window.location.href = "/pong/pong.html";
		} else if (data['message'] == 'ko'){
			gameid = data['id'];
			privategame = false;
			sessionStorage.setItem("privategame", privategame);
			sessionStorage.setItem("gameid", gameid);
			window.location.href = "/pong/pong.html";
			
			console.log("L'homme methode GET") // IMPORTANT NE PAS ENLEVER!!!
		}
	})
	.catch((error) => {
		console.error('Error:', error);
	});
  });


function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}