import * as THREE from 'three';
import { LoadGLTFByPath } from './ModelHelper.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
//import { gameid } from './join.js';
// import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

let gameid = sessionStorage.getItem('gameid');
let game_data;
let renderer;
let scene;
let camera;
let controls;
let composer;
let player1Score = 0;
let player2Score = 0;
const initialAngle = 0.45;
const speed = 0.25;
let scoreLeft;
let scoreRight;
let PaddleRight;
let PaddleLeft;
let ball;
let ballVelocity;
let gameSocket;

const KeyState = {
	KeyW: false,
	KeyS: false,
	ArrowUp: false,
	ArrowDown: false,
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

// console.log(`ID IS ${gameid}`);

// if (gameid != null)
// {
gameSocket = new WebSocket(
	'ws://'
	+ window.location.host
	+ '/ws/'
	+ 'game'
	+ '/'
	+ makeid(3)
	+ '/'
);
// }
// else
// {
// 	gameSocket = new WebSocket(
// 		'ws://'
// 		+ window.location.host
// 		+ '/ws/'
// 		+ 'game'
// 		+ '/'
// 		+ makeid(5)
// 		+ '/'
// 	);
// }

export function initPong() {
	// Renderer
	renderer = new THREE.WebGLRenderer({
		canvas: document.querySelector('#background'),
		antialias: true,
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;

	// Scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color('purple');

	// Camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
	camera.position.set(0, 5, 5);

	// Controls
	controls = initControls();

	// Postprocessing
	composer = initPostprocessing();

	// Load the GLTF model and handle the PaddleRight
	// TODO waiting room;
	LoadGLTFByPath(scene)
		.then(() => {
			handleGround();
			handleLight();
			handleText();
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
	Ground.position.y = -1.9;
	Ground.receiveShadow = true;
}

// Fonction pour gérer l'appui sur une touche
function handleKeyDown(event) {
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
		else if (event.code == 'Escape')
		{
			gameSocket.send(JSON.stringify({
			'message' : 'Stop'
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
}

// Fonction pour gérer le relâchement d'une touche
function handleKeyUp(event) {
	if (KeyState.hasOwnProperty(event.code)) {
		KeyState[event.code] = false;
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

gameSocket.onmessage = function(e) {
	game_data = JSON.parse(e.data);
	ball = scene.getObjectByName('Ball');
	PaddleRight = scene.getObjectByName("RightPaddle");
	PaddleLeft = scene.getObjectByName("LeftPaddle");
	if (game_data.action == 'game' && ball)
	{
		PaddleLeft.castShadow = true;
		PaddleRight.castShadow = true;
		ball.position.x = parseFloat(game_data.bx);
		ball.position.z = parseFloat(game_data.bz);
		PaddleRight.position.x = parseFloat(game_data.prx);
		PaddleRight.position.z = parseFloat(game_data.prz);
		PaddleLeft.position.x = parseFloat(game_data.plx);
		PaddleLeft.position.z = parseFloat(game_data.plz);
	}
	gameSocket.send(JSON.stringify({
		'message' : 'update'
		}));
};

function animate() {
	requestAnimationFrame(animate);
	handleBackground();
	controls.update();
	composer.render(scene, camera);
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Appel de la fonction d'initialisation
initPong();
