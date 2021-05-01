import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import DatThreeGui from "../../../libmy/DatThreeGui.js"
import { resize } from '../../../libmy/utils.js'


const gui = new DatThreeGui()
const clock = new THREE.Clock()

const renderer = new THREE.WebGLRenderer({ antialias: true })
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.getContext().getExtension('OES_standard_derivatives');
renderer.physicallyCorrectLights = true



const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0xeee, 0.01)

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.001, 10000)
camera.position.y = 3
camera.position.z = -6
camera.lookAt(new THREE.Vector3)
scene.add(camera)

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.y = 1
controls.maxPolarAngle = Math.PI / 2



window.addEventListener('resize', () => { resize(renderer, camera) }, false);
window.dispatchEvent(new Event('resize'))

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






let ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.01) 
scene.add(ambientLight)
gui.registerLight(ambientLight)






let tgeo = new THREE.PlaneBufferGeometry(10, 10, 10, 10)
tgeo.rotateX(THREE.MathUtils.degToRad(-90))
let tmat = new THREE.MeshLambertMaterial({ 
    color: 'rgb(150, 255, 150)' ,
    side: THREE.DoubleSide
})
const terrain = new THREE.Mesh(tgeo, tmat)
terrain.receiveShadow = true

scene.add(terrain)



const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
const cubeCamera = new THREE.CubeCamera(0.0001, 10000, cubeRenderTarget); 
scene.add(cubeCamera);


let model 

const gltfloader = new GLTFLoader();
gltfloader.load('./procgarden.gltf', (gltf) => {
    model = gltf.scene.children[0]
    model.position.y = 1
    model.castShadow = true
    model.receiveShadow = true
    scene.add(model);

    let material = new THREE.MeshPhysicalMaterial({});
    material.transparent = true // damit transmission klappt
    material.envMap = cubeCamera.renderTarget.texture;
    material.roughness = 0
    material.reflectivity = 1
    model.material = material
    gui.registerMaterial(material)
})
requestAnimationFrame(update)


function update() {
    requestAnimationFrame(update)
    
    if(model) model.visible = false
    cubeCamera.update(renderer, scene);
    if(model) model.visible = true

    composer.render();
   
    controls.update();
}


export { scene, gui, renderer }

import "./skycontroler"