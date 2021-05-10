import { ConeGeometry, Mesh, MeshBasicMaterial, Object3D, Vector3 } from "three";
import THREE = require("three");



export default class PlayerCharacter extends Object3D{



    constructor(){
        super()
        
        let o = new Mesh(new ConeGeometry(0.5, 4).rotateX(THREE.MathUtils.degToRad(90)), new MeshBasicMaterial({ color: "green" }))
        this.add(o)

    }
}