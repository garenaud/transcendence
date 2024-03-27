import * as THREE from 'three';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


var MexicanRun = [];
var MexicanIdle = [];
var BossIdle = [];
var BossRun = [];
let LeftId;
let RightId;
let KeypressLeft = 0.1;
let KeypressRight = 0.1;

class BasicCharacterControls {
  constructor(params) {
    this._Init(params);
	this._initialePosition = params.target.position.clone();
	this.id = params.target.id;
  }

  _Init(params) {
    this._params = params;
    this._move = {
		forward: false,
		Bossforward: false,
		backward: false,
		Bossbackward: false,
    };
    this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
    this._velocity = new THREE.Vector3(0, 0, 0);

    document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  }

  _onKeyDown(event) {
	  switch (event.keyCode) {
		  case 87: // w
		  this._move.forward = true;
		  if (MexicanRun) MexicanRun.play();
		  if (MexicanIdle) MexicanIdle.stop();
		  break;
		  case 38: // up
		  this._move.Bossforward = true;
		  if (BossRun) BossRun.play();
		  if (BossIdle) BossIdle.stop();
		  break ;
		  case 40: // down
		  this._move.Bossbackward = true;
		  if (BossRun) BossRun.play();
		  if (BossIdle) BossIdle.stop();
		  break ;
		  
		}
	}
	
	_onKeyUp(event) {
    switch(event.keyCode) {
      case 87: // w
	  this._move.forward = false;
	  if (MexicanIdle) MexicanIdle.play();
	  if (MexicanRun) MexicanRun.stop();
	  KeypressLeft += 0.1;
	  break ;
      case 83: // s
	  console.log('DOWN');
	  KeypressLeft += 0.1;
	  break ;
      case 38: // up
	  this._move.Bossforward = false;
	  if (BossIdle) BossIdle.play();
	  if (BossRun) BossRun.stop();
	  KeypressRight += 0.1;
	  break ;
      case 40: // down
	  this._move.Bossbackward = false;
	  if (BossIdle) BossIdle.play();
	  if (BossRun) BossRun.stop();
	  KeypressRight += 0.1;
	  break ;
    }
  }

  Update(timeInSeconds) {
    const velocity = this._velocity;
    const frameDecceleration = new THREE.Vector3(
        velocity.x * this._decceleration.x,
        velocity.y * this._decceleration.y,
        velocity.z * this._decceleration.z
    );
    frameDecceleration.multiplyScalar(timeInSeconds);
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
        Math.abs(frameDecceleration.z), Math.abs(velocity.z));

    velocity.add(frameDecceleration);

    const controlObject = this._params.target;
		// console.log(controlObject.id);
    const _R = controlObject.quaternion.clone();

    // Déplacer le personnage vers l'avant
    if (this.id === LeftId && this._move.forward) {
        velocity.z += this._acceleration.z * timeInSeconds + KeypressLeft;
    }    
	if (this.id === RightId && this._move.Bossforward) {
        velocity.z += this._acceleration.z * timeInSeconds + KeypressRight;
    }

    controlObject.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3(0, 0, 0);
    oldPosition.copy(controlObject.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();
    forward.multiplyScalar(velocity.z * timeInSeconds);

	const oldPositionBoss = new THREE.Vector3(0, 0, 0);
    oldPositionBoss.copy(controlObject.position);

    const Bossforward = new THREE.Vector3(0, 0, 1);
    Bossforward.applyQuaternion(controlObject.quaternion);
    Bossforward.normalize();
    Bossforward.multiplyScalar(velocity.z * timeInSeconds);

    controlObject.position.add(forward);
    controlObject.position.add(Bossforward);
	}
}

