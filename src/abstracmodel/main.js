import * as THREE from '../../lib/three/build/three.module.js'
import { OrbitControls } from '../../lib/three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from '../../lib/three/examples/jsm/loaders/GLTFLoader.js'
import ThreeDatGui from "../../libmy/ThreeDatGui.js"
import { resize } from '../../libmy/utils.js'
import Skydome from "./js/SkyShader.js"



const gui = new ThreeDatGui()

const gltfloader = new GLTFLoader();

let renderer = new THREE.WebGLRenderer({ antialias: true })
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true

let camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.001, 10000)
camera.position.z = 3

let controls = new OrbitControls(camera, renderer.domElement)
controls.maxPolarAngle = THREE.MathUtils.degToRad(90)
controls.minDistance = 0.1
controls.maxDistance = 100
controls.target.set(0, 0.5, 0)
controls.update()

window.addEventListener('resize', () => {resize(renderer, camera)}, false );

let scene = new THREE.Scene()



let ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 1) 
scene.add(ambientLight)
gui.registerLight(ambientLight)


let spotLight = new THREE.SpotLight(0xffffff, 1)
spotLight.position.set(0.5, 3, 2)
spotLight.angle = THREE.MathUtils.degToRad(30)
spotLight.castShadow = true
spotLight.penumbra = 0.5
spotLight.distance = 10
spotLight.decay = 2
spotLight.shadow.camera.near = 0.1
spotLight.shadow.camera.far = 100 // performance
scene.add(spotLight)
gui.registerLight(spotLight)

let skydome = new Skydome()
scene.add(skydome)


const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );

const cubeCamera = new THREE.CubeCamera(0.0001, 10000, cubeRenderTarget); 
scene.add(cubeCamera);


let model 

gltfloader.load('./assets/procgarden.gltf', function(gltf){
    model = gltf.scene.children[0]
    model.position.y = 0.4
    scene.add(model);


    let material = new THREE.MeshPhysicalMaterial();
    material.transparent = true // damit transmission klappt
    material.envMap = cubeCamera.renderTarget.texture;

    model.material = material
    gui.registerMaterial(material)
})





requestAnimationFrame(update)

function update() {
    requestAnimationFrame(update)
    controls.update()
    if(skydome.update) skydome.update()

    if(model) model.visible = false
    cubeCamera.update(renderer, scene);
    if(model) model.visible = true

    renderer.render(scene, camera)    
}

