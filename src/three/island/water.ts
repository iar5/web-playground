	
import * as THREE from "three"
import { Mesh, MeshBasicMaterial, MeshPhongMaterial, Vector3 } from "three";
import { Water } from 'three/examples/jsm/objects/Water.js';
import { camera, gui, scene } from "./main";


// https://threejs.org/examples/webgl_shaders_ocean.html

var water 

function initWater(){
    water = new Water(new THREE.CircleGeometry(10000), {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(("/textures/waternormals.jpg"), (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        sunDirection: new THREE.Vector3(100, 100, 100).normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 2,
        fog: scene.fog !== undefined,
        eye: camera.position
    });


    water.position.y -= 6
    water.rotation.x = - Math.PI / 2;
    scene.add(water);

    /* @ts-ignore */
    const waterUniforms = water.material.uniforms;
    const folderWater = gui.datgui.addFolder('Water');
    folderWater.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('distortionScale');
    folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size');




    /* 
    braucht water sonst ultra laggy
    warum? ist doch eig nur nen mirror. kann man doch bestimmt besser schereiben
    */
    /*const oldBefore = water.onBeforeRender
    water.onBeforeRender = (_renderer, _scene, _camera) => {
        renderer.toneMapping = THREE.NoToneMapping
        renderer.outputEncoding = THREE.LinearEncoding
        oldBefore(_renderer, _scene, _camera)
    }//

    /*const oldAfter = water.onAfterRender
    water.onAfterRender = (_renderer, _scene, _camera) => {
        renderer.toneMapping = 4
        renderer.outputEncoding = 3001
        oldAfter(_renderer, _scene, _camera)
    }*/
}


function updateWater() {
    /* @ts-ignore */
    water.material.uniforms['time'].value += 1.0 / 60.0;
    //water.material.uniforms['sunDirection'].value.copy(sun).normalize();
}


export { updateWater, initWater }