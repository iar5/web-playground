import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import ParticleSystem from "./ParticleSystem"


/**
 * alternativ https://three-nebula.org/
 */


const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  _OnWindowResize();
}, false);



const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(25, 10, 0);

const scene = new THREE.Scene();

const light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
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
scene.add(light);

const alight = new THREE.AmbientLight(0x101010);
scene.add(alight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  '/textures/particles/posx.jpg', // TODO die wird nicht geladen
  '/textures/particles/negx.jpg',
  '/textures/particles/posy.jpg',
  '/textures/particles/negy.jpg',
  '/textures/particles/posz.jpg',
  '/textures/particles/negz.jpg',
]);
scene.background = texture;

const _particles = new ParticleSystem({
  parent: scene,
  camera: camera,
});

_LoadModel();

var _previousRAF = null;
_RAF();


function _LoadModel() {
  const loader = new GLTFLoader();
  loader.load('/textures/particles/rocket/Rocket_Ship_01.gltf', (gltf) => {
    gltf.scene.traverse(c => {
      c.castShadow = true;
    });
    scene.add(gltf.scene);
  });
}

function _OnWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function _RAF() {
  requestAnimationFrame((t) => {
    if (_previousRAF === null) {
      _previousRAF = t;
    }
    _RAF();
    renderer.render(scene, camera);
    _Step(t - _previousRAF);
    _previousRAF = t;
  });
}

function _Step(timeElapsed) {
  const timeElapsedS = timeElapsed * 0.001;
  _particles.Step(timeElapsedS);
}



