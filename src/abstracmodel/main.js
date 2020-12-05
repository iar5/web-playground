import * as THREE from '../../lib/three/build/three.module.js'
import { OrbitControls } from '../../lib/three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from '../../lib/three/examples/jsm/loaders/GLTFLoader.js'
import ThreeDatGui from "../../libmy/ThreeDatGui.js"
import Skydome from "./js/SkyShader.js"



const gui = new ThreeDatGui()

const gltfloader = new GLTFLoader();

var renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
document.body.appendChild(renderer.domElement)

var camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.001, 10000)
camera.position.z = 3
camera.position.y = 1

var controls = new OrbitControls(camera, renderer.domElement)
controls.maxPolarAngle = THREE.MathUtils.degToRad(90)
controls.minDistance = 0.1
controls.maxDistance = 100
controls.target.set(0, 0.5, 0)
controls.update()

var scene = new THREE.Scene()

var ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.5) 
scene.add(ambientLight)
gui.registerLight(ambientLight)


var spotLight = new THREE.SpotLight(0xffffff, 1)
spotLight.position.set(0.5, 3, 2)
spotLight.angle = THREE.MathUtils.degToRad(30)
spotLight.castShadow = true
spotLight.penumbra = 0.5
spotLight.distance = 10
spotLight.decay = 2
spotLight.shadow.camera.near = 0.1
spotLight.shadow.camera.far = 100 // performance
scene.add(spotLight)
//scene.add(new THREE.CameraHelper(spotLight.shadow.camera))
gui.registerLight(spotLight)


let skydome = new Skydome()
scene.add(skydome)


gltfloader.load('./assets/procgarden.gltf', function(gltf){
    let mesh = gltf.scene.children[0]
    scene.add(mesh);

    var material = new THREE.MeshPhysicalMaterial();
    mesh.material = material
    gui.registerMaterial(material)
})



requestAnimationFrame(update)
function update() {
    requestAnimationFrame(update)
    controls.update()
    renderer.render(scene, camera)    
}

