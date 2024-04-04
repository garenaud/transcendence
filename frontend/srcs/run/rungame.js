import * as THREE from 'three';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

var BossAnimation = [];
var MexicanAnimation = [];
let bossLoad = false;
let mexicanLoad = false;
let LeftId;
let RightId;
let KeypressLeft = 0.1;
let finished = false;
let KeypressRight = 0.1;

var startNum;
var currentNum;

function addClassDelayed(jqObj, c, to) {    
    setTimeout(function() { jqObj.addClass(c); }, to);
}

function anim() {
  if (bossLoad == true && mexicanLoad == true && currentNum >= 0) {
    addClassDelayed($("#countdown"), "puffer", 600);
    currentNum--;
    console.log(currentNum);
    if (currentNum > 0 ){
      $('#countdown').html(currentNum);
    } else if (currentNum == 0) {
      $('#countdown').html("GO !");
    } else {
      $('#countdown').html("");
      $('#countdown').removeClass("puffer");
      return ; 
    }
    $('#countdown').removeClass("puffer");
  } else {
    return ;
  }
}
      
$(function() {
  startNum = 6; 
  currentNum = startNum;
  if (currentNum >= 0) {
    setTimeout(1500);
    self.setInterval(function(){anim()},1325);
  }
});

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
	if (!finished && currentNum < 0) {
	  switch (event.keyCode) {
		  case 87: // w
		  this._move.forward = true;
		  if (MexicanAnimation.Run) MexicanAnimation.Run.play();
		  if (MexicanAnimation.Idle) MexicanAnimation.Idle.stop();
		  break;
		  case 38: // up
		  this._move.Bossforward = true;
		  if (BossAnimation.Run) BossAnimation.Run.play();
		  if (BossAnimation.Idle) BossAnimation.Idle.stop();
		  break ;
		  case 40: // down
		  this._move.Bossbackward = true;
		  break ;
		  
		}
	}
}
	
	_onKeyUp(event) {
	if (!finished && currentNum < 0) {
		switch(event.keyCode) {
		case 87: // w
		this._move.forward = false;
		if (MexicanAnimation.Idle) MexicanAnimation.Idle.play();
		if (MexicanAnimation.Run) MexicanAnimation.Run.stop();
		KeypressLeft += 0.1;
		break ;
		case 83: // s
		KeypressLeft += 0.1;
		break ;
		case 38: // up
		this._move.Bossforward = false;
		if (BossAnimation.Idle) BossAnimation.Idle.play();
		if (BossAnimation.Run) BossAnimation.Run.stop();
		KeypressRight += 0.1;
		break ;
		case 40: // down
		KeypressRight += 0.1;
		break ;
    	}
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
    if (this.id === LeftId && this._move.forward && controlObject.position.z < 500) {
        velocity.z += this._acceleration.z * timeInSeconds + KeypressLeft;
    }    
	if (this.id === RightId && this._move.Bossforward && controlObject.position.z < 500) {
        velocity.z += this._acceleration.z * timeInSeconds + KeypressRight;
    }
    if (controlObject.position.z >= 500 && this.id === LeftId && finished === false) {
        // Arrêter toutes les animations en cours
        if (BossAnimation.Idle) BossAnimation.Idle.stop();
        if (MexicanAnimation.Idle) MexicanAnimation.Idle.stop();
        if (BossAnimation.Run) BossAnimation.Run.stop();
        if (MexicanAnimation.Run) MexicanAnimation.Run.stop();

        // Jouer une animation de victoire
        if (MexicanAnimation.Win) MexicanAnimation.Win.play();
		if (BossAnimation.Loose) BossAnimation.Loose.play();
		  finished = true;
    console.log("Left (win) > " + Math.round((KeypressLeft / 2) / 0.1));
    console.log("Right > " + Math.round((KeypressRight / 2) / 0.1));
    }

	if (controlObject.position.z >= 500 && this.id === RightId && finished === false) {
    // Arrêter toutes les animations en cours
    if (BossAnimation.Idle) BossAnimation.Idle.stop();
    if (MexicanAnimation.Idle) MexicanAnimation.Idle.stop();
    if (BossAnimation.Run) BossAnimation.Run.stop();
    if (MexicanAnimation.Run) MexicanAnimation.Run.stop();

    // Jouer une animation de victoire
    if (BossAnimation.Win) BossAnimation.Win.play();
		if (MexicanAnimation.Loose) MexicanAnimation.Loose.play();
		  finished = true;
      console.log("Right (win) > " + Math.round((KeypressRight / 2) / 0.1));
      console.log("Left > " + Math.round((KeypressLeft / 2) / 0.1));
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

    // const controls = new OrbitControls(
    //   this._camera, this._threejs.domElement);
	// controls.minDistance = 10;
	// controls.maxDistance = 244;
    // controls.target.set(0, 20, 0);
    // controls.update();

    const loader = new THREE.CubeTextureLoader();
    const backgroundtexture = loader.load([
        './skybox/posx.jpg',
        './skybox/negx.jpg',
        './skybox/posy.jpg',
        './skybox/negy.jpg',
        './skybox/posz.jpg',
        './skybox/negz.jpg',
    ]);
    this._scene.background = backgroundtexture;

	

	const textureLoader = new THREE.TextureLoader();
	textureLoader.load( './skybox/Field.png', (texture) => {
		const material = new THREE.MeshStandardMaterial({ map: texture, });
		const plane = new THREE.Mesh( new THREE.PlaneGeometry(100, 1500, 10), material);
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
        const offset = new THREE.Vector3(-17, -1.8, -740);
        fbxBoss.position.copy(offset);
        RightId = fbxBoss.id;
        const paramsBoss = {
            target: fbxBoss,
            name: "boss",
            camera: this._camera,
        }
        this._controlsBoss = new BasicCharacterControls(paramsBoss);

        const animationsLoader = new FBXLoader();
        animationsLoader.setPath('./models/');

        // Charger toutes les animations nécessaires dans une variable
        animationsLoader.load('DrunkIdle.fbx', (animations) => {
            let mixer = new THREE.AnimationMixer(fbxBoss);
            this._mixers.push(mixer);
            BossAnimation = {
                Idle: mixer.clipAction(animations.animations[0]),
                Run: null,
                Win: null,
                Loose: null
            };
            BossAnimation.Idle.play();
            bossLoad = true;
        });

        animationsLoader.load('DrunkRunForward.fbx', (animations) => {
            let mixer = new THREE.AnimationMixer(fbxBoss);
            this._mixers.push(mixer);
            BossAnimation.Run = mixer.clipAction(animations.animations[0]);
        });

        animationsLoader.load('Twerk.fbx', (animations) => {
            let mixer = new THREE.AnimationMixer(fbxBoss);
            this._mixers.push(mixer);
            BossAnimation.Win = mixer.clipAction(animations.animations[0]);
        });

        animationsLoader.load('LooseBoss.fbx', (animations) => {
            let mixer = new THREE.AnimationMixer(fbxBoss);
            this._mixers.push(mixer);
            BossAnimation.Loose = mixer.clipAction(animations.animations[0]);
            BossAnimation.Loose.setLoop(THREE.LoopOnce);
            BossAnimation.Loose.timeScale = 1;
            BossAnimation.Loose.loop = THREE.LoopOnce;
            BossAnimation.Loose.clampWhenFinished = true;
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
	  const offset = new THREE.Vector3(22, -2.5, -740);
	  fbxCatch.position.copy(offset);
	  LeftId = fbxCatch.id;
      const paramsCatch = {
        target: fbxCatch,
		name: "chupa",
        camera: this._camera,
      }
    this._controlsCatch = new BasicCharacterControls(paramsCatch);
	const animationsLoader = new FBXLoader();
	animationsLoader.setPath('./models/');

	// Charger toutes les animations nécessaires dans une variable
	animationsLoader.load('DwarfIdle.fbx', (animations) => {
		let mixer = new THREE.AnimationMixer(fbxCatch);
		this._mixers.push(mixer);
		MexicanAnimation = {
			Idle: mixer.clipAction(animations.animations[0]),
			Run: null,
			Win: null,
			Loose: null
		};
		MexicanAnimation.Idle.play();
    mexicanLoad = true;
	});

	animationsLoader.load('Run.fbx', (animations) => {
		let mixer = new THREE.AnimationMixer(fbxCatch);
		this._mixers.push(mixer);
		MexicanAnimation.Run = mixer.clipAction(animations.animations[0]);
	});

	animationsLoader.load('Breakdance.fbx', (animations) => {
		let mixer = new THREE.AnimationMixer(fbxCatch);
		this._mixers.push(mixer);
		MexicanAnimation.Win = mixer.clipAction(animations.animations[0]);
	});

	animationsLoader.load('Failing.fbx', (animations) => {
		let mixer = new THREE.AnimationMixer(fbxCatch);
		this._mixers.push(mixer);
		MexicanAnimation.Loose = mixer.clipAction(animations.animations[0]);
		MexicanAnimation.Loose.setLoop(THREE.LoopOnce);
		MexicanAnimation.Loose.timeScale = 1;
		MexicanAnimation.Loose.loop = THREE.LoopOnce;
		MexicanAnimation.Loose.clampWhenFinished = true;
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
	let targetPosition = new THREE.Vector3();

	if (this._controlsCatch && this._controlsBoss) {
		// Calculer la moyenne des positions des deux personnages
		targetPosition.addVectors(this._controlsCatch._params.target.position, this._controlsBoss._params.target.position);
		targetPosition.divideScalar(2); // Diviser par 2 pour obtenir la moyenne
	} else if (this._controlsCatch) {
		targetPosition.copy(this._controlsCatch._params.target.position); // Utiliser la position du personnage de gauche
	} else if (this._controlsBoss) {
		targetPosition.copy(this._controlsBoss._params.target.position); // Utiliser la position du personnage de droite
	}

	// Définir l'offset de la caméra par rapport à la position moyenne des personnages
	const cameraOffset = new THREE.Vector3(0, 100, -200);

	// Calculer la nouvelle position de la caméra en ajoutant l'offset à la position cible moyenne des personnages
	const newCameraPosition = targetPosition.clone().add(cameraOffset);

	// Définir la position et l'orientation de la caméra
	this._camera.position.copy(newCameraPosition);
	this._camera.lookAt(targetPosition);
  }
}


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new LoadModelDemo();
});