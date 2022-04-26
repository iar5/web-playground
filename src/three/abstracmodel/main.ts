import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import ThreeDatGui from "../../../libmy/DatThreeGui.js"
import { resize } from '../../../libmy/utils/three'
import Sky from "./2DSkyShader"
import { AmbientLight } from 'three';




const renderer = new THREE.WebGLRenderer({ antialias: true })
document.body.appendChild(renderer.domElement)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setAnimationLoop(gameloop);


const gui = new ThreeDatGui()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.001, 10000)
camera.position.z = 3
scene.add(camera)
const controls = new OrbitControls(camera, renderer.domElement)
controls.maxDistance = 10
controls.update()

window.addEventListener("DOMContentLoaded", () => { resize(renderer, camera)} );
window.addEventListener('resize', () => { resize(renderer, camera)} );


const sky = new Sky()
scene.add(sky)


const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(360, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
// cubeRenderTarget.texture.type = THREE.HalfFloatType;

const cubeCamera = new THREE.CubeCamera(0.0001, 10000, cubeRenderTarget); 


var model 
const gltfloader = new GLTFLoader();
gltfloader.load('/mymodels/procgarden.gltf', function(gltf){
    model = gltf.scene.children[0]
    scene.add(model);

    const material = new THREE.MeshStandardMaterial( {
        envMap: cubeRenderTarget.texture,
        roughness: 0.05,
        metalness: 1
    } );
    model.material = material

    // const material = new THREE.MeshPhysicalMaterial();
    // material.transparent = true 
    // material.envMap = cubeRenderTarget.texture;
    // material.roughness = 0
    // material.metalness = 1
    // material.reflectivity = 0
    // material.side = THREE.DoubleSide
    // gui.addMaterial(material)
    // model.material = material

    // material.emissive.set(0x8c0909)
    // material.roughness = 0.6
    // material.metalness = 0.6
    // material.reflectivity = 0.5
    // material.clearcoat = 1
    // material.transmission = 0 // 0.5 erstmal null lassen um env relfection zu debuggen
    // material.ior = 1.5

    // material.needsUpdate = true
    // console.log(material);

    // TODO bug die env map hat gar kein image?
    
})




// const renderPass = new RenderPass( scene, camera );

// const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
// bloomPass.threshold = 0.2
// bloomPass.strength = 0.5
// bloomPass.radius = 0.2

// const bokehPass = new BokehPass(scene, camera, {
//     focus: 1,
//     aperture: 0.0000025,
//     maxblur: 0.01,
//     width: width,
//     height: height
// });

// const composer = new EffectComposer( renderer );
// composer.addPass(renderPass);
// composer.addPass(bloomPass);
// composer.addPass(bokehPass);

// let f = gui.datgui.addFolder("Bloom")
// f.add(bloomPass, "threshold", 0, 1, 0.01)
// f.add(bloomPass, "strength", 0, 1, 0.01)
// f.add(bloomPass, "radius", 0, 1, 0.01)




function gameloop(time) {
    controls.update()
    
    if(sky.update){
        sky.update(time)
    }

    if(model) {
        model.visible = false
        cubeCamera.update(renderer, scene);
        console.log(cubeRenderTarget.texture);
        
        model.visible = true
    }

    let t = time / 1000
    camera.position.x = Math.sin(t / 8) * 3
    //camera.position.z = Math.cos(t/8)*4 * 10
    camera.position.y = Math.sin(t / 4)
    camera.lookAt(new THREE.Vector3())
    sky.rotation.y -= 0.01


    // bokehPass.uniforms.focus.value = camera.position.length()
    // composer.render();
    renderer.render(scene, camera)
}

