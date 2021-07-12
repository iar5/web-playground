import * as THREE from "three"
import { AmbientLight, Clock, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'
import { resize } from '../../../libmy/utils/three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import Player from "./Player"



const renderer = new WebGLRenderer({ antialias: true })
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

// ambient light
const ambientLight = new AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// camera
const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.001, 10000)
camera.position.z = -3
camera.position.y = 3
camera.lookAt(new Vector3())
scene.add(camera)
window.addEventListener('resize', () => { resize(renderer, camera) }, false);

const clock = new Clock()


// Ground
const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(10, 10), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

// Grid
const grid = new THREE.GridHelper(10, 10, 0x000000, 0x000000);
// @ts-ignore 
grid.material.opacity = 0.2;
// @ts-ignore 
grid.material.transparent = true;
scene.add(grid);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);




// const player = new Player(camera, renderer.domElement, scene)
// window["player"] = player


requestAnimationFrame(update)
function update() {
    requestAnimationFrame(update)
    // player.update(clock.getDelta())
    renderer.render(scene, camera)
}




