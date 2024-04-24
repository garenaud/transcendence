import * as THREE from 'three';
import { LoadGLTFByPath } from './ModelHelper.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
//import { tournament_id } from './join.js';
// import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

let active = false;
let tournament_id = sessionStorage.getItem('tournament_id');
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
let currentNum = 7;

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

if (tournament_id === "null" || tournament_id === undefined) {
	window.location.href = "https://localhost/";
}

gameSocket = new WebSocket(
	'wss://'
	+ window.location.host
	+ '/ws/'
	+ 'tournament'
	+ '/'
	+ tournament_id
	+ '/'
);

const loadingElement = document.getElementById('loading_txt');
loadingElement.innerHTML = "[WAITING FOR OPPONENT]<br>Game ID : " + tournament_id;

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
		canvas: document.querySelector('#background'),
		antialias: true,
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;

	// Scene
	scene = new THREE.Scene();
	//scene.background = new THREE.Color('purple');

	// Camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
	camera.position.set(0, scaleCam(), scaleCam());
	// Controls
	controls = initControls();

	// Postprocessing
	composer = initPostprocessing();

	// Load the GLTF model and handle the PaddleRight
	// TODO waiting room;
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
			checkPortraitMode();
			// createScoreTexts();
		})
		.catch((error) => {
			console.error('Error loading JSON scene:', error);
		});
		scene.castShadow = true;
		scene.receiveShadow = true;
		// Animation loop
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
	checkPortraitMode();
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

// document.addEventListener('keydown', function(e){
// 	if (e.key == 'ArrowUp')
// 	{
// 		gameSocket.send(JSON.stringify({
// 			'message' : 'Up'
// 		}));
// 	}
// 	else if (e.key == 'ArrowDown')
// 	{
// 		gameSocket.send(JSON.stringify({
// 			'message' : 'Down'
// 		}));
// 	}
// });

// function handlePaddleRight() {
// 	const PaddleRightName = 'RightPaddle';
// 	PaddleRight = scene.getObjectByName(PaddleRightName);
	
// 	// console.log(PaddleRight);4
// 	// x === 15
	
// 	if (PaddleRight) {
// 		PaddleRight.castShadow = true;
// 		// PaddleRight.receiveShadow = true;
// 		if (KeyState['ArrowUp'] && PaddleRight.position.z - mooveSpeed > -wallLimit) {
// 			PaddleRight.position.z -= mooveSpeed;
// 		}
// 		if (KeyState['ArrowDown'] && PaddleRight.position.z + mooveSpeed < wallLimit) {
// 			PaddleRight.position.z += mooveSpeed;
// 		}	
// 	}
// }

// function handlePaddleLeft() {
// 	const PaddleLeftName = 'LeftPaddle';
// 	PaddleLeft = scene.getObjectByName(PaddleLeftName);
// 	// console.log(PaddleLeft);
	
// 	// TODO condition si 2player alors mouvement, sinon IA;
// 	if (PaddleLeft) {
// 		PaddleLeft.castShadow = true;
// 		// PaddleLeft.receiveShadow = true;
// 		if (KeyState['KeyW'] && PaddleLeft.position.z - mooveSpeed > -wallLimit) {
// 			PaddleLeft.position.z -= mooveSpeed;
// 		}
// 		if (KeyState['KeyS'] && PaddleLeft.position.z + mooveSpeed < wallLimit) {
// 			PaddleLeft.position.z += mooveSpeed;
// 		}
// 	} 
// }

// let speedIncreaseFactor = 1.1; // Facteur d'augmentation de la vitesse

// // TODO: Reajuster l'angle de la balle.
// function handlePaddleCollision() {
// 	const ballRadius = ball.geometry.boundingSphere.radius;
// 	const PaddleSizeX = PaddleLeft.geometry.boundingBox.max.x;
// 	const PaddleSizeZ = PaddleLeft.geometry.boundingBox.max.z + 0.6;
// 	const maxAngleAdjustment = Math.PI / 6; // Angle maximal d'ajustement
// 	const minAngleAdjustment = -Math.PI / 6; // Angle minimal d'ajustement
// 	if (PaddleLeft && PaddleRight) {
// 		// Vérifier la collision avec le paddle gauche
// 		if (
// 			ball.position.x - ballRadius < PaddleLeft.position.x + PaddleSizeX / 2 &&
// 			ball.position.x + ballRadius > PaddleLeft.position.x - PaddleSizeX / 2 &&
// 			ball.position.z + ballRadius > PaddleLeft.position.z - PaddleSizeZ / 2 &&
// 			ball.position.z - ballRadius < PaddleLeft.position.z + PaddleSizeZ / 2
// 			) {
// 				const relativePosition = (ball.position.z - PaddleLeft.position.z) / PaddleSizeZ;
// 				const angleAdjustment = (relativePosition - 0.5) * (maxAngleAdjustment - minAngleAdjustment) * 0.6;
				
