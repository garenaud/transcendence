import * as THREE from 'three';
import { LoadGLTFByPath } from './ModelHelper.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { appState } from '../../components/stateManager.js';
import { unloadScript } from '../../components/pongComponent.js';
import { getUser } from '../../components/userManager.js';

const PaddleRightName = 'RightPaddle';
const PaddleLeftName = 'LeftPaddle';
const BallName = 'Ball';
let finalid = -1;
let tournament_data;
let active = false;
let userid = sessionStorage.getItem('userId');
let tournament_id = sessionStorage.getItem('tournament_id');
sessionStorage.setItem("tournament_id", null);
let gameid;
let game_data;
let renderer;
let scene;
let camera;
let controls;
let cameraList = [];
let composer;
let scoreText1, scoreText2;
let player1Score = 0;
let player2Score = 0;
const initialAngle = 0;
const speed = 0.25;
const mooveSpeed = 0.1;
const wallLimit = 6.5;
const ballLimit = 8.5;
const maxAngleAdjustment = 0.5;
const deltaTime = 30;
let scoreLeft;
let scoreRight;
let ballVelocity;
let gameSocket;
let tournamentSocket;
let currentNum = 7;
let connected = 0;
let playernb = sessionStorage.getItem('playernb');
let playernumber = 0;

const startBtn = document.getElementById('startGameBtn');
const nextBtn = document.getElementById('nextGameBtn');
const myModal2 = document.getElementById('myModal2');
const myModal3 = document.getElementById('myModal3');


// rajouter condition pour faire apparaitre le bon bouton, 
// si on a gagner le match, le bouton pour acceder a la finale apparait
// , sinon, retour au menu apparait
function nextBtnFunction(){
	gameSocket = new WebSocket(
		'wss://'
		+ window.location.host
		+ '/ws/'
		+ 'game'
		+ '/'
		+ finalid
		+ '/'
	);
	gameSocket.onmessage = function(event) {
		onMessageHandler(event);
	};
	myModal3.style.display = 'none';
	const scoreL = document.getElementById("scoreHome");
	scoreL.textContent = 0;
	const scoreR = document.getElementById("scoreGuest");
	scoreR.textContent = 0;
}

function startBtnFunction(){
	
}

nextBtn.addEventListener('click', nextBtnFunction);

tournamentSocket = new WebSocket(
	'wss://'
	+ window.location.host
	+ '/ws/'
	+ 'tournament'
	+ '/'
	+ tournament_id
	+ '/'
);

tournamentSocket.onerror = function(e) {
	window.location.href = "https://localhost/pong/tournament_menu.html";
}


const KeyState = {
	KeyW: false,
	KeyS: false,
	ArrowUp: false,
	ArrowDown: false,
	Escape: false,
};

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

const loadingElement = document.getElementById('loading_txt');
loadingElement.innerHTML = "[WAITING FOR OPPONENT]<br>Tournament ID : " + tournament_id + '<br>' + 'Currently connected : ' + connected + '/4';

//console.log(privategame);
//console.log(`ID IS ${tournament_id}`);

function addClassDelayed(element, className, delay) {
    setTimeout(function() {
        element.classList.add(className);
    }, delay);
}

function scaleCam() {
	return (50 - (window.innerWidth - 300) / 240);
}

function displayRotateMessage() {
    var diplayRotate = document.createElement('div');
    diplayRotate.innerHTML = "Veuillez tourner votre téléphone en mode paysage pour une meilleure expérience.";
	diplayRotate.id = "rotate-message";
    diplayRotate.style.position = 'absolute';
    diplayRotate.style.top = '50%';
    diplayRotate.style.left = '50%';
    diplayRotate.style.transform = 'translate(-50%, -50%)';
    diplayRotate.style.fontSize = '18px';
    diplayRotate.style.color = '#ffffff';
    diplayRotate.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    diplayRotate.style.padding = '20px';
    diplayRotate.style.borderRadius = '5px';
    diplayRotate.style.zIndex = '9999';
    document.body.appendChild(diplayRotate);
}

