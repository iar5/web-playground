import * as THREE from "three"
import { AmbientLight, Clock, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'
import { resize } from '../../../libmy/utils/three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'



const renderer = new WebGLRenderer({ antialias: true })
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)

// scene
let scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

// camera
const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.001, 10000)
camera.position.z = -3
camera.position.y = 3
camera.lookAt(new Vector3())
scene.add(camera)
window.addEventListener('resize', () => { resize(renderer, camera) }, false);

// controls
const controls = new OrbitControls(camera, renderer.domElement);

// ground
const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(10, 10), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

// ambient light
const ambientLight = new AmbientLight(0x404040, 1);
scene.add(ambientLight);



requestAnimationFrame(update)

function update() {
    requestAnimationFrame(update)

    renderer.render(scene, camera)
}




