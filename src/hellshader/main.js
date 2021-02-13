import * as THREE from '../../lib/three/build/three.module.js'
import { OrbitControls } from '../../lib/three/examples/jsm/controls/OrbitControls.js'
import { FlyControls } from '../../lib/three/examples/jsm/controls/FlyControls.js';
import { GLTFLoader } from '../../lib/three/examples/jsm/loaders/GLTFLoader.js'
import ThreeDatGui from "../../libmy/ThreeDatGui.js"
import { resize } from '../../libmy/utils.js'
import { isKeyHold } from '../../libmy/keyhold.js'
import Room from "./RoomShader.js"
import { EffectComposer } from '../../lib/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../lib/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../../lib/three/examples/jsm/postprocessing/UnrealBloomPass.js';



const gui = new ThreeDatGui()
const clock = new THREE.Clock()

const renderer = new THREE.WebGLRenderer({ antialias: true })
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.context.getExtension('OES_standard_derivatives');
gui.lightFolder.add(renderer, "physicallyCorrectLights")

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.001, 10000)
camera.position.z = -3
camera.lookAt(new THREE.Vector3)
scene.add(camera)
window.addEventListener('resize', () => { resize(renderer, camera) }, false);

const controls = new FlyControls(camera, renderer.domElement);
controls.movementSpeed = 2
controls.domElement = renderer.domElement;
controls.rollSpeed = Math.PI / 12;
controls.autoForward = false;
controls.dragToLook = false;

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0.2
bloomPass.strength = 0.5
bloomPass.radius = 0.2

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

let f = gui.datgui.addFolder("Bloom")
f.add(bloomPass, "threshold", 0, 1, 0.01)
f.add(bloomPass, "strength", 0, 1, 0.01)
f.add(bloomPass, "radius", 0, 1, 0.01)

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
const cubeCamera = new THREE.CubeCamera(0.0001, 10000, cubeRenderTarget);
scene.add(cubeCamera);



let room = new Room()
scene.add(room)





requestAnimationFrame(update)


function update(time) {
    requestAnimationFrame(update)
    
    if(room.update) room.update(time)

    if(model) model.visible = false
    cubeCamera.update(renderer, scene);
    if(model) model.visible = true

    //renderer.render(scene, camera) 
    composer.render();
   
    controls.update(clock.getDelta());
}

