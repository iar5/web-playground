import * as THREE from 'three'
import { Camera, Clock, ConeGeometry, Euler, MathUtils, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, PerspectiveCamera, Scene, SphereBufferGeometry, Vector3 } from 'three';
import RotationControler, { MouseMode } from './RotationControler';
import MovementControler from './MovementControler';
import PlayerCharacter from './PlayerCharacter';


const tempVec3 = new Vector3()
const tempVec3_2 = new Vector3()

const UP = new Vector3(0, 1, 0)


/**
 * - idee: rdr2 vorbild
 * - model, camera, movement etc trennen
 * - camera free rotate model erst rotate wenn man los läuft
 * - dann follow camera
 * - camera collision mit wenden?
 * https://github.com/simondevyoutube/ThreeJS_Tutorial_CharacterController/blob/main/main.js
 */


export default class Player {

    private readonly CAMERA_OFFSET = new Vector3(0, 1.7, 0)
    private readonly lastPosition: Vector3 = new Vector3()

    public readonly playercharacter: PlayerCharacter;
    public readonly controls: RotationControler;
    public readonly movement: MovementControler;
    public readonly camera: Camera;

    private isBlockedValue: boolean


    constructor(camera: PerspectiveCamera, canvas: HTMLCanvasElement, scene: Scene) {

        this.camera = camera
        this.movement = new MovementControler()
        this.controls = new RotationControler(camera, canvas, MouseMode.MouseHoldAndTouch);

        this.playercharacter = new PlayerCharacter()
        scene.add(this.playercharacter)
        
        document.addEventListener('pointerlockerror', () => {
            this.block()
        })
    }


    public block(exitPointerlock: boolean = false) {
        this.isBlockedValue = true
        this.movement.resetKeys()
        this.movement.block()

        if (this.controls.isLocked()) {
            this.controls.block()
            if (exitPointerlock) this.controls.unlock();
        }
    }

    public unblock() {
        this.isBlockedValue = false
        this.controls.unblock()
        this.movement.unblock()
        if (!this.controls.isLocked()) { // pointerlok event würde sonst doppelt gefeurt wird und endlosschleife entsteht
            this.controls.lock(); // lockt wieder PointerLock ein
        }
    }

    public isBlocked(): boolean {
        return this.isBlockedValue
    }

    public getYRotation(): number {
        this.camera.getWorldDirection(tempVec3);
        return Math.atan2(tempVec3.x, tempVec3.z)
    }

    public update(delta: number){
        delta = THREE.MathUtils.clamp(delta, 0, 0.1) // clamp to prevent too big jumps

        this.lastPosition.copy(this.playercharacter.position)
        let theta  = this.getYRotation()
        this.playercharacter.setRotationFromAxisAngle(UP, theta)

        // translate on local coordinate system (which is rotatet)
        this.movement.getUpdatedUnifiedMovementVector(delta, tempVec3)
        //this.playercharacter.lookAt(tempVec3_2.set(0,0,0).addVectors(tempVec3, this.playercharacter.position)) // TOFO für später

        this.playercharacter.translateX(tempVec3.x)
        this.playercharacter.translateY(tempVec3.y)
        this.playercharacter.translateZ(tempVec3.z)

        // apply position to camera
        this.camera.position.copy(this.playercharacter.position)
        this.camera.position.add(this.CAMERA_OFFSET)    
    }
}
