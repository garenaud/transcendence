import * as THREE from 'three';
import { LoadGLTFByPath } from './ModelHelper.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from './node_modules/three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from './node_modules/three/examples/jsm/loaders/FontLoader.js';
import { RectAreaLightHelper } from './node_modules/three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RenderPass } from './node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from './node_modules/three/examples/jsm/postprocessing/EffectComposer.js';

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
let font;
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
		// scene.castShadow = true;
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
	// scoreLeft.index = 1111;
	// scoreLeft = new TextGeometry('aoisdjaidjoisdhjodihodhaoiiadhoasihdd 1', {
	// 	size: 100,
	// 	height: 5,
	// });
	// const newMesh = new THREE.Mesh(scoreLeft, scoreLeft.material);
	// newMesh.position.set(-8, 0, 0.1);
	// scene.add(newMesh);
	// console.log(scoreLeft);
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
	const light = new THREE.AmbientLight( 0x040404 , 0.2 ); // soft white light
	light.castShadow = true;
	// console.log(scene);
	scene.add( light );
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
	const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.1, 0.1, 0.60);
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

function run() {
 
    // Creating Our XMLHttpRequest object 
    let xhr = new XMLHttpRequest();
 
    // Making our connection  
    let url = 'http://localhost:8000/user/3';
    xhr.open("GET", url, true);
 
    // function execute after request is successful 
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    }
    // Sending our request 
    xhr.send();
}
run();
// Appel de la fonction d'initialisation
init();
