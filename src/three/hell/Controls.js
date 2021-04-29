import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { Camera } from 'three/build/three.module.js';
import { isKeyHold } from '../../../libmy/keyhold.js';


export default class Controls{

    constructor(camera, domElement){
        this.controls = new OrbitControls(camera, domElement)
    }

    update(delta){
        let camera = this.controls.object
        let a = 1
        if (isKeyHold("w")) camera.position.z -= a
        if (isKeyHold("s")) camera.position.z += a
        if (isKeyHold("a")) camera.position.x -= a
        if (isKeyHold("d")) camera.position.x += a
        if (isKeyHold("q")) camera.position.y += a
        if (isKeyHold("e")) camera.position.y -= a

        this.controls.update(delta);
    }
}