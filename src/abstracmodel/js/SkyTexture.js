import * as THREE from '../../../lib/three/build/three.module.js'


export default class SkyTexture extends THREE.Mesh{

    constructor(){
        const texloader = new THREE.TextureLoader()

        let texture = texloader.load('/assets/img/360/sky16.bmpf33d334a-3dfd-4a67-9131-9721af012d32Zoom.jpg')
        let geometry = new THREE.SphereGeometry(600, 25, 25)
        let material = new THREE.MeshBasicMaterial({map: texture})

        super(geometry, material)

        this.rotateY(THREE.MathUtils.degToRad(90))
        this.material.side = THREE.BackSide
    }
}