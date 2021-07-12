import { mat4 } from '../../../lib/glMatrix-0.9.5.min.js'
import { degToRad } from '../../../libmy/utils/math'

const tempMat = mat4.create()

export default (function(){ return {

    activeMouseAndTouchAxis: [1, 1],
    enableMouse: true,
    enableTouch: true,
    enableOrientation: false,
    initialOrientation: null, // set null adjustation orientation new

    /**
     * 
     * @param {*} canvas 
     * @param {*} matrix 
     */
    setupMouseControl(canvas, matrix){
        var lastX, lastY
        var mouseDown = false

        canvas.onmousedown = (event) => {
            mouseDown = true
            lastX = event.clientX
            lastY = event.clientY
        }
        canvas.onmousemove = (event) => {
            if(!this.enableMouse) return
            if(!mouseDown) return
            let newX = event.clientX
            let newY = event.clientY
            this.rotateByValues(matrix, lastX-newX, lastY-newY)
            lastX = newX
            lastY = newY
        }
        canvas.onmouseup = function () { mouseDown = false }
        canvas.onmouseout = function() { mouseDown = false }
    },

    /**
     * 
     * @param {*} canvas 
     * @param {*} matrix 
     */
    setupTouchControl(canvas, matrix) {
        var lastX, lastY
        var touchDown = false

        canvas.ontouchstart = (event) => {
            touchDown = true
            lastX = event.touches[0].pageX
            lastY = event.touches[0].pageY
        }
        canvas.ontouchmove = (event) => {          
            if(!this.enableTouch) return
            if(!touchDown) return
            let newX = event.touches[0].pageX
            let newY = event.touches[0].pageY
            this.rotateByValues(matrix, lastX-newX, lastY-newY)
            lastX = newX
            lastY = newY
        }
        canvas.ontouchend = (event) => { touchDown = false }
    },

    /**
     * device orientation sensors on device not working for local debugging (requires https://)
     * 
     * https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation
     * winkel idle position wenn device flach auf tisch liegt
     * alpha (y-Achse) 0/360 süden
     * beta (x-Achse, gerade)
     * gamma (z-Achse, seitlich) 
     * 
     * problem tritt auf wenn device senkrecht nach oben zeigt, dann dreht gamma frei obwohl eigentlich nur beta verändern dürfte
     * reihenfolge 
     * quaternion?
     * 
     * klappt so wies jetzt ist wenn device initial in xz ebene liegt 
     */
    setupOrientationControl(canvas, matrix) {

        window.addEventListener('deviceorientation', event => {          
            if(!this.enableOrientation) return

            let x = event.gamma
            let y = event.beta 

            if (this.initialOrientation == null) {
                this.initialOrientation = [x, y]
            }
            this.rotateByValues(matrix, this.initialOrientation[0]-x, this.initialOrientation[1]-y) 
        })
    },

    /**
     * Verwendung einer eigene rotationsmatrix weil sonst sieht komisch aus
     * @param {*} matrix 
     * @param {*} lastValue 
     * @param {*} newValue 
     * @param {Vec3} axis 
     */
    rotateByValues(matrix, deltaX, deltaY) {  
        let rMat = mat4.identity(tempMat)          
        if(this.activeMouseAndTouchAxis[0]) mat4.rotate(rMat, degToRad(deltaX/5), [0, 1, 0])
        if(this.activeMouseAndTouchAxis[1]) mat4.rotate(rMat, degToRad(deltaY/5), [1, 0, 0])
        mat4.multiply(rMat, matrix, matrix)
    }
}})()



