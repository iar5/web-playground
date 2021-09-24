import { DoubleSide, Object3D, Vector3 } from "three"
import THREE = require("three")
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { camera, gui, renderer, scene } from "./main"


export default class MirrorModel extends Object3D{

    private cubeCamera: THREE.CubeCamera

    constructor(){
        super()

        new GLTFLoader().load('/mymodels/procgarden.gltf', (gltf) => {
            let model = gltf.scene.children[0]
            model.castShadow = true
            model.receiveShadow = true
            model.scale.set(3, 3, 3)

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
            //@ts-ignore
            model.material = material
            gui.addMaterial(material)
            this.add(model)
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
        this.cubeCamera = new THREE.CubeCamera(0.0001, 10000, cubeRenderTarget);
    }


    renderEnvMap() {
        // camera springt (warum auch immer) beim rendern, deswegen alte position merken und später zurück setzen
        // in Refraction Kugel das selbe problem 
        // als ich beispiel kopiert hatte war das aber noch nicht so! 
        const cameraPos = camera.position.clone()
        this.visible = false
        this.cubeCamera.position.copy(this.position)
        this.cubeCamera.update(renderer, scene);
        this.visible = true
        camera.position.copy(cameraPos)
    }

    update() {
       this.rotation.y += 0.002
    }
}