function hideRotateMessage() {
    var diplayRotate = document.getElementById('rotate-message');
    if (diplayRotate) {
        diplayRotate.remove();
    }
}

function checkPortraitMode() {
	if (window.innerHeight > window.innerWidth) {
		displayRotateMessage();
	} else {
		hideRotateMessage();
	}
}

function init() {
	// Renderer
	renderer = new THREE.WebGLRenderer({
		canvas: document.querySelector('#backgroundTournament'),
		antialias: true,
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;

	// Scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color('purple');

	// Camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
	camera.position.set(0, scaleCam(), scaleCam());
	// Controls
	controls = initControls();

	// Postprocessing
	composer = initPostprocessing();

	// Load the GLTF model and handle the PaddleRight
	LoadGLTFByPath(scene)
		.then(() => {
			const div_loading = document.querySelector('.loading');
			if (div_loading) {
				div_loading.style.display = 'none';
			}
			handleBackground();
			handleGround();
			handleLight();
			handleText();
			gameSocket.send(JSON.stringify({
				'message' : 'load'
			}));
			const div_scoreboard = document.querySelector('.scoreboard');
			if (div_scoreboard) {
				div_scoreboard.style.display = 'flex';
			}
			// checkPortraitMode();
			// createScoreTexts();
		})
		.catch((error) => {
			console.error('Error loading JSON scene:', error);
		});
		scene.castShadow = true;
		scene.receiveShadow = true;
		// Animation loop
		console.log('help');
		animate();
}


function handleText() {
	scoreLeft = scene.getObjectByName('Text');
	scene.add(scoreLeft);
	scene.remove(scoreLeft);
	scoreRight = scene.getObjectByName('Text001');
	scene.add(scoreRight);
	scene.remove(scoreRight);
}

function handleBall() {
	const ballName = 'Ball';
	ball = scene.getObjectByName(ballName);
	if (ball) {
		ball.castShadow = true;
		// ball.receiveShadow = true;
		ball.position.set(0, 0, 0);
		ballVelocity = new THREE.Vector3(Math.cos(initialAngle) * speed, 0, Math.sin(initialAngle) * speed);
	} else {
		console.error('Ball not found');
	}
	
}

function handleLight() {
	const light = new THREE.AmbientLight( 0xFFFFFFF , 0.4 ); // soft white light
	const dLight = new THREE.DirectionalLight( 0xFFFFFFF, 1.1 );
	dLight.castShadow = true;
	dLight.shadow.mapSize.width = 4096;
	dLight.shadow.mapSize.height = 4096;
	const d = 35;
	dLight.shadow.camera.left = - d;
	dLight.shadow.camera.right = d;
	dLight.shadow.camera.top = d;
	dLight.shadow.camera.bottom = - d;
	scene.add( light );
	scene.add( dLight );
	const width = 35;
	const height = 5;
	const intensity = 1.9;
	const rectLightDown = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
	const rectLightUp = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
	rectLightDown.position.set( 0, 0, 8.7 );
	rectLightUp.position.set( 0, 0, -8.7 );
	rectLightDown.lookAt( 0, 0, 0 );
	rectLightUp.lookAt( 0, 0, 0 );
	scene.add( rectLightDown );
	scene.add( rectLightUp );
}

function onWindowResize() {
	// checkPortraitMode();
	camera.position.set(0, scaleCam(), scaleCam());
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function initControls() {
	const newControls = new OrbitControls(camera, renderer.domElement);
	newControls.maxPolarAngle = Math.PI * 0.5;
	newControls.minDistance = 25;
	newControls.maxDistance = 45;
	return newControls;
}

function initPostprocessing() {
	const renderScene = new RenderPass(scene, camera);
	const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.1, 1, 0.60);
	const newComposer = new EffectComposer(renderer);
	newComposer.castShadow = true;
	newComposer.addPass(renderScene);
	newComposer.addPass(bloomPass);
	
	return newComposer;
}

function handleGround() {
	const groundName = 'Ground';
	const Ground = scene.getObjectByName(groundName);
	Ground.position.y = -0.5;
	// Ground.roughness = 1.8;
	Ground.receiveShadow = true;
}

// Fonction pour gérer l'appui sur une touche
function handleKeyDown(event) {
	if (currentNum < 0) {
		if (event.code == 'ArrowUp')
		{
			gameSocket.send(JSON.stringify({
			'message' : 'Up'
			}));
		}
		else if (event.code == 'ArrowDown')
		{
			gameSocket.send(JSON.stringify({
			'message' : 'Down'
			}));
		}
		else if (event.code == 'KeyW')
		{
			gameSocket.send(JSON.stringify({
				'message' : 'W'
			}));
		}
		else if (event.code == 'KeyS')
		{
			gameSocket.send(JSON.stringify({
				'message' : 'S'
			}));
		}
		else if (event.code == 'Enter')
		{
			gameSocket.send(JSON.stringify({
				'message' : 'Start'
			}));
		}
		else if (event.code == 'Escape')
		{
			gameSocket.send(JSON.stringify({
			'message' : 'Stop'
			}));
		}
	}
}

// Fonction pour gérer le relâchement d'une touche
function handleKeyUp(event) {
	if (KeyState.hasOwnProperty(event.code)) {
		KeyState[event.code] = false;
	}
}
	
	// Fonction pour gérer le mouvement du paddle de l'IA
function handleAIPaddle() {
		
		// Déclaration des variables locales
		const PaddleLeftName = 'LeftPaddle';
		const PaddleLeft = scene.getObjectByName(PaddleLeftName);
		const direction = new THREE.Vector3(0, 0, 0);
		
		// Calcul de la direction une seule fois par frame
		if (PaddleLeft) {
			direction.subVectors(ball.position, PaddleLeft.position).normalize();
		}
		direction.x = 0;
		// Mouvement fluide du paddle
		if (PaddleLeft) {
			const newPosition = PaddleLeft.position.clone().addScaledVector(direction, mooveSpeed * deltaTime);
			PaddleLeft.position.lerp(newPosition, 0.1);
		}
		
		// Limiter la position du paddle
		if (PaddleLeft) {
			const paddleLimit = wallLimit - 1;
			PaddleLeft.position.z += direction.z * mooveSpeed * deltaTime;
		}
}
	
function handleAIPaddleRight() {
		
		// Déclaration des variables locales
		// const PaddleLeftName = 'LeftPaddle';
		// const PaddleLeft = scene.getObjectByName(PaddleLeftName);
		const direction = new THREE.Vector3(0, 0, 0);

    // Calcul de la direction une seule fois par frame
    if (PaddleRight) {
        direction.subVectors(ball.position, PaddleRight.position).normalize();
    }
	direction.x = 0;
    // Mouvement fluide du paddle
    if (PaddleRight) {
        const newPosition = PaddleRight.position.clone().addScaledVector(direction, mooveSpeed * deltaTime);
        PaddleRight.position.lerp(newPosition, 0.1);
    }

    // Limiter la position du paddle
    if (PaddleRight) {
        const paddleLimit = wallLimit - 1;
        PaddleRight.position.z += direction.z * mooveSpeed * deltaTime;
    }
}

function handleBackground() {
	// scene.background += new THREE.Color(Math.random() % 21);
	const time = performance.now() * 0.001; // Utilisez le temps pour créer une animation fluide

    // Modifiez ici les valeurs pour ajuster la couleur et le mouvement
    const hue = (time * 10) % 360; // Changement de teinte
    const saturation = 100; // Intensité de la couleur
    const lightness = 50; // Luminosité

    // Convertissez HSL en couleur RVB
    const color = new THREE.Color().setHSL(hue / 360, saturation / 100, lightness / 100);

    // Appliquez la couleur au fond de la scène
   scene.background = color;
}

function anim() {
    if (currentNum >= 0) {
        addClassDelayed(document.getElementById("countdown"), "puffer", 600);
		currentNum--;
        if (currentNum > 0) {
            document.getElementById("countdown").innerHTML = currentNum;
        } else if (currentNum == 0) {
            document.getElementById("countdown").innerHTML = "GO !";
        } else {
            document.getElementById("countdown").innerHTML = "";
            document.getElementById("countdown").classList.remove("puffer");
            return;
        }
        document.getElementById("countdown").classList.remove("puffer");
    } else {
        return;
    }
}

function onMessageHandler(e) {	
	game_data = JSON.parse(e.data);
	if (game_data.action == "userid") {
		gameSocket.send(JSON.stringify({
			'message' : 'userid',
			'userid' : appState.userId
		}));
	} 
	else if (game_data.action == "allin") {
		// loadingElement.innerHTML = "[LOADING GAME ...]";
		init();
	}
	else if (game_data.action == "playernumber")
	{
		playernumber = game_data.playernumber;
	}
	else if (game_data.action == "private")
	{
		gameSocket.send(JSON.stringify({
		'message' : 'private'
		}));
	} else if (game_data.action == 'Stop') 
	{
		const errorElement = document.getElementById('error');
		errorElement.textContent = "Final score : " + game_data.scorep2 + " - " + game_data.scorep1;
		const scoreElement = document.getElementById('score');
		scoreElement.textContent = "Final score : " + game_data.scorep2 + " - " + game_data.scorep1;
		// document.getElementById("myModal").style.display = "block";
		// myModal3.style.display = "block";
		// startBtn.style.display = "block";
		sessionStorage.setItem("game_id", null);
		gameSocket.send(JSON.stringify({
			'message' : 'getWinner'
			}));
	} 
	else if (game_data.action == 'winner')
	{
		console.log('jai gagner');
		if (finalid == -1)
		{
			myModal3.style.display = "block";
			tournamentSocket.send(JSON.stringify({
				'message' : 'winner',
				'finalid' : finalid
			}))
		}
		else
		{
			myModal2.style.display = "block";
		}
	}
	else if (game_data.action == 'looser')
	{
		// console.log('jai perdu');
		unloadScript();
		document.getElementById("myModal").style.display = "block";
	}
	else if (game_data.action == "userleave") {
		const errorElement = document.getElementById('error');
		errorElement.textContent = "A user left the game";
		document.getElementById("myModal").style.display = "block";
		unloadScript();
	} else if (game_data.action == 'score') {
		if (game_data.scorep1 != undefined && game_data.scorep2 != undefined) {
			const scoreL = document.getElementById("scoreHome");
			scoreL.textContent = game_data.scorep2;
			const scoreR = document.getElementById("scoreGuest");
			scoreR.textContent = game_data.scorep1;
		}
	} else if (game_data.action == 'counter') {
		if (game_data.num < currentNum) {
			currentNum = game_data.num;
			if (currentNum >= 0) {
				setTimeout(function() {}, 1500);
				setInterval(function() { anim(); }, 1325);
			}
		}
	}
	else {	
		const PaddleLeft = scene.getObjectByName(PaddleLeftName);
		const ball = scene.getObjectByName(BallName);
		const PaddleRight = scene.getObjectByName(PaddleRightName);
		if (game_data.action == 'paddle1') {
			PaddleRight.position.x = parseFloat(game_data.prx);
			PaddleRight.position.z = parseFloat(game_data.prz);
		} else if (game_data.action == 'paddle2') {
			PaddleLeft.position.x = parseFloat(game_data.plx);
			PaddleLeft.position.z = parseFloat(game_data.plz);
		} else if (game_data.action == 'ball') {
			ball.position.x = parseFloat(game_data.bx);
			ball.position.z = parseFloat(game_data.bz);
		} 
	}
};

const userList = document.getElementById('userList');

tournamentSocket.onmessage = function(e) {
	tournament_data = JSON.parse(e.data);
	console.log(tournament_data.action);
	if (tournament_data.message == 'tournamentIdNotFound')
	{
		window.location.reload();
	}
	// Suppose we have a list element to display the connected users
	if (tournament_data.action == 'namep1')
	{
		console.log('********************************************');
		console.log(tournament_data.namep1);
	}
	
	if (tournament_data.action == 'connect') {
		console.log(tournament_data.action);
		connected += 1;
		loadingElement.innerHTML = "[WAITING FOR OPPONENT]<br>Tournament ID : " + tournament_id + '<br>' + 'Currently connected : ' + connected + '/4';

		// Create a new list item for the connected user
		const userItem = document.createElement('li');
		userItem.textContent = "joueur " + appState.user.first_name;

		// Add the new user to the list of connected users
		userList.appendChild(userItem);

		console.log(userItem);
		// console.log(appState.user.first_name);
	}

	else if (tournament_data.action == 'playernb')
	{
		playernb = tournament_data['playernb'];
		console.log(`PLAYENB IS LJSKFDHAJHFKJSHFKHGS ${playernb}`);
	}
	else if (tournament_data.action == 'startTournament')
	{
		console.log('starting tournament');
		console.log('ici');
		tournamentSocket.send(JSON.stringify({
			'message' : 'getGameId',
			'playernb' : playernb
			}));
	}
	else if (tournament_data.action == 'gameid')
	{
		gameid = tournament_data['gameid'];
		console.log(`game id for player ${playernb} is ${gameid}`);
		gameSocket = new WebSocket(
			'wss://'
			+ window.location.host
			+ '/ws/'
			+ 'game'
			+ '/'
			+ gameid
			+ '/'
		);
		gameSocket.onmessage = function(event) {
			onMessageHandler(event);
		};
	}
	else if (tournament_data.action == 'finalid')
	{
		console.log('je suis en finale');
		gameSocket.close();
		gameSocket = null;
		finalid = tournament_data['finalid'];
		console.log(`game id for player ${playernb} is ${gameid}`);
	}
	else if (tournament_data.action == 'wonTournament')
	{
		const errorElement = document.getElementById('error');
		errorElement.textContent = "VOUS AVEZ REMPORTEZ LE TOURNOI, FELICITATIONS";
		unloadScript();
		tournamentSocket.close();
	}
}

function clearThreeJS() {
    // Supprimer les objets de la scène
    scene.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
            scene.remove(obj);
            obj.geometry.dispose();
            obj.material.dispose();
        }
    });

    // Supprimer les textures
    renderer.dispose();

    // Réinitialiser les variables
    renderer = null;
    scene = null;
    camera = null;
    controls = null;
    composer = null;
    scoreText1 = null;
    scoreText2 = null;
    player1Score = 0;
    player2Score = 0;
    ballVelocity = null;
    gameSocket = null;
    currentNum = 7;
}

function update_game_data() {
	ball = scene.getObjectByName(BallName);
	PaddleRight = scene.getObjectByName(PaddleRightName);
	PaddleLeft = scene.getObjectByName(PaddleLeftName);
	// console.log(PaddleRight);
	// console.log(ball);
	PaddleRight.position.x = parseFloat(game_data.paddleright_position_x);
	PaddleRight.position.z = parseFloat(game_data.paddleright_position_z);
	PaddleLeft.position.x = parseFloat(game_data.paddleleft_position_x);
	PaddleLeft.position.z = parseFloat(game_data.paddleleft_position_z);
	ball.position.x = parseFloat(game_data.ball_position_x);
	ball.position.z = parseFloat(game_data.ball_position_z);

}

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
window.addEventListener('resize', onWindowResize);