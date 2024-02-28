import * as THREE from 'three';
import { LoadGLTFByPath } from './ModelHelper.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
// import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

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
let PaddleRight;
let PaddleLeft;
let ball;
let ballVelocity;

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

	// Scene
	scene = new THREE.Scene();

	// Camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
	camera.position.set(0, 5, 5);

	// Controls
	controls = initControls();

	// Postprocessing
	composer = initPostprocessing();

	// Load the GLTF model and handle the PaddleRight
	LoadGLTFByPath(scene)
		.then(() => {
			handleGround();
			handleLight();
			handleText();
			// createScoreTexts();
			handleBall();
		})
		.catch((error) => {
			console.error('Error loading JSON scene:', error);
		});
		scene.castShadow = true;
		scene.receiveShadow = true;
		console.log(scene);
		
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
		ball.position.set(0, 0, 0);
		ballVelocity = new THREE.Vector3(Math.cos(initialAngle) * speed, 0, Math.sin(initialAngle) * speed);
		console.log(ballVelocity)
	} else {
		console.error('Ball not found');
	}
}

function handleLight() {
	const light = new THREE.AmbientLight( 0xFFFFFFF , 0.4 ); // soft white light
	light.castShadow = true;
	const directionalLight = new THREE.DirectionalLight( 0xFFFFFFF, 1.1 );
	scene.add( light );
	scene.add( directionalLight );
	const width = 38;
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
	newControls.minDistance = 45;
	newControls.maxDistance = 69;
	
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
	Ground.roughness = 1.8;
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
	// console.log(PaddleRight);4
	// x === 15
	
	if (PaddleRight) {
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
	// console.log(PaddleLeft);
	
	// TODO condition si 2player alors mouvement, sinon IA;
	if (PaddleLeft) {
		if (KeyState['KeyW'] && PaddleLeft.position.z - mooveSpeed > -wallLimit) {
			PaddleLeft.position.z -= mooveSpeed;
		}
		if (KeyState['KeyS'] && PaddleLeft.position.z + mooveSpeed < wallLimit) {
			PaddleLeft.position.z += mooveSpeed;
		}
	} 
}


// TODO: Reajuster l'angle de la balle.
function handlePaddleCollision() {
	const ballRadius = ball.geometry.boundingSphere.radius;
	const PaddleSizeX = PaddleLeft.geometry.boundingBox.max.x;
	const PaddleSizeZ = PaddleLeft.geometry.boundingBox.max.z + 0.6;
	const maxAngleAdjustment = Math.PI / 6; // Angle maximal d'ajustement
	const minAngleAdjustment = -Math.PI / 6; // Angle minimal d'ajustement

	if (PaddleLeft && PaddleRight) {
		// Vérifier la collision avec le paddle gauche
		if (
			ball.position.x - ballRadius < PaddleLeft.position.x + PaddleSizeX / 2 &&
			ball.position.x + ballRadius > PaddleLeft.position.x - PaddleSizeX / 2 &&
			ball.position.z + ballRadius > PaddleLeft.position.z - PaddleSizeZ / 2 &&
			ball.position.z - ballRadius < PaddleLeft.position.z + PaddleSizeZ / 2
			) {
			const relativePosition = (ball.position.z - PaddleLeft.position.z) / PaddleSizeZ;
			const angleAdjustment = (relativePosition - 0.5) * (maxAngleAdjustment - minAngleAdjustment) * 0.6;

			// Ajuster la direction de la balle en fonction de l'angle
			const angle = Math.PI / 4 + angleAdjustment; // ou toute autre formule d'ajustement
			ballVelocity.x = Math.cos(angle) * 0.2;
			ballVelocity.z = Math.sin(angle) * 0.2;
			}
			// Vérifier la collision avec le paddle droit
			if (
				ball.position.x - ballRadius < PaddleRight.position.x + PaddleSizeX / 2 &&
				ball.position.x + ballRadius > PaddleRight.position.x - PaddleSizeX / 2 &&
				ball.position.z + ballRadius > PaddleRight.position.z - PaddleSizeZ / 2 &&
				ball.position.z - ballRadius < PaddleRight.position.z + PaddleSizeZ / 2
				) {
					const relativePosition = (ball.position.z - PaddleRight.position.z) / PaddleSizeZ;
					const angleAdjustment = (relativePosition - 0.5) * (maxAngleAdjustment - minAngleAdjustment) * 0.3;
		
					// Ajuster la direction de la balle en fonction de l'angle
					const angle = -Math.PI / 4 - angleAdjustment; // ou toute autre formule d'ajustement
					ballVelocity.x = -Math.cos(angle) * 0.2;
					ballVelocity.z = -Math.sin(angle) * 0.2;
			}
	}
}
		
function handleWallColision() {
	if (ball.position.z > ballLimit || ball.position.z < -ballLimit) {
		ballVelocity.z *= -1;
	} else if (ball.position.x > 18 || ball.position.x < -18) {
		ball.position.set(0, 0, 0);
		ballVelocity = new THREE.Vector3(Math.cos(initialAngle) * speed, 0, Math.sin(initialAngle) * speed);
	}
}
		
function updateBall() {
	if (ball) {
		ball.position.z += ballVelocity.z;
		ball.position.x += ballVelocity.x;
		handlePaddleCollision();
		handleWallColision();
	}
}

// Fonction pour gérer le mouvement du paddle de l'IA
function handleAIPaddle() {

    // Déclaration des variables locales
    // const PaddleLeftName = 'LeftPaddle';
    // const PaddleLeft = scene.getObjectByName(PaddleLeftName);
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

function animate() {
	requestAnimationFrame(animate);
	handlePaddleLeft();
	handlePaddleRight();
	handleAIPaddle();
	// handleAIPaddleRight();
	updateBall();
	controls.update();
	composer.render(scene, camera);
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Appel de la fonction d'initialisation
init();
