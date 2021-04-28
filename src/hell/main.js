import * as THREE from '../../lib/three/build/three.module.js'
import { Object3D } from '../../lib/three/build/three.module.js'
import { GLTFLoader } from '../../lib/three/examples/jsm/loaders/GLTFLoader.js'
import ThreeDatGui from "../../libmy/DatThreeGui.js"
import { resize } from '../../libmy/utils.js'
import { isKeyHold } from '../../libmy/keyhold.js'
import Room from "./Hell.js"
import Controls from './controls.js'


const gui = new ThreeDatGui()
const clock = new THREE.Clock()

const renderer = new THREE.WebGLRenderer({ antialias: true })
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.context.getExtension('OES_standard_derivatives');


const scene = new THREE.Scene()
//scene.fog = new THREE.FogExp2(0x00ff00, 0, 0.0005)
//scene.fog = new THREE.Fog(0xff0000, 5, 50)

const ambientLight = new THREE.AmbientLight(0x404040, 1); 
scene.add(ambientLight);



const player = new THREE.Object3D
scene.add(player)

const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.001, 10000)
camera.position.z = -3
camera.lookAt(new THREE.Vector3)
scene.add(camera)
window.addEventListener('resize', () => { resize(renderer, camera) }, false);
const controls = new Controls(camera, renderer.domElement)




const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
const cubeCamera = new THREE.CubeCamera(0.0001, 10000, cubeRenderTarget);
player.add(cubeCamera);



let room = new Room()
player.add(room)



let material = new THREE.MeshPhysicalMaterial({
    transparent: true, // damit transmission klappt
    envMap: cubeCamera.renderTarget.texture,
    color: "black",
    roughness: 0,
    metalness: 0,
    reflectivity: 0,
    clearcoat: 1
});

let model = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 32, 32), material)
gui.registerMaterial(material)
scene.add(model)




requestAnimationFrame(update)
function update() {
    requestAnimationFrame(update)
    
    //room.uniforms.time.value = time / 1000
    room.uniforms.positionOffset.value.copy(camera.position)
    room.position.copy(camera.position)

    if(model) model.visible = false
    cubeCamera.update(renderer, scene);
    if(model){
        model.visible = true
        model.material.opacity = 1-((model.position.distanceTo(camera.position)-20)/200)
    }

    renderer.render(scene, camera) 
   
    controls.update(clock.getDelta());
}

