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

document.getElementById('createBtn').addEventListener('click', function() {
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
			  window.location.href = "/pong/pong.html";
		  } else if (data['message'] == 'ok'){
			  sessionStorage.setItem("gameid", gameid);
			  window.location.href = "/pong/pong.html";
		  }
	  })
	  .catch((error) => {
		  console.error('Error:', error);
	  });
  });

document.getElementById('joinBtn').addEventListener('click', function() {
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


document.getElementById('searchBtn').addEventListener('click', function() {
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


function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}