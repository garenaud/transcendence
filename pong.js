import * as THREE from 'three'
import {LoadGLTFByPath} from './ModelHelper.js'
import {OrbitControls} from '/node_modules/three/examples/jsm/controls/OrbitControls.js'
import {RenderPass} from '/node_modules/three/examples/jsm/postprocessing/RenderPass.js'
import {UnrealBloomPass} from '/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { EffectComposer } from '/node_modules/three/examples/jsm/postprocessing/EffectComposer.js'

//Renderer does the job of rendering the graphics
let renderer = new THREE.WebGLRenderer({

	//Defines the canvas component in the DOM that will be used
	canvas: document.querySelector('#background'),
  antialias: true,
});


const params = {
	threshold: 0,
	strength: 1,
	radius: 0,
	exposure: 1
};

renderer.setSize(window.innerWidth, window.innerHeight);

//set up the renderer with the default settings for threejs.org/editor - revision r153
renderer.shadows = true;
renderer.castShadow = true;
renderer.receiveShadow = true;
renderer.shadowType = 1;
renderer.shadowMap.enabled = true;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.toneMapping = 0;
renderer.toneMappingExposure = 1;
renderer.useLegacyLights  = true;
renderer.toneMapping = THREE.NoToneMapping;
// renderer.setClearColor(0xffffff, 0);
//make sure three/build/three.module.js is over r152 or this feature is not available. 
renderer.outputColorSpace = THREE.SRGBColorSpace 


const scene = new THREE.Scene();

const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
				dirLight.position.set( 0, 0, 10 );
				dirLight.castShadow = true;
				// dirLight.shadow.camera.top = 2;
				// dirLight.shadow.camera.bottom = - 2;
				// dirLight.shadow.camera.left = - 2;
				// dirLight.shadow.camera.right = 2;
				// dirLight.shadow.camera.near = 0.1;
				// dirLight.shadow.camera.far = 40;
scene.add( dirLight );

let cameraList = [];

let camera;

// Load the GLTF model
LoadGLTFByPath(scene)
  .then(() => {
    retrieveListOfCameras(scene);
  })
  .catch((error) => {
    console.error('Error loading JSON scene:', error);
  });

//retrieve list of all cameras
function retrieveListOfCameras(scene){
  // Get a list of all cameras in the scene
  scene.traverse(function (object) {
    if (object.isCamera) {
      cameraList.push(object);
    }
  });

  //Set the camera to the first value in the list of cameras
  camera = cameraList[0];

  updateCameraAspect(camera);

  // Start the animation loop after the model and cameras are loaded
  animate();
}

// Set the camera aspect ratio to match the browser window dimensions
function updateCameraAspect(camera) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 50, 0.4, 0.1 );
composer.addPass(bloomPass);
			// bloomPass.threshold = params.threshold;
			// bloomPass.strength = params.strength;
			// bloomPass.radius = params.radius;

//A method to be run each time a frame is generated
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
};

