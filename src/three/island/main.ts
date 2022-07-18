import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import DatThreeGui from "../../../libmy/DatThreeGui"
import { resize } from '../../../libmy/utils/three'
import * as Stats from 'stats-js';
import RefractionSphere from './RefractionSphere'
import LavaSphere from "./LavaSphere"
import MirrorModel from './MirrorModel';
import Ocean from './Ocean';
import Terrain from './terrain';
import MySky from './sky';



const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    antialias: true,
})
document.body.appendChild(renderer.domElement)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.setAnimationLoop((perf) => { update(perf) })



const updates = []
const clock = new THREE.Clock()

const stats = new Stats();
document.body.appendChild(stats.dom);
stats.dom.style.right = "0"
stats.dom.style.left = ""

const gui = new DatThreeGui()
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.001, 1000)
camera.position.y = 5
camera.position.z = -10
scene.add(camera)

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.y = 5
controls.maxPolarAngle = Math.PI / 2
controls.maxDistance = 100
updates.push(controls)


// const refractionSphere = new RefractionSphere(new THREE.SphereGeometry(3, 32, 32))
// refractionSphere.position.set(7, 5, 0);
// scene.add(refractionSphere)
// updates.push(refractionSphere)

// const lavaSphere = new LavaSphere(new THREE.SphereGeometry(3, 64, 64))
// lavaSphere.position.set(-7, 5, 0)
// scene.add(lavaSphere)
// updates.push(lavaSphere)

// const mirrorModel = new MirrorModel()
// mirrorModel.position.set(0, 5, 14)
// scene.add(mirrorModel)
// updates.push(mirrorModel)

const water = new Ocean() // TODO wenn ocean da ist rendert mirror/refraction das terrain nicht
water.position.y -= 6
scene.add(water)
updates.push(water)

// const terrain = new Terrain()
// scene.add(terrain)

const sky = new MySky()
scene.add(sky)


window.addEventListener('resize', () => { resize(renderer, camera) }, false);
window.addEventListener('DOMContentLoaded', () => { resize(renderer, camera) })


function update(perf){
    stats.begin();

    for(let u of updates){
        if(u.update) u.update()
    }

    // refractionSphere.position.x += Math.sin(perf/1000)/100
    // refractionSphere.position.z += Math.cos(perf/1000)/100
    // refractionSphere.position.z += Math.sin(perf/1270)/100
    
    renderer.render(scene, camera)

    // refractionSphere.renderEnvMap() 
    // mirrorModel.renderEnvMap() 

    stats.end();
}



export { scene, gui, renderer, camera }
