import { BufferGeometry, DoubleSide, MathUtils, Mesh, MeshNormalMaterial, MeshStandardMaterial, Object3D, PlaneBufferGeometry } from "three";
import { doubleArray } from "../../../libmy/utils/js"
import * as THREE from "three"
import { camera, renderer, scene } from "./main";
import { FresnelShader } from 'three/examples/jsm/shaders/FresnelShader.js';



/*
const renderTarget = new THREE.WebGLCubeRenderTarget(128, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
});
const cubeCamera = new THREE.CubeCamera(0.0001, 10000, renderTarget);
scene.add(cubeCamera)


var fShader = FresnelShader
const uniforms = THREE.UniformsUtils.clone(fShader.uniforms);
uniforms["tCube"].value = renderTarget.texture;

const customMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: fShader.vertexShader,
    fragmentShader: fShader.fragmentShader
});


function renderEnvMap() {
    const cameraPos = camera.position.clone()
    cubeCamera.position.copy(sphere.position)
    cubeCamera.update(renderer, scene);
    camera.position.copy(cameraPos)
}*/




export default class Water extends Object3D{

    private readonly H = 0.2 // column width
    private readonly C = 0.6 // wave travel speed <h/t
    private readonly T = 0.1 // timestep <h/c
    private readonly SLOWDOWN = 0.995



    private geometry: PlaneBufferGeometry
    private positionAttribute: Array<number>
    private normalAttribute: Array<number>

    private vertX
    private vertZ

    private u
    private v
    private unewtemp


    constructor(widthX: number, widthZ: number, resolution: number){
        super()
  
        this.vertX = Math.round(widthX * resolution)
        this.vertZ = Math.round(widthZ * resolution)

        this.geometry = new PlaneBufferGeometry(widthX, widthZ, this.vertX-1, this.vertZ-1)
        this.geometry.rotateX(MathUtils.degToRad(-90))
        this.translateY(2)

        // @ts-ignore
        this.positionAttribute = this.geometry.attributes.position.array 
        // @ts-ignore
        this.normalAttribute = this.geometry.attributes.normal.array

        // 2 in jeder dimesion mehr damit am rand alles 0 konstant bleibt
        this.u = doubleArray(this.vertX+2, this.vertZ+2, 0)
        this.unewtemp = doubleArray(this.vertX+2, this.vertZ+2, 0)
        this.v = doubleArray(this.vertX+2, this.vertZ+2, 0)

        // let material = new MeshNormalMaterial({ side: DoubleSide, wireframe: true})
        let material = new MeshStandardMaterial()
        let mesh = new Mesh(this.geometry, material)
        this.add(mesh)

    }

    update(){        
        this.updateHeightfield()
        this.applyHeightfieldToVertices()
    }

    updateHeightfield(){
        for (let i = 1; i < this.u.length - 1; i++) {
            for (let j = 1; j < this.u[0].length - 1; j++) {
                let f = this.C * this.C * (this.u[i + 1][j] + this.u[i - 1][j] + this.u[i][j + 1] + this.u[i][j - 1] - 4 * this.u[i][j]) / (this.H * this.H)
                this.v[i][j] += this.T * f
                this.v[i][j] *= this.SLOWDOWN
                this.unewtemp[i][j] = this.u[i][j] + this.T * this.v[i][j]
            }
        }

        /* if (collideWithInvisibleSphere) {
            for (let i = 0; i < this.u.length; i++) {
                for (let j = 0; j < this.u[0].length; j++) {
                    let x = i - vCountX / 2 + 40
                    let z = j - vCountZ / 2
                    let r = Math.max(vCountX, vCountZ) * 0.3
                    if (x * x + z * z < r * r) {
                        this.v[i][j] = 0
                        this.utemp[i][j] = 0
                    }
                }
            }
        } */

        // swap u buffer
        let unew = this.unewtemp
        this.unewtemp = this.u
        this.u = unew
    }

    applyHeightfieldToVertices(){
        for (let i=0; i < this.vertX; i++) {
            for (let j=0; j < this.vertZ; j++) {                              
                this.setVerticeY(i, j, this.u[i][j])
            }
        }

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.normal.needsUpdate = true;
        this.geometry.computeVertexNormals()
        this.geometry.computeBoundingBox();
        this.geometry.computeBoundingSphere();
    }

    getVerticeY(x: number, y: number): number {
        return this.positionAttribute[(x * this.vertX + y) * 3 + 1]
    }

    setVerticeY(x: number, y: number, value: number): void {        
        this.positionAttribute[(x * this.vertX + y) * 3 + 1] = value
    }


    /**
     * 
     * @param x [0; 1]
     * @param y [0; 1]
     * @param intensity 
     */
    drop(x: number, z: number, intensity: number): void {
        if (x < 0 || z < 0 || x > 1 || z > 1) return;

        x = Math.round(this.vertX * x)
        z = Math.round(this.vertZ * z)

        this.u[x][z] = intensity
    }
}

