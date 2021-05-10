import * as THREE from "three"
import { Vector2, Vector3 } from "three"


const tempVec3 = new Vector3()



/**
 * Klasse handelt movement richtung, beschleunigung 
 */
export default class MovementControler {


    public maxSpeed

    // is keydown geht nicht weil ich da nicht auf false setzen kann wenn pointer gelockt wird
    private moveForward: boolean = false
    private moveLeft: boolean = false
    private moveBackward: boolean = false
    private moveRight: boolean = false
    private blocked: boolean = false
    private forwardVelocity: number = 0
    private rightVelocity: number = 0
    private direction = new Vector3()
    private lastMovement: Vector3 = new Vector3()

    constructor() {
        this.maxSpeed =1.85 

        document.addEventListener('keydown', e => {
            this.onKeyDown(e)
        });

        document.addEventListener('keyup', e => {
            this.onKeyUp(e)
        });
    }

    private onKeyDown(event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                this.moveForward = true;
                break;
            case 37: // left
            case 65: // a
                this.moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                this.moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                this.moveRight = true;
                break;
            case 32: // space
                break;
        }
    }

    private onKeyUp(event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                this.moveForward = false;
                break;
            case 37: // left
            case 65: // a
                this.moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                this.moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                this.moveRight = false;
                break;
        }
    }

    /**
     * resets saved "keydown" keys 
     */
    public resetKeys() {
        this.moveForward = this.moveBackward = this.moveLeft = this.moveRight = false; // bugfix: keyup event does not fire when controls are locked
    }

    /**
     * sets velocity to 0
     */
    public resetVelocty() {
        this.forwardVelocity = 0
        this.rightVelocity = 0
    }

    /**
     * stoppt movement berechnungen aber lässt den spieler physikalisch auslaufen
     */
    public block() {
        this.blocked = true
    }

    public unblock() {
        this.blocked = false
    }

    /**
     * movement vektor kennt die rotation des spielers nicht und muss noch ins lokale koordinatemsystem übersetzt werden
     * heißt hier ist x+ immer rechts und y- immer nach vorne  
     * @param result destination vector
     */
    public updateAndGetMovement(delta: number, result: Vector3) {
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.normalize();

        if (this.blocked) {
            this.direction.set(0, 0, 0)
        }

        // wenn beschleunigen dann langsamer wenn stehen bleiben dann schneller 
        let sfw = this.moveForward || this.moveBackward ? 1 : 4
        let slr = this.moveLeft || this.moveRight ? 1 : 4

        // lerp fährt v richtung - + oder 0 und clampt auf 1 
        this.forwardVelocity = THREE.MathUtils.lerp(this.forwardVelocity, this.direction.z, delta * sfw);
        this.rightVelocity = THREE.MathUtils.lerp(this.rightVelocity, this.direction.x, delta * slr);

        // maximale frame speed 
        let mfs = this.maxSpeed * delta
        this.lastMovement.set(-this.rightVelocity * mfs / 3, 0, this.forwardVelocity * mfs)
        result.copy(this.lastMovement)
    }

    public getLastMovement(result: Vector3) {
        result.copy(this.lastMovement)
    }
}