import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { isKeyHold } from '../../../libmy/keyhold.js';
import { Vector3 } from 'three';


const tempVec3: Vector3 = new Vector3()
const tempVec32: Vector3 = new Vector3()


export default class Controls{

    private controls: OrbitControls

    constructor(camera, domElement){
        this.controls = new OrbitControls(camera, domElement)
    }

    update(delta: number){
        let a = 0.5
        if (isKeyHold("w")) tempVec3.z -= a
        if (isKeyHold("s")) tempVec3.z += a
        if (isKeyHold("a")) tempVec3.x -= a
        if (isKeyHold("d")) tempVec3.x += a
        if (isKeyHold("q")) tempVec3.y -= a
        if (isKeyHold("e")) tempVec3.y += a
        if (isKeyHold("Shift")) tempVec3.multiplyScalar(5)

        const l = tempVec3.length()
        tempVec3.transformDirection(this.controls.object.matrix)
        tempVec3.multiplyScalar(l)

        this.controls.object.position.add(tempVec3)
        this.controls.target.add(tempVec3)
        tempVec3.set(0,0,0)

        this.controls.update();
    }
}

