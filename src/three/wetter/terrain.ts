
import SimplexNoise = require("simplex-noise")
import seedrandom = require('seedrandom');
import * as THREE from "three"
import { scene } from "./main"
import { BoxGeometry, Mesh, MeshPhongMaterial, SphereBufferGeometry } from "three";


var simplex = new SimplexNoise()

let tgeo = new THREE.PlaneGeometry(200, 200, 200, 200)
tgeo.rotateX(THREE.MathUtils.degToRad(-90))
let tmat = new THREE.MeshLambertMaterial({
    color: 'rgb(150, 255, 150)',
    side: THREE.DoubleSide
})

const terrain = new THREE.Mesh(tgeo, tmat)
terrain.receiveShadow = true

scene.add(terrain)

terrain.geometry.vertices.forEach(v => {
    v.y = heightfield(v.x, v.z)
})


const rand = seedrandom(1)
for(var i=0; i<10; i++){
    let mesh = new Mesh(new BoxGeometry(2 + rand() * 4, 2 + rand() * 4, 2 + rand() * 4), new MeshPhongMaterial({ color: "white" }))
    let x = 100 * (rand() - 0.5)
    let z = 100 * (rand() - 0.5)
    mesh.position.set(x, heightfield(x, z), z)
    scene.add(mesh)
}


function heightfield(x, z){
    return simplex.noise2D(x / 50, z / 50)
}