import seedrandom = require('seedrandom');
import * as THREE from "three"
import { gui, scene } from "./main"
import { BoxGeometry, Mesh, MeshBasicMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, SphereBufferGeometry, Texture, TextureLoader, Vector2 } from "three";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise"




const repeat = new Vector2(5,5)

const texColor = new TextureLoader().load('/textures/terrain/ColorMap.jpeg')
texColor.wrapS = texColor.wrapT = THREE.RepeatWrapping;
texColor.repeat = repeat

const texNormal = new TextureLoader().load('/textures/terrain/NormalMap.png')
texNormal.wrapS = texNormal.wrapT = THREE.RepeatWrapping;
texNormal.repeat = repeat

const texSpec = new TextureLoader().load('/textures/terrain/SpecularMap.png')
texSpec.wrapS = texSpec.wrapT = THREE.RepeatWrapping;
texSpec.repeat = repeat

const texAo = new TextureLoader().load('/textures/terrain/AmbientOcclusionMap.png')
texAo.wrapS = texAo.wrapT = THREE.RepeatWrapping;
texAo.repeat = repeat


const tgeo = new THREE.PlaneGeometry(200, 200, 200, 200)
tgeo.rotateX(THREE.MathUtils.degToRad(-90))
const tmat = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: texColor,
    bumpMap: texNormal,
    bumpScale: 0.05,
    aoMap: texAo,
    name: "Terrain",
})/*
const tmat = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    map: texColor,
    bumpMap: texNormal,
    bumpScale: 0.05,
    aoMap: texAo,
    name: "Terrain",
    specular: 0x410000,
    shininess: 5,
})*/

gui.addMaterial(tmat)
const terrain = new THREE.Mesh(tgeo, tmat)
terrain.receiveShadow = true
scene.add(terrain)



const simplex = new SimplexNoise()

function heightfield(x, z) {
    let dst = Math.sqrt(x * x + z * z)

    let f = 0
    if(dst > 25){
        f = -(1-(30/dst)) * 10
    }

    let low = simplex.noise3d(x / 50, z / 50, 0) * 4 + f
    let high = simplex.noise3d(x / 5, z / 5, 10) / 2
    return low + high
}

terrain.geometry.vertices.forEach(v => {
    v.y = heightfield(v.x, v.z)
})




const mat = new MeshPhysicalMaterial({
    color: "white",
    name: "Monolyt",
    transparent: true, // damit transmission klappt
    roughness: 0,
    reflectivity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.3,
    side: THREE.DoubleSide
})
const rand = seedrandom(3)
gui.addMaterial(mat)

for (var i = 0; i < 10; i++) {
    let h = 5 + rand() * 40
    let geo = new BoxGeometry(2 + rand() * 4, h, 2 + rand() * 4)
    let mesh = new Mesh(geo, mat)
    let x = 100 * (rand() - 0.5)
    let z = 100 * (rand() - 0.5)
    mesh.position.set(x, heightfield(x, z) + h / 2, z)
    scene.add(mesh)
}





