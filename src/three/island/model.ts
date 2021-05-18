import { DoubleSide, Vector3 } from "three"
import THREE = require("three")
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { camera, gui, renderer, scene } from "./main"




var model
new GLTFLoader().load('/mymodels/procgarden.gltf', (gltf) => {
    model = gltf.scene.children[0]
    model.castShadow = true
    model.receiveShadow = true
    model.position.y = 5
    model.scale.set(3, 3, 3)
    scene.add(model);

    const material = new THREE.MeshPhysicalMaterial({
        transparent: true, // damit transmission klappt
        envMap: cubeRenderTarget.texture,
        roughness: 0,
        metalness: 1,
        reflectivity: 1,
        color: "white",
        clearcoat: 1,
        clearcoatRoughness: 0.3,
        name: "Abstract Model",
        side: DoubleSide
    });
    model.material = material
    gui.addMaterial(material)
})

/**
 * Problem in Verbindung mit dem Water
 * - nicht mit dem PREm Genereator! Der ist auskommentiert
 * - die muss gar nicht als envMap registriert sein
 * - problem tritt auf wenn update aufgerufen wird
 */

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, { 
    format: THREE.RGBFormat, 
    generateMipmaps: true, 
    minFilter: THREE.LinearMipmapLinearFilter,
});
const cubeCamera = new THREE.CubeCamera(0.0001, 10000, cubeRenderTarget);


function renderEnv(){
    // camera springt (warum auch immer) beim rendern, deswegen alte position merken und später zurück setzen
    // in Refraction Kugel das selbe problem 
    // als ich beispiel kopiert hatte war das aber noch nicht so! 
    if(!model) return
    const cameraPos = camera.position.clone() 
    model.visible = false 
    cubeCamera.position.copy(model.position)
    cubeCamera.update(renderer, scene);
    model.visible = true
    camera.position.copy(cameraPos)
}

setTimeout(renderEnv, 2000)

function updateModel(){
    if (model) model.rotation.y += 0.002
}


export { updateModel, renderEnv as updateEnvMap }