class LoadModelDemo {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this._threejs.domElement);

    window.addEventListener('resize', () => {
      this._OnWindowResize();
    }, false);

    const fov = 50;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(75, 70, -244);
    this._scene = new THREE.Scene();


    let light = new THREE.DirectionalLight(0xFFFFFF, 1.4);
    light.position.set(20, 100, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    light = new THREE.AmbientLight(0xFFFFFF, 1.6);
    this._scene.add(light);

    const controls = new OrbitControls(
      this._camera, this._threejs.domElement);
	controls.listenToKeyEvents(this._threejs.domElement);
	controls.minDistance = 10;
	controls.maxDistance = 244;
    controls.target.set(0, 20, 0);
    controls.update();

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        './skybox/posx.jpg',
        './skybox/negx.jpg',
        './skybox/posy.jpg',
        './skybox/negy.jpg',
        './skybox/posz.jpg',
        './skybox/negz.jpg',
    ]);
    this._scene.background = texture;

	

	const textureLoader = new THREE.TextureLoader();
	textureLoader.load( './skybox/Field.png', (texture) => {
		const material = new THREE.MeshStandardMaterial({
			map: texture, // Application de la texture au matériau
		});
		const plane = new THREE.Mesh(
			new THREE.PlaneGeometry(100, 300, 10),
			material
			);
			plane.castShadow = false;
			plane.receiveShadow = true;
			plane.rotation.x = -Math.PI / 2;
	
			// Ajout du plan à la scène
			this._scene.add(plane);
		},
	);
	

    this._mixers = [];
    this._LoadTheBoss();
	this._LoadTheCatch();
    this._RAF();
  }

  _LoadTheBoss() {
    const loader = new FBXLoader();
    loader.setPath('./models/');
    loader.load('TheBoss.fbx', (fbxBoss) => {
      fbxBoss.scale.setScalar(0.1);
      fbxBoss.traverse(c => {
        c.castShadow = true;
      });
	  const offset = new THREE.Vector3(-17, -1.8, -140);
	  fbxBoss.position.copy(offset);
	  RightId = fbxBoss.id;
      const paramsBoss = {
        target: fbxBoss,
		name: "boss",
        camera: this._camera,
      }
      this._controlsBoss = new BasicCharacterControls(paramsBoss);

	  const anim = new FBXLoader();
      anim.setPath('./models/');
      anim.load('DrunkIdle.fbx', (anim) => {
        let m = new THREE.AnimationMixer(fbxBoss);
        this._mixers.push(m);
        BossIdle = m.clipAction(anim.animations[0]);
		BossIdle.play();
	});
	const Walkanim = new FBXLoader();
	Walkanim.setPath('./models/');
	Walkanim.load('DrunkRunForward.fbx', (Walkanim) => {
		let RunAction = new THREE.AnimationMixer(fbxBoss);
		this._mixers.push(RunAction);
		BossRun = RunAction.clipAction(Walkanim.animations[0]);
	});
      	this._scene.add(fbxBoss);
    });
  }

  _LoadTheCatch() {
    const loader = new FBXLoader();
    loader.setPath('./models/');
    loader.load('Catch.fbx', (fbxCatch) => {
      fbxCatch.scale.setScalar(0.1);
      fbxCatch.traverse(c => {
        c.castShadow = true;
      });
	  const offset = new THREE.Vector3(22, -2.5, -140);
	  fbxCatch.position.copy(offset);
	  LeftId = fbxCatch.id;
      const paramsCatch = {
        target: fbxCatch,
		name: "chupa",
        camera: this._camera,
      }
      this._controlsCatch = new BasicCharacterControls(paramsCatch);

	  const anim = new FBXLoader();
      anim.setPath('./models/');
      anim.load('DwarfIdle.fbx', (anim) => {
        let m = new THREE.AnimationMixer(fbxCatch);
        this._mixers.push(m);
        MexicanIdle = m.clipAction(anim.animations[0]);
		MexicanIdle.play();
	});
	const Walkanim = new FBXLoader();
	Walkanim.setPath('./models/');
	Walkanim.load('Run.fbx', (Walkanim) => {
		let RunAction = new THREE.AnimationMixer(fbxCatch);
		this._mixers.push(RunAction);
		MexicanRun = RunAction.clipAction(Walkanim.animations[0]);
	});
      	this._scene.add(fbxCatch);
    });
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF();

      this._threejs.render(this._scene, this._camera);
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  _Step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    if (this._mixers) {
      this._mixers.map(m => m.update(timeElapsedS));
    }

    if (this._controlsBoss) {
		this._controlsBoss.Update(timeElapsedS);
	}    
	if (this._controlsCatch) {
		this._controlsCatch.Update(timeElapsedS);
	}
  }
}


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new LoadModelDemo();
});