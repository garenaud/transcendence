import { loadTournamentPong } from "./pongComponent.js";
const errorLink = document.getElementById('error');

export function Tournament()
{
	let url = '/api/tournament/create/';
	fetch(url, {
		method: 'GET',
		credentials: 'same-origin'
	})
	.then(response => response.json())
	.then(data => {
		console.log('Success:', data);
		sessionStorage.setItem("tournament_id", data['tournamentid']);
		loadTournamentPong();
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

export function joinTournament(tournamentid) {
	let userid = 667;
	console.log(tournamentid);
	let csrf = getCookie("csrftoken");
	if (!isNaN(tournamentid) && tournamentid > 0 && tournamentid <= 9999)
	{
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
				loadTournamentPong();
			}
			else
			{
				errorLink.textContent = `La partie ${tournamentid} n'existe pas, veuillez reessayer`;
				console.log("l'homme methode post :(");
				setTimeout(function() {
					errorLink.style.display = "none";
				}, 4000);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
		
	}
}

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}