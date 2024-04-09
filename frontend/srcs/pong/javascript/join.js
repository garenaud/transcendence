let gameid;

document.getElementById("chat-message-submit").onclick = function(e){
	gameid = document.getElementById("chat-message-input").value;
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
			console.log("ratio");
		} else{
			sessionStorage.setItem("gameid", gameid);
			window.location.href = "/pong/pong.html";
		}
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