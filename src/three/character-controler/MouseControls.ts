/**
 * Based on THREE PointerLockControls https://threejs.org/examples/misc_controls_pointerlock.html
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */


import { Camera, Euler, Vector3 } from "three";


export enum MouseMode {
    PointerLock,
    MouseHold,
    MouseMove,
}


const vec = new Vector3();
const euler = new Euler(0, 0, 0, 'YXZ');
const PI_2 = Math.PI / 2;


export default class MouseControls {

    private domElement: HTMLElement
    private camera: Camera

    private isLockedValue: boolean = false;
    private blocked: boolean = false
    private mousedown: boolean = false
    private mode: MouseMode

    private sensScale = 1
    private sensitivity = 0.001


    constructor(camera: Camera, domElement: HTMLElement, mode: MouseMode) {

        this.camera = camera
        this.domElement = domElement;
        this.mode = mode


        document.addEventListener('mousemove', (e) => this.onMouseMove(e), false);

        if (mode == MouseMode.MouseHold) {

            domElement.addEventListener('mousedown', e => {
                this.mousedown = true
            });

            domElement.addEventListener('mouseup', e => {
                this.mousedown = false
            });
        }
        else if (mode == MouseMode.PointerLock) {

            document.addEventListener('pointerlockerror', () => {
                console.error('Unable to use Pointer Lock API');
            });

            document.addEventListener('pointerlockchange', () => {
                if (document.pointerLockElement === this.domElement) {
                    this.isLockedValue = true;
                } else {
                    this.isLockedValue = false;
                }
            });
        }
    }


    private onMouseMove(event) {

        if (this.blocked) return
        if (this.mode == MouseMode.PointerLock && !this.isLockedValue) return;
        if (this.mode == MouseMode.MouseHold && !this.mousedown) return

        // Chrome Bug wenn pointerlock nicht in mitte des bildschirms startet passiert beim unlock nen jump
        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        euler.setFromQuaternion(this.camera.quaternion);

        euler.y -= movementX * this.sensitivity * this.sensScale;
        euler.x -= movementY * this.sensitivity * this.sensScale;
        euler.x = Math.max(- PI_2, Math.min(PI_2, euler.x));

        this.camera.quaternion.setFromEuler(euler);
    }

    public setSensivity(v: number) {
        this.sensScale = v
    }

    public isLocked() {
        return this.isLockedValue
    }

    public lock() {
        if (this.mode == MouseMode.PointerLock)
            this.domElement.requestPointerLock();
    }

    public unlock() {
        document.exitPointerLock();
    };

    public block() {
        this.blocked = true
    };

    public unblock() {
        this.blocked = false
    };

    public getDirection() {
        var direction = new Vector3(0, 0, - 1);
        return function (v) {
            return v.copy(direction).applyQuaternion(this.camera.quaternion);
        };
    }

    public moveForward(distance) {
        // move forward parallel to the xz-plane
        // assumes camera.up is y-up
        vec.setFromMatrixColumn(this.camera.matrix, 0);
        vec.crossVectors(this.camera.up, vec);
        this.camera.position.addScaledVector(vec, distance);
    };

    public moveRight(distance) {
        vec.setFromMatrixColumn(this.camera.matrix, 0);
        this.camera.position.addScaledVector(vec, distance);
    };
}
