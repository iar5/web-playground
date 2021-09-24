import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import DatThreeGui from "../../../libmy/DatThreeGui"
import { resize } from '../../../libmy/utils/three'
import * as Stats from 'stats-js';
import RefractionSphere from './RefractionSphere'
import LavaSphere from "./LavaSphere"
import MirrorModel from './MirrorModel';
import Ocean from './Ocean';


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



const refractionSphere = new RefractionSphere(new THREE.SphereGeometry(3, 64, 32))
refractionSphere.position.set(7, 5, -3);

const lavaSphere = new LavaSphere(new THREE.SphereGeometry(3, 32, 64))
lavaSphere.position.set(-7, 5, 0)

const mirrorModel = new MirrorModel()
mirrorModel.position.set(0, 5, 0)

const water = new Ocean()

scene.add(refractionSphere, lavaSphere, mirrorModel, water)


setInterval(() => {
    refractionSphere.renderEnvMap()
    mirrorModel.renderEnvMap()
    resize(renderer, camera)

}, 2000)


import "./sky"
import "./terrain"


window.addEventListener('resize', () => { resize(renderer, camera) }, false);

requestAnimationFrame(loop)

function loop() {
    requestAnimationFrame(loop)
    stats.begin();

    controls.update();

    lavaSphere.update()
    mirrorModel.update()
    water.update()
    
    //composer.render(clock.getDelta());
    renderer.render(scene, camera)
    stats.end();
}

export { scene, gui, renderer, camera }
