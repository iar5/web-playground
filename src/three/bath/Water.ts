import { BoxBufferGeometry, BoxGeometry, BufferGeometry, DoubleSide, MathUtils, Mesh, MeshNormalMaterial, MeshStandardMaterial, Object3D, PlaneBufferGeometry } from "three";
import { doubleArray } from "../../../libmy/utils/js"
import * as THREE from "three"
import OpenBoxBufferGeometry from "./OpenBoxBufferGeometry";
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import { degToRad } from "../../../libmy/utils/math";
import { FresnelShader } from "../island/FresnelShader";


// https://29a.ch/slides/2012/webglwater/#slide-80
// https://github.com/mrdoob/three.js/blob/master/examples/jsm/objects/Reflector.js
// after the flood
// reflector + refractor?

const renderTarget = new THREE.WebGLCubeRenderTarget(128, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
});
const cubeCamera = new THREE.CubeCamera(0.0001, 10000, renderTarget);
// scene.add(cubeCamera)



export default class Water extends Object3D{

    private readonly H = 0.2 // column width
    private readonly C = 0.6 // wave travel speed <h/t
    private readonly T = 0.1 // timestep <h/c
    private readonly SLOWDOWN = 0.995

    private geometry: PlaneBufferGeometry
    private positionAttribute: ArrayLike<number>
    private normalAttribute: ArrayLike<number>

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

        this.positionAttribute = this.geometry.attributes.position.array 
        this.normalAttribute = this.geometry.attributes.normal.array

        // 2 in jeder dimesion mehr damit am rand alles 0 konstant bleibt
        this.u = doubleArray(this.vertX+2, this.vertZ+2, 0)
        this.unewtemp = doubleArray(this.vertX+2, this.vertZ+2, 0)
        this.v = doubleArray(this.vertX+2, this.vertZ+2, 0)

        // water body
        let bodyMat = new MeshStandardMaterial({
            transparent: true,
            opacity: 0.5,
            color: new THREE.Color(0x00aaee),
        })
        let bodyGeo = new OpenBoxBufferGeometry()
        bodyGeo.scale(widthX / 2, 1, widthZ / 2)
        let body = new Mesh(bodyGeo, bodyMat)
        body.translateY(1)
        this.add(body)
        console.log(body);


        // fresnel material 
        const uniforms = THREE.UniformsUtils.clone(FresnelShader.uniforms);
        uniforms["tCube"].value = renderTarget.texture;

        const fresnelMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: FresnelShader.vertexShader,
            fragmentShader: FresnelShader.fragmentShader,
        });

        let mesh = new Mesh(this.geometry, fresnelMaterial)
        mesh.translateY(2)
        this.add(mesh) 



        // reflector material 
        /*let mirrorplane = new THREE.PlaneBufferGeometry(widthX, widthZ)
        const mirror = new Reflector(mirrorplane, {
            clipBias: 0.01,
            textureWidth: 720,
            textureHeight: 720,
            color: new THREE.Color(0x777777),
        });
        mirror.rotateX(degToRad(-90))
        mirror.position.y = 3
        // this.add(mirror)
        console.log(mirror);

        let mesh = new Mesh(this.geometry, mirror.material)
        mesh.translateY(2)
        this.add(mesh) */
    }

    update(){        
        this.updateHeightfield()
        this.applyHeightfieldToVertices()
    }

    renderReflector(){

    }

    renderEnvMapUpdate(camera, renderer, scene) {
        // const cameraPos = camera.position.clone() // Spring Bug?
        cubeCamera.position.copy(this.position)
        cubeCamera.update(renderer, scene);
        // camera.position.copy(cameraPos)
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

        for (let i = 0; i < this.u.length; i++) {
            for (let j = 0; j < this.u[0].length; j++) {
                let x = i - this.vertX / 2
                let z = j - this.vertZ / 2
                let r = Math.max(this.vertX, this.vertZ) * 0.1
                if (x * x + z * z < r * r) {
                    this.v[i][j] = 0
                    this.unewtemp[i][j] = 0
                }
            }
        }
    

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
        // @ts-ignore     
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
        this.u[Math.round(this.vertX * x)][Math.round(this.vertZ * z)] = intensity
    }
}

