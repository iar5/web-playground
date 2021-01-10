import * as THREE from '../../lib/three/build/three.module.js'
import { OrbitControls } from '../../lib/three/examples/jsm/controls/OrbitControls.js'
import ThreeDatGui from "../../libmy/ThreeDatGui.js"
import { resize } from '../../libmy/utils.js'


const gui = new ThreeDatGui()

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setClearColor(0xffffff, 0);
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.001, 10000)
camera.position.z = 3
window.addEventListener('resize', () => { resize(renderer, camera)}, false );

const controls = new OrbitControls(camera, renderer.domElement)
controls.maxPolarAngle = THREE.MathUtils.degToRad(90)
controls.minDistance = 0.1
controls.maxDistance = 100
controls.update()

const scene = new THREE.Scene()



let ambientLight = new THREE.AmbientLight(new THREE.Color(1,1,1), 0.1) 
scene.add(ambientLight)
gui.registerLight(ambientLight)


let light1 = createLight(new THREE.PointLight(0x4688c3, 1, 10), new THREE.Vector3(-1.5, 0.2, 0.25), "light1")
let light2 = createLight(new THREE.PointLight(0x73af7, 1, 10), new THREE.Vector3(-0.2, 0, 1), "light2")
let light3 = createLight(new THREE.PointLight(0xf0ff, 1, 10), new THREE.Vector3(2, 0, 0), "light3")

const rectLight = new THREE.RectAreaLight( 0x0044ff, 4, 8, 1);
rectLight.position.set(0, 2, 2);
rectLight.lookAt( 0, 0, 0 );
scene.add(rectLight)


let sphere1 = createSphere(new THREE.Vector3(1.5, 0.2, -1))
let sphere2 = createSphere(new THREE.Vector3(-1.2, 0, -0.5))
let sphere3 = createSphere(new THREE.Vector3(0.3, -0.2, 0))




requestAnimationFrame(update)

function update(time){
    requestAnimationFrame(update)
    controls.update()
    renderer.render(scene, camera) 
}


function createLight(light, pos, name){
    light.position.copy(pos)
    light.name = name
    scene.add(light);
    gui.registerLight(light)
    return light
}

function createSphere(pos){
    let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 64, 64), new THREE.MeshStandardMaterial({color: "white"}))
    sphere.position.copy(pos)
    scene.add(sphere)
    return sphere
}
