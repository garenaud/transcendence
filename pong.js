import * as THREE from 'three';
import { LoadGLTFByPath } from './ModelHelper.js';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from '/node_modules/three/examples/jsm/geometries/TextGeometry.js';
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
	camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0, 5, 5);

	// Controls
	controls = initControls();

	// Postprocessing
	composer = initPostprocessing();

	// Load the GLTF model and handle the ball
	LoadGLTFByPath(scene)
		.then(() => {
			handleBall();
			createScoreTexts();
			// retrieveListOfCameras(scene);
		})
		.catch((error) => {
			console.error('Error loading JSON scene:', error);
		});

	// Animation loop
	animate();
}

function createScoreTexts() {
	// Create a material for the text
	const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

	// Create text geometry for player 1's score
	const scoreGeometry1 = new TextGeometry('Score: ' + player1Score, {
		// Specify a font (you may need to load it),
		size: 1,
		height: 0.1,
		curveSegments: 12,
		bevelEnabled: false,
		material: 0,
		extrudeMaterial: 1,
	});

	// Create a mesh for player 1's score text
	scoreText1 = new THREE.Mesh(scoreGeometry1, textMaterial);
	scoreText1.position.set(-5, 5, -10); // Adjust position as needed
	scene.add(scoreText1);

	// Create text geometry for player 2's score
	const scoreGeometry2 = new TextGeometry('Score: ' + player2Score, {
		// Specify a font (you may need to load it),
		size: 1,
		height: 0.1,
		curveSegments: 12,
		bevelEnabled: false,
		material: 1,
		extrudeMaterial: 1,
	});

	// Create a mesh for player 2's score text
	scoreText2 = new THREE.Mesh(scoreGeometry2, textMaterial);
	scoreText2.position.set(5, 5, -10); // Adjust position as needed
	scene.add(scoreText2);
}

function updateScoreTexts() {
	// Mettez à jour le texte des scores avec les scores actuels
	scoreText1.geometry = new TextGeometry('Score: ' + player1Score, {
		size: 1,
		height: 0.1,
		curveSegments: 12,
		bevelEnabled: false,
		material: 0,
		extrudeMaterial: 1,
	});

	scoreText2.geometry = new TextGeometry('Score: ' + player2Score, {
		size: 1,
		height: 0.1,
		curveSegments: 12,
		bevelEnabled: false,
		material: 0,
		extrudeMaterial: 1,
	});
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
	const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
	const newComposer = new EffectComposer(renderer);
	newComposer.addPass(renderScene);
	newComposer.addPass(bloomPass);

	return newComposer;
}

function handleBall() {
	const ballName = 'Ball';
	const ball = scene.getObjectByName(ballName);

	if (ball) {
		document.addEventListener('keydown', (event) => {
			if (event.code === 'KeyD') {
				ball.position.x += 1;
			}

			// Ajoutez d'autres mouvements en fonction de vos besoins
		});
	} else {
		console.log('La balle avec le nom', ballName, 'n\'a pas été trouvée dans la scène.');
	}
}

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	composer.render(scene, camera);
}
// console.log(camera.position);
// Appel de la fonction d'initialisation
init();