// 				// Ajuster la direction de la balle en fonction de l'angle
// 				const angle = Math.PI / 4 + angleAdjustment; // ou toute autre formule d'ajustement
// 				ballVelocity.x = Math.cos(angle) * (0.2 * speedIncreaseFactor);
// 				ballVelocity.z = Math.sin(angle) * (0.2 * speedIncreaseFactor);
// 				speedIncreaseFactor += 0.1;
// 			}
// 		// Vérifier la collision avec le paddle droit
// 		if (
// 			ball.position.x - ballRadius < PaddleRight.position.x + PaddleSizeX / 2 &&
// 			ball.position.x + ballRadius > PaddleRight.position.x - PaddleSizeX / 2 &&
// 			ball.position.z + ballRadius > PaddleRight.position.z - PaddleSizeZ / 2 &&
// 			ball.position.z - ballRadius < PaddleRight.position.z + PaddleSizeZ / 2
// 			) {
// 				const relativePosition = (ball.position.z - PaddleRight.position.z) / PaddleSizeZ;
// 				const angleAdjustment = (relativePosition - 0.5) * (maxAngleAdjustment - minAngleAdjustment) * 0.3;
				
// 				// Ajuster la direction de la balle en fonction de l'angle
// 				const angle = -Math.PI / 4 - angleAdjustment; // ou toute autre formule d'ajustement
// 				ballVelocity.x = -Math.cos(angle) * (0.2 * speedIncreaseFactor);
// 				ballVelocity.z = -Math.sin(angle) * (0.2 * speedIncreaseFactor);
// 				speedIncreaseFactor += 0.1;
// 			}
// 		}
// 	}
	
// 	function handleWallColision() {
// 		if (ball.position.z > ballLimit || ball.position.z < -ballLimit) {
// 			ballVelocity.z *= -1;
// 		} else if (ball.position.x > 18 || ball.position.x < -18) {
// 			ball.position.x = 0;
// 			ball.position.y = 0;
// 			ball.position.z = 0;
// 			console.log('youpi');
// 			speedIncreaseFactor = 1.1;
// 			ballVelocity = new THREE.Vector3(Math.cos(initialAngle) * speed, 0, Math.sin(initialAngle) * speed);
// 		}
// 	}
	
// 	function updateBall() {
// 		if (ball) {
// 			// ball.position.z += ballVelocity.z;
// 			// ball.position.x += ballVelocity.x;

// 			//console.log(speedIncreaseFactor);
// 			handlePaddleCollision();
// 			handleWallColision();
// 		}
// 	}
	
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

gameSocket.onmessage = function(e) {
	game_data = JSON.parse(e.data);
	if (game_data.action == "allin") {
		loadingElement.innerHTML = "[LOADING GAME ...]";
		init();
	}
	else if (game_data.action == "private")
	{
		if (privategame == 'true')
		{
			gameSocket.send(JSON.stringify({
			'message' : 'private'
			}));
		}
		else
		{
			gameSocket.send(JSON.stringify({
			'message' : 'public'
			}));
		}
	} else if (game_data.action == 'Stop') {
		const errorElement = document.getElementById('error');
		errorElement.textContent = "Final score : " + game_data.scorep2 + " - " + game_data.scorep1;
		document.getElementById("myModal").style.display = "block";
		sessionStorage.setItem("tournament_id", null);
	} else if (game_data.action == "userleave") {
		const errorElement = document.getElementById('error');
		errorElement.textContent = "A user left the game";
		document.getElementById("myModal").style.display = "block";
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
		const ball = scene.getObjectByName('Ball');
		const PaddleLeft = scene.getObjectByName("LeftPaddle");
		const PaddleRight = scene.getObjectByName("RightPaddle");
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


function update_game_data() {
	const PaddleRightName = 'RightPaddle';
	const PaddleLeftName = 'LeftPaddle';
	ball = scene.getObjectByName('Ball');
	PaddleRight = scene.getObjectByName(PaddleRightName);
	PaddleLeft = scene.getObjectByName(PaddleLeftName);
	// console.log(PaddleRight);
	// console.log(ball);
	PaddleRight.position.x = parseFloat(game_data.paddleright_position_x);
	PaddleRight.position.z = parseFloat(game_data.paddleright_position_z);
	PaddleLeft.position.x = parseFloat(game_data.paddleleft_position_x);
	PaddleLeft.position.z = parseFloat(game_data.paddleleft_position_z);
	//PaddleLeft.position.z = parseFloat(game_data.paddleleft_position_z);
	ball.position.x = parseFloat(game_data.ball_position_x);
	ball.position.z = parseFloat(game_data.ball_position_z);

}

function animate() {
	//update_game_data();
	requestAnimationFrame(animate);
	//handlePaddleLeft();
	//handlePaddleRight();
	//handleAIPaddle();
	//handleBackground(); COLOR BACKGROUND
	// handleAIPaddleRight();
	//updateBall();
	// console.log(ball.position.x);
	// console.log(ball.position.z);
	// gameSocket.send(JSON.stringify(
	// 	{
	// 		"message" : "ball_update"
	// 	})
	// );
	controls.update();
	//composer.render(scene, camera);
	renderer.render(scene, camera);
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
window.addEventListener('resize', onWindowResize);
