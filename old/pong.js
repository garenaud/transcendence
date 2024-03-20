import * as THREE from 'three';
import { LoadGLTFByPath } from './ModelHelper.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// main
let scene;
let renderer;
let camera;
let controls;
let composer;
let player1Score = 0;
let player2Score = 0;
const initialAngle = 0.45;
const speed = 0.25;
const mooveSpeed = 0.15;
const wallLimit = 6.5;
const ballLimit = 8.5;
const maxAngleAdjustment = 0.5;
// const deltaTime = 30;
let scoreLeft;
let scoreRight;
let PaddleRight;
let PaddleLeft;
let ball;
let ballVelocity;
// const socket = new WebSocket('ws://localhost:3000');

const KeyState = {
	KeyW: false,
	KeyS: false,
	ArrowUp: false,
	ArrowDown: false,
};

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
			handleBall();
		})
		.catch((error) => {
			console.error('Error loading JSON scene:', error);
		});
		scene.castShadow = true;
		scene.receiveShadow = true;

		// Animation loop
		// console.log(socket);
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

function updateCameraAspect(selectedCamera) {
	const width = window.innerWidth;
	const height = window.innerHeight;
	selectedCamera.aspect = width / height;
	selectedCamera.updateProjectionMatrix();
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
	if (KeyState.hasOwnProperty(event.code)) {
		KeyState[event.code] = true;
	}
}

// Fonction pour gérer le relâchement d'une touche
function handleKeyUp(event) {
	if (KeyState.hasOwnProperty(event.code)) {
		KeyState[event.code] = false;
	}
}

function handlePaddleRight() {
	const PaddleRightName = 'RightPaddle';
	PaddleRight = scene.getObjectByName(PaddleRightName);
	// x === 15
	
	if (PaddleRight) {
		PaddleRight.castShadow = true;
		// PaddleRight.receiveShadow = true;
		if (KeyState['ArrowUp'] && PaddleRight.position.z - mooveSpeed > -wallLimit) {
			PaddleRight.position.z -= mooveSpeed;
		}
		if (KeyState['ArrowDown'] && PaddleRight.position.z + mooveSpeed < wallLimit) {
			PaddleRight.position.z += mooveSpeed;
		}	
	}
}

function handlePaddleLeft() {
	const PaddleLeftName = 'LeftPaddle';
	PaddleLeft = scene.getObjectByName(PaddleLeftName);
	
	// TODO condition si 2player alors mouvement, sinon IA;
	if (PaddleLeft) {
		PaddleLeft.castShadow = true;
		// PaddleLeft.receiveShadow = true;
		if (KeyState['KeyW'] && PaddleLeft.position.z - mooveSpeed > -wallLimit) {
			PaddleLeft.position.z -= mooveSpeed;
		}
		if (KeyState['KeyS'] && PaddleLeft.position.z + mooveSpeed < wallLimit) {
			PaddleLeft.position.z += mooveSpeed;
		}
	} 
}

let speedIncreaseFactor = 1; // Facteur d'augmentation de la vitesse

// TODO: Reajuster l'angle de la balle.
function handlePaddleCollision() {
	const ballRadius = ball.geometry.boundingSphere.radius;
	const PaddleSizeX = 0;
	const PaddleSizeZ = PaddleLeft.geometry.boundingBox.max.z + 3;
	let isColliding = false;
	// console.log(PaddleSizeZ);

	if (PaddleLeft && PaddleRight && !isColliding) {
		// Vérifier la collision avec le paddle gauche
		if (
			ball.position.x - ballRadius < PaddleLeft.position.x + PaddleSizeX / 2 &&
			ball.position.x + ballRadius > PaddleLeft.position.x - PaddleSizeX / 2 &&
			ball.position.z + ballRadius > PaddleLeft.position.z - PaddleSizeZ / 2 &&
			ball.position.z - ballRadius < PaddleLeft.position.z + PaddleSizeZ / 2
			) {
				isColliding = true;
				ballVelocity.x *= -1;
				speedIncreaseFactor += 0.1;
			}
			// Vérifier la collision avec le paddle droit
			if (
				ball.position.x - ballRadius < PaddleRight.position.x + PaddleSizeX / 2 &&
				ball.position.x + ballRadius > PaddleRight.position.x - PaddleSizeX / 2 &&
				ball.position.z + ballRadius > PaddleRight.position.z - PaddleSizeZ / 2 &&
				ball.position.z - ballRadius < PaddleRight.position.z + PaddleSizeZ / 2
				) {
					isColliding = true;
					ballVelocity.x *= -1;
					speedIncreaseFactor += 0.1;
				}
			}
			isColliding = false;
	}
	
function handleWallColision() {
		if (ball.position.z > ballLimit || ball.position.z < -ballLimit) {
			ballVelocity.z *= -1;
		} else if (ball.position.x > 18 || ball.position.x < -18) {
			ball.position.set(0, 0, 0);
			speedIncreaseFactor = 1.1;
			ballVelocity = new THREE.Vector3(Math.cos(initialAngle) * speed, 0, Math.sin(initialAngle) * speed);
		}
}
	
	function updateBall() {
		if (ball) {
			ball.position.z += ballVelocity.z * speedIncreaseFactor;
			ball.position.x += ballVelocity.x * speedIncreaseFactor;
			// console.log(speedIncreaseFactor);
			handlePaddleCollision();
			handleWallColision();
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

function animate() {
	requestAnimationFrame(animate);
	handlePaddleLeft();
	handlePaddleRight();
	handleBackground();
	updateBall();
	controls.update();
	composer.render(scene, camera);
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Appel de la fonction d'initialisation
init();
