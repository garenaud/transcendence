import * as THREE from 'three';
import { LoadGLTFByPath } from './ModelHelper.js';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from '/node_modules/three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from '/node_modules/three/examples/jsm/loaders/FontLoader.js';
import { RectAreaLightHelper } from '/node_modules/three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RenderPass } from '/node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from '/node_modules/three/examples/jsm/postprocessing/EffectComposer.js';

let renderer;
let scene;
let camera;
let controls;
let cameraList = [];
let composer;
let scoreText1, scoreText2;
let player1Score = 0;
let player2Score = 0;
const mooveSpeed = 0.1;
const wallLimit = 6.5;
const ballLimit = 8.5;
const maxAngleAdjustment = 0.5;
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
	const materialargs = {
		color: 0xffffff,
		specular: 0x050505,
		shininess: 50,
		emissive: 0x000000
	};

	const material = new THREE.MeshPhongMaterial( materialargs );
	const loader = new FontLoader();
	const font = loader.load('fonts/helvetiker_bold.typeface.json', function (font) {
		console.log(font);
	})
	const scoreGeometry1 = new TextGeometry('0', { font: font,
		size: 100,
		height: 100,
	});
	const scoreMesh1 = new THREE.Mesh(scoreGeometry1, material);
	scoreMesh1.position.set(-10, 5, -10);  // Ajustez la position comme nécessaire
	scene.add(scoreMesh1);

	const scoreGeometry2 = new TextGeometry('0', {font: font});
	const scoreMesh2 = new THREE.Mesh(scoreGeometry2, material);
	scoreMesh2.position.set(10, 5, -10);  // Ajustez la position comme nécessaire
	scene.add(scoreMesh2);
	// Load the GLTF model and handle the PaddleRight
	LoadGLTFByPath(scene)
		.then(() => {
			handleGround();
			handleLight();
			// createScoreTexts();
			handleBall();
		})
		.catch((error) => {
			console.error('Error loading JSON scene:', error);
		});
		// scene.castShadow = true;
		scene.receiveShadow = true;
		
		// Animation loop
		animate();
}

function handleBall() {
	const ballName = 'Ball';
	ball = scene.getObjectByName(ballName);
	if (ball) {
		ball.position.set(0, 0, 0);
		const initialAngle = Math.random() * Math.PI * 2;
		const speed = 0.25;
		ballVelocity = new THREE.Vector3(Math.cos(initialAngle) * speed, 0, Math.sin(initialAngle) * speed);
	} else {
		console.error('Ball not found');
	}
}

function handleLight() {
	const LightName = 'PointLight';
	const Light = scene.getObjectByName(LightName);
	Light.intensity = 0.6;
	Light.castShadow = true;
	Light.frustumCulled = false;
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
	newControls.minDistance = 5;
	newControls.maxDistance = 69;
	
	return newControls;
}

function initPostprocessing() {
	const renderScene = new RenderPass(scene, camera);
	const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
	const newComposer = new EffectComposer(renderer);
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
	
	if (PaddleLeft) {
		if (KeyState['KeyW'] && PaddleLeft.position.z - mooveSpeed > -wallLimit) {
			PaddleLeft.position.z -= mooveSpeed;
		}
		if (KeyState['KeyS'] && PaddleLeft.position.z + mooveSpeed < wallLimit) {
			PaddleLeft.position.z += mooveSpeed;
		}
	} 
}

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
		
function animate() {
	requestAnimationFrame(animate);
	handlePaddleLeft();
	handlePaddleRight();
	updateBall();
	controls.update();
	composer.render(scene, camera);
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Appel de la fonction d'initialisation
init();
