
document.getElementById('createBtn').addEventListener('click', function (){
	let url = '/api/tournament/create/';
	fetch(url, {
		method: 'GET',
		credentials: 'same-origin'
	})
	.then(response => response.json())
	.then(data => {
		console.log('Success:', data);
		sessionStorage.setItem("tournament_id", data['tournamentid']);
		window.location.href = "/pong/pong_tournament.html";
	})
	.catch((error) => {
		console.error('Error:', error);
	});
});

document.getElementById('joinBtn').addEventListener('click', function() {
	const tournamentid = document.getElementById('gameCodeInput').value;
	let userid = 667;
	let csrf = getCookie("csrftoken");
	fetch(`/api/tournament/join/${tournamentid}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrf,
		},
		body: JSON.stringify({ tournamentid, userid }),
		credentials: 'same-origin' 
	})
	.then(response => response.json())
	.then(data => {
		if(data['message'] == 'ok')
		{
			sessionStorage.setItem("tournament_id", tournamentid);
			window.location.href = "/pong/pong_tournament.html";
		}
		else
		{
			console.log("l'homme methode post :(");
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