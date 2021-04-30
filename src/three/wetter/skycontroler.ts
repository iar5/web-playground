import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { scene, gui, renderer } from "./main"

// https://threejs.org/examples/webgl_shaders_sky.html
// Add Sky


renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;


const sky = new Sky();
sky.scale.setScalar(450000);
scene.add(sky);


let dir = new THREE.DirectionalLight()
dir.castShadow = true
dir.shadow.camera
scene.add(dir)
//scene.add(new THREE.CameraHelper(dir.shadow.camera))

/// GUI

const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
};

gui.datgui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
gui.datgui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
gui.datgui.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged);
gui.datgui.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged);
gui.datgui.add(effectController, 'elevation', 0, 90, 0.1).onChange(guiChanged);
gui.datgui.add(effectController, 'azimuth', - 180, 180, 0.1).onChange(guiChanged);
gui.datgui.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged);

function guiChanged() {

    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = effectController.turbidity;
    uniforms['rayleigh'].value = effectController.rayleigh;
    uniforms['mieCoefficient'].value = effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);

    dir.position.setFromSphericalCoords(1, phi, theta);

    uniforms['sunPosition'].value.copy(dir.position);

    renderer.toneMappingExposure = effectController.exposure;
}

guiChanged();


effectController.turbidity = 20
effectController.rayleigh = 0
effectController.mieCoefficient = 0.004
effectController.mieDirectionalG = 0.995
effectController.elevation = 19.3
effectController.azimuth = 147
effectController.exposure = 0.0845
guiChanged();
