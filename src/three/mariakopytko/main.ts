import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import DatThreeGui from "../../../libmy/DatThreeGui"
import { resize } from '../../../libmy/utils/three'
import * as Stats from 'stats-js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AmbientLight, Fog, PointLight, RectAreaLight, SpotLight } from 'three';
import ThreeDatGui from "../../../libmy/DatThreeGui.js"
import FancyMaterial from './FancyMaterial';
import { LightFlickerAnimation } from "@ravespaceclub/space-engine"



const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    antialias: true,
})
document.body.appendChild(renderer.domElement)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setAnimationLoop(loop)

const scene = new THREE.Scene()
scene.fog = new Fog(0x000000, 10, 30)
const gui = new ThreeDatGui()

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.001, 1000)
camera.position.y = 2
camera.position.z = -4

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2
controls.minPolarAngle = 0
controls.maxDistance = 10
controls.minDistance = 1
controls.zoomSpeed = 0.2
controls.panSpeed = 0.2
controls.rotateSpeed = 0.2
controls.target.y += 0.5
controls.enablePan = false

window.addEventListener('resize', () => { resize(renderer, camera) }, false);
window.addEventListener('DOMContentLoaded', () => { resize(renderer, camera) })


const updates = []

const alight = new AmbientLight()
scene.add(alight)
gui.addLight(alight)


// const plight1 = new PointLight(0xffffff, 2, 10, 0.1)
// plight1.position.set(-6, 1, 5)
// scene.add(plight1)
// gui.addLight(plight1)
// const plight1flicker = new LightFlickerAnimation(plight1, 1)
// updates.push(plight1flicker)


// const plight2 = new PointLight(0xffffff, 2, 10, 0.1)
// plight2.position.set(6, .4, 6)
// scene.add(plight2)
// gui.addLight(plight2)
// const plight2flicker = new LightFlickerAnimation(plight2, 2)
// plight2flicker.secondsToChange = 10/60
// updates.push(plight2flicker)


const plightMid = new PointLight(0xffffff, 2, 10, 0.1)
plightMid.position.set(1, .4, 6)
scene.add(plightMid)
gui.addLight(plightMid)
const plightMidFlicker = new LightFlickerAnimation(plightMid, 2)
plightMidFlicker.secondsToChange = 10/60
updates.push(plightMidFlicker)



const rectlight1 = new RectAreaLight(0xffaaaa, 10, 5, 2)
rectlight1.position.set(6, 0, 0)
rectlight1.rotateY(Math.PI/2)
rectlight1.rotateX(-0.5)
scene.add(rectlight1)
gui.addLight(rectlight1)
const rectlight1flick = new LightFlickerAnimation(rectlight1, 1)
rectlight1flick.secondsToChange = 20/60
updates.push(rectlight1flick)


const rectlight2 = new RectAreaLight(0xffaaaa, 10, 5, 2)
rectlight2.position.set(-6, 0, 1)
rectlight2.rotateY(-Math.PI/2)
rectlight2.rotateX(-0.4)
scene.add(rectlight2)
gui.addLight(rectlight2)
const rectlight2flick = new LightFlickerAnimation(rectlight2, 1)
rectlight2flick.secondsToChange = 20/60
updates.push(rectlight2flick)


const redPointLight = new PointLight(0xff0000, 1, 10, 0.1)
redPointLight.position.set(0, 1.5, 0)
scene.add(redPointLight)
gui.addLight(redPointLight)

const redSpotLight = new SpotLight(0xff0000, 4, 20, 10 )
redSpotLight.position.set(0, 1.5, 0)
scene.add(redSpotLight)
gui.addLight(redSpotLight)


var shoes
const gltfLoader = new GLTFLoader()
gltfLoader.load("/mymodels/mariakopytko.glb", (gltf) => {       
    shoes = gltf.scene.getObjectByName("Shoes")
    scene.add(gltf.scene)
})



function loop() {
    const now = performance.now()
    controls.update();

    if(shoes) {
        shoes.rotation.y -= 0.0007
        shoes.position.y += Math.sin(now/9000)/10000
    }

    mat.uniforms.positionOffset.value.y += 0.1
    mat.uniforms.time.value = now

    updates.forEach((u)=>{
        u.update(now)
    })

    renderer.render(scene, camera)
}


const mat = new FancyMaterial()
mat.side = THREE.DoubleSide
const cylinder = new THREE.Mesh(new THREE.CylinderBufferGeometry(1.5, 1.5, 2, 36, 36, false), mat)
cylinder.translateY(1)
scene.add(cylinder)

