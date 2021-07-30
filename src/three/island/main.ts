import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import DatThreeGui from "../../../libmy/DatThreeGui"
import { resize } from '../../../libmy/utils/three'
import * as Stats from 'stats-js';


const clock = new THREE.Clock()

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    //antialias: true,
})
document.body.appendChild(renderer.domElement)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap


const stats = new Stats();
document.body.appendChild(stats.dom);
stats.dom.style.right = "0"
stats.dom.style.left = ""

const gui: DatThreeGui = new DatThreeGui()
const scene: THREE.Scene = new THREE.Scene()

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.001, 1000)
camera.position.y = 5
camera.position.z = -10
scene.add(camera)

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.y = 5
controls.maxPolarAngle = Math.PI / 2
controls.maxDistance = 100
window.addEventListener('resize', () => { resize(renderer, camera) }, false);
window.dispatchEvent(new Event('resize'))



import "./RefractionSphere"
import "./sky"
import "./terrain"
import { updateSun } from "./Lavaball"
import { initWater, updateWater } from './water';
import { updateModel } from './model';


initWater()



requestAnimationFrame(loop)
function loop() {
    requestAnimationFrame(loop)
    stats.begin();

    controls.update();

    updateModel()
    updateWater()
    updateSun()
    
    //composer.render(clock.getDelta());
    renderer.render(scene, camera)
    stats.end();
}

export { scene, gui, renderer, camera }
