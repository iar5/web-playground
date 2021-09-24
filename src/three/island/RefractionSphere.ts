import * as THREE from "three"
import { camera, renderer, scene } from "./main";
import { FresnelShader } from 'three/examples/jsm/shaders/FresnelShader.js';
import { Mesh, Object3D, SphereGeometry } from "three";


// https://threejs.org/examples/webgl_materials_shaders_fresnel.html
// https://stemkoski.github.io/Three.js/Bubble.html


export default class RefractionSphere extends Mesh{

    private cubeCamera

    constructor(sphereGeometry: SphereGeometry){

        const renderTarget = new THREE.WebGLCubeRenderTarget(128, {
            format: THREE.RGBFormat,
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter,
        });

        var fShader = FresnelShader
        const uniforms = THREE.UniformsUtils.clone(fShader.uniforms);
        uniforms["tCube"].value = renderTarget.texture;

        const customMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: fShader.vertexShader,
            fragmentShader: fShader.fragmentShader
        });

        super(sphereGeometry, customMaterial)
        this.cubeCamera = new THREE.CubeCamera(0.0001, 10000, renderTarget);
        this.add(this.cubeCamera) // TODO fehlt mir das hier bei model.ts ? ursache für den camera spring?
    }


    renderEnvMap() {
        const cameraPos = camera.position.clone()
        this.cubeCamera.position.copy(this.position)
        this.cubeCamera.update(renderer, scene);
        camera.position.copy(cameraPos)
    }
}



