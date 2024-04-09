import { changeView } from './stateManager.js';

export function renderHero() {
    const heroHTML = `
    <div class="container cont-hero">
		<div class="row">
			<div class="col-hero">
				<div class="hero col-md-6">
					<h1 data-lang-key='heroTxt'>Transcendez le jeu, devenez légende!</h1>
					<button id='heroGameBtn' class='glowing-btn'><span data-lang-key='playBtn' class='glowing-txt'>JOUER</span></button>
				</div>
				<div class="lg-img col-md-4"><img src="Design/cyberUnicorn2.webp" alt=""></div>
			</div>
		</div>
	</div>
    `;

    document.body.insertAdjacentHTML('afterbegin', heroHTML);
    setupButtonListener();

	// je sais plus pourquoi j'ai mis ça là, mais sait-on jamais ca me reviendra peut-être ;-)
/* 	fetch('/auth/session_user/', {
		method: 'GET'
	})
	.then(response => response.json())
	.then(data => {
		console.log('genial:', data);
	})
	.catch((error) => {
		console.error('Error:', error);
	}); */
}

function    setupButtonListener() {
    document.getElementById('heroGameBtn').addEventListener('click', function() {
        changeView('game');
    });
}