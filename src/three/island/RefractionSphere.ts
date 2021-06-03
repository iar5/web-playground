import * as THREE from "three"
import { camera, renderer, scene } from "./main";
import { FresnelShader } from 'three/examples/jsm/shaders/FresnelShader.js';


// https://threejs.org/examples/webgl_materials_shaders_fresnel.html
// https://stemkoski.github.io/Three.js/Bubble.html

const renderTarget = new THREE.WebGLCubeRenderTarget(128, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
});
const cubeCamera = new THREE.CubeCamera(0.0001, 10000, renderTarget);
scene.add(cubeCamera) // TODO fehlt mir das hier bei model.ts ? ursache für den camera spring?


var fShader = FresnelShader
const uniforms = THREE.UniformsUtils.clone(fShader.uniforms);
uniforms["tCube"].value = renderTarget.texture;

const customMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: fShader.vertexShader,
    fragmentShader: fShader.fragmentShader
});

var sphereGeometry = new THREE.SphereGeometry(3, 64, 32);
var sphere = new THREE.Mesh(sphereGeometry, customMaterial);
sphere.position.set(7, 5, 0);
scene.add(sphere);




function renderEnvMap(){
    const cameraPos = camera.position.clone() 
    cubeCamera.position.copy(sphere.position)
    cubeCamera.update(renderer, scene);
    camera.position.copy(cameraPos)
}


setTimeout(renderEnvMap, 2000)



export { renderEnvMap as updateEnvMapR }