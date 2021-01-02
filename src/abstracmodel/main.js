import * as THREE from '../../lib/three/build/three.module.js'
import { OrbitControls } from '../../lib/three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from '../../lib/three/examples/jsm/loaders/GLTFLoader.js'
import ThreeDatGui from "../../libmy/ThreeDatGui.js"
import { resize } from '../../libmy/utils.js'
import Sky from "./js/TestShader.js"
import { EffectComposer } from '../../lib/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../lib/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../../lib/three/examples/jsm/postprocessing/UnrealBloomPass.js';



const gui = new ThreeDatGui()

let renderer = new THREE.WebGLRenderer({ antialias: true })
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.context.getExtension('OES_standard_derivatives');
gui.lightFolder.add(renderer, "physicallyCorrectLights")


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



let ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.01) 
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

let sky = new Sky()
scene.add(sky)


const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
const cubeCamera = new THREE.CubeCamera(0.0001, 10000, cubeRenderTarget); 
scene.add(cubeCamera);


let model 

const gltfloader = new GLTFLoader();
gltfloader.load('./assets/procgarden.gltf', function(gltf){
    model = gltf.scene.children[0]
    model.position.y = 0.4
    scene.add(model);


    let material = new THREE.MeshPhysicalMaterial();
    material.transparent = true // damit transmission klappt
    material.envMap = cubeCamera.renderTarget.texture;
    material.roughness = 0
    material.reflectivity = 1
    model.material = material
    gui.registerMaterial(material)
})

const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = 0.2
bloomPass.strength = 0.5
bloomPass.radius = 0.2

const composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );

let f = gui.datgui.addFolder("Bloom")
f.add(bloomPass, "threshold", 0, 1, 0.01)
f.add(bloomPass, "strength", 0, 1, 0.01)
f.add(bloomPass, "radius", 0, 1, 0.01)


requestAnimationFrame(update)

function update(time) {
    requestAnimationFrame(update)
    controls.update()
    
    if(sky.update) sky.update(time)

    if(model) model.visible = false
    cubeCamera.update(renderer, scene);
    if(model) model.visible = true

    //renderer.render(scene, camera) 
    composer.render();
   
}

