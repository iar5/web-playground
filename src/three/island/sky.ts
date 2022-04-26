import * as THREE from 'three'
import { Mesh, MeshPhongMaterial, Vector3 } from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { scene, gui, renderer, camera } from "./main"

// https://threejs.org/examples/webgl_shaders_sky.html
// https://threejs.org/examples/webgl_shaders_ocean.html


//renderer.physicallyCorrectLights = true
//renderer.outputEncoding = THREE.sRGBEncoding;
//renderer.toneMapping = THREE.ACESFilmicToneMapping;

// TODO sky based on aktuelle zeit

const ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.1)
scene.add(ambientLight)
gui.addLight(ambientLight)



const sky = new Sky();
sky.scale.setScalar(450000);
sky.material.fog = false
scene.add(sky); 

const sunPosition = new Vector3()

const dirLight = new THREE.DirectionalLight()
dirLight.castShadow = true
dirLight.position.copy(sunPosition)
//scene.add(dirLight)
//scene.add(new THREE.CameraHelper(dirLight.shadow.camera))

const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
};

function setSkyMoon() {
    effectController.turbidity = 20
    effectController.rayleigh = 0
    effectController.mieCoefficient = 0.004
    effectController.mieDirectionalG = 0.995
    effectController.elevation = 19.3
    effectController.azimuth = 147
    effectController.exposure = 1
}
function setSkySunny() {
    effectController.turbidity = 0
    effectController.rayleigh = 1.2
    effectController.mieCoefficient = 0.025
    effectController.mieDirectionalG = 0.9
    effectController.elevation = 6.4
    effectController.azimuth = 180
    effectController.exposure = 1
}



let f = gui.datgui.addFolder("Sky")
f.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiValuesChanged);
f.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiValuesChanged);
f.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiValuesChanged);
f.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiValuesChanged);
f.add(effectController, 'elevation', 0, 90, 0.1).onChange(guiValuesChanged);
f.add(effectController, 'azimuth', - 180, 180, 0.1).onChange(guiValuesChanged);
f.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiValuesChanged);

const pmremGenerator = new THREE.PMREMGenerator(renderer);

function guiValuesChanged() {    
    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = effectController.turbidity;
    uniforms['rayleigh'].value = effectController.rayleigh;
    uniforms['mieCoefficient'].value = effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;
    renderer.toneMappingExposure = effectController.exposure;

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);
    sunPosition.setFromSphericalCoords(1, phi, theta);
    uniforms['sunPosition'].value.copy(sunPosition);
    dirLight.position.copy(sunPosition)

    // @ts-ignore
    const env = pmremGenerator.fromScene(sky).texture;
    scene.environment = env
    scene.background = env
}

setSkySunny()
guiValuesChanged();
