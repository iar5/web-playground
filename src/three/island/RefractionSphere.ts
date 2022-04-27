import * as THREE from "three"
import { camera, renderer, scene } from "./main";
import { Mesh, Object3D, SphereGeometry, Vector3 } from "three";
import { FresnelShader } from "./FresnelShader";


// https://threejs.org/examples/webgl_materials_shaders_fresnel.html
// https://stemkoski.github.io/Three.js/Bubble.html


const tempVec3 = new Vector3()

export default class RefractionSphere extends Mesh{

    private cubeCamera

    constructor(sphereGeometry: SphereGeometry){

        const renderTarget = new THREE.WebGLCubeRenderTarget(128, {
            format: THREE.RGBAFormat,
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
        const cameraPos = tempVec3.copy(camera.position)
        this.cubeCamera.position.copy(this.position)
        this.cubeCamera.update(renderer, scene);
        camera.position.copy(cameraPos)
    }
}



