
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
