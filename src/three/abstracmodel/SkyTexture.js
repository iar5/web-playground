import * as THREE from 'three'


export default class SkyTexture extends THREE.Mesh{

    constructor(){
        const texloader = new THREE.TextureLoader()

        let texture = texloader.load('/textures/11.jpg')
        let geometry = new THREE.SphereGeometry(600, 25, 25)
        let material = new THREE.MeshBasicMaterial({map: texture})

        super(geometry, material)

        this.rotateY(THREE.MathUtils.degToRad(90))
        this.material.side = THREE.BackSide
    }
}