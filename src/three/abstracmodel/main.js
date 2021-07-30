import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';


import ThreeDatGui from "../../../libmy/DatThreeGui.js"
import { resize } from '../../../libmy//three'
import Sky from "./js/2DSkyShader"



const renderer = new THREE.WebGLRenderer({ antialias: true })
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true


const gui = new ThreeDatGui()

const scene = new THREE.Scene()

let height = 4
let width = height * window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.001, 10000)
camera.position.z = 5
scene.add(camera)


const controls = new OrbitControls(camera, renderer.domElement)
controls.maxDistance = 10
controls.update()

window.addEventListener('resize', () => {
    resize(renderer, camera)}
);



const sky = new Sky()
scene.add(sky)


var model 

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(360, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
const cubeCamera = new THREE.CubeCamera(0.0001, 10000, cubeRenderTarget); 
scene.add(cubeCamera);

const gltfloader = new GLTFLoader();
gltfloader.load('/mymodels/procgarden.gltf', function(gltf){
    model = gltf.scene.children[0]
    scene.add(model);

    let material = new THREE.MeshPhysicalMaterial();
    material.transparent = true // damit transmission möglich
    material.envMap = cubeCamera.renderTarget.texture;
    material.roughness = 0
    material.metalness = 1
    material.reflectivity = 0
    material.lightMap = cubeCamera.renderTarget.texture;
    material.side = THREE.DoubleSide
    model.material = material
    gui.addMaterial(material)
})




const renderPass = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = 0.2
bloomPass.strength = 0.5
bloomPass.radius = 0.2

const bokehPass = new BokehPass(scene, camera, {
    focus: 1,
    aperture: 0.0000025,
    maxblur: 0.01,
    width: width,
    height: height
});

const composer = new EffectComposer( renderer );
composer.addPass(renderPass);
composer.addPass(bloomPass);
composer.addPass(bokehPass);



let f = gui.datgui.addFolder("Bloom")
f.add(bloomPass, "threshold", 0, 1, 0.01)
f.add(bloomPass, "strength", 0, 1, 0.01)
f.add(bloomPass, "radius", 0, 1, 0.01)




requestAnimationFrame(update)

function update(time) {
    requestAnimationFrame(update)
    controls.update()
    
    if(sky.update) 
        sky.update(time)

    if(model) {
        model.visible = false
        cubeCamera.update(renderer, scene);
        model.visible = true
    }

    let t = time / 1000
    camera.position.x = Math.sin(t / 8) * 3
    //camera.position.z = Math.cos(t/8)*4 * 10
    camera.position.y = Math.sin(t / 4)
    camera.lookAt(new THREE.Vector3())
    sky.rotation.y -= 0.01


    bokehPass.uniforms.focus.value = camera.position.length()
    composer.render();
}

