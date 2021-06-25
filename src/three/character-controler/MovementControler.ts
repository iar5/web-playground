import * as THREE from "three"
import { Vector2, Vector3 } from "three"


const tempVec3 = new Vector3()


export default class MovementControler {

    public slowDownSideBackWalk: boolean = false
    public maxSpeed: number = 2

    private moveForward: boolean = false
    private moveLeft: boolean = false
    private moveBackward: boolean = false
    private moveRight: boolean = false
    private blocked: boolean = false
    private forwardVelocity: number = 0
    private rightVelocity: number = 0

    private readonly direction = new Vector3()
    private readonly lastMovement: Vector3 = new Vector3()

    constructor() {
        document.addEventListener('pointerlockchange', () => {
            this.resetKeys()
        })
        document.addEventListener("visibilitychange", () => {
            this.resetVelocty()
        })
        window.addEventListener("pagehide", () => {
            this.resetVelocty()
        });
        window.addEventListener("pagehide", () => {
            this.resetVelocty()
        });
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault()
        });
        document.addEventListener('keydown', (e) => {
            this.onKeyDown(e)
        });
        document.addEventListener('keyup', (e) => {
            this.onKeyUp(e)
        });
    }

    private onKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case "w": case "ArrowUp": this.moveForward = true; break;
            case "a": case "ArrowLeft": this.moveLeft = true; break;
            case "s": case "ArrowDown": this.moveBackward = true; break;
            case "d": case "ArrowRight": this.moveRight = true; break;
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        switch (event.key) {
            case "w": case "ArrowUp": this.moveForward = false; break;
            case "a": case "ArrowLeft": this.moveLeft = false; break;
            case "s": case "ArrowDown": this.moveBackward = false; break;
            case "d": case "ArrowRight": this.moveRight = false; break;
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
    public getUpdatedUnifiedMovementVector(delta: number, result: Vector3) {
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

        let forward, right
        if (this.slowDownSideBackWalk) {
            forward = (this.forwardVelocity < 0 ? this.forwardVelocity / 2 : this.forwardVelocity) * mfs
            right = this.rightVelocity / 2 * mfs
        } else {
            forward = this.forwardVelocity * mfs
            right = this.rightVelocity * mfs
        }
        this.lastMovement.set(-right, 0, forward)
        result.copy(this.lastMovement)
    }

    public getLastMovement(result: Vector3) {
        result.copy(this.lastMovement)
    }
}