import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import DatThreeGui from "../../../libmy/DatThreeGui"
import { resize } from '../../../libmy/utils.js'
import NoiseFog from "../noisefog/NoiseFog"
import NoiseFog2 from '../noisefog/NoiseFog2';




const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    //antialias: true,
})
document.body.appendChild(renderer.domElement)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap


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




import "./sky"
import "./terrain"
import { initWater, updateWater } from './water';
import { updateModel } from './model';
//import { composer } from './postprocessing'
//const fog = new NoiseFog(scene, new THREE.FogExp2(0x444444, 0.005))


initWater()



requestAnimationFrame(loop)
function loop() {
    requestAnimationFrame(loop)
    controls.update();

    //fog.update()
    updateModel()
    updateWater()
        
    //composer.render(0.1);
    renderer.render(scene, camera)
}

export { scene, gui, renderer, camera }
