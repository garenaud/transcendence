import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// import {LoadGLTFByPath} from './ModelHelper.js'

const scenePath = '/static/javascript//assets/scene.gltf'

export const LoadGLTFByPath = (scene) => {
    return new Promise((resolve, reject) => {
      // Create a loader
      const loader = new GLTFLoader();
  
      // Load the GLTF file
      loader.load(scenePath, (gltf) => {
        scene.add(gltf.scene);

        resolve();
      }, undefined, (error) => {
        reject(error);
      });
    });
};