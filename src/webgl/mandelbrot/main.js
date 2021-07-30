/** 
 * @author Tom Wendland 
 */

import { createProgramFromFiles, isWebGL2Supported } from '../../../libmy/utils/webgl'
import { getPinchChange, getPanChangeX, getPanChangeY, preventTouchGestures } from '../../../libmy/touchGestures.js'
import { isKeyHold } from '../../../libmy/keyhold.js'
import { isTouchDevice } from '../../../libmy/utils/js'
import FpsCounter from '../../../libmy/fpsCounter.js'



const fpsCounter = new FpsCounter()
const canvas = document.getElementById("canvas")
preventTouchGestures(canvas)

const gl = canvas.getContext(isWebGL2Supported() ? "webgl2" : "webgl") 
gl.clearColor(0, 0, 0, 0)
gl.clear(gl.COLOR_BUFFER_BIT)

const vertices = new Float32Array([-1, 1,  -1, -1,  1, 1,  1, -1]) // triangle strip
const colors = [ // https://stackoverflow.com/questions/16500656/which-color-gradient-is-used-to-color-mandelbrot-in-wikipedia
    [5, 7, 26],
    [9, 1, 47],
    [4, 4, 73],
    [0, 7, 100],
    [12, 44, 138],
    [24, 82, 177],
    [57, 125, 209],
    [134, 181, 229],
    [211, 236, 248],
    [241, 233, 191],
    [248, 201, 95],
    [255, 170, 0],
    [204, 128, 0],
    [153, 87, 0],
    [106, 52, 3],
    [66, 30, 15]
]

const ZOOM_FAKTOR = 1.015; // qe zoom
const STEP_FAKTOR = 0.01 // wasd translate
const MAX_ITERATION = 500
const IS_MOBILE = isTouchDevice()

var height
var width 
var ratio 
resizeCanvas();

var program

var center = [-0.5, 0] // center point  
var zoom = 2 // entspricht länge der längsten seite 



/* START */

createProgramFromFiles(gl, './mandelbrot.vs', './mandelbrot.fs', p => {
    program = p
    resizeCanvas()

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.enableVertexAttribArray(program.aPosition)
    gl.vertexAttribPointer(program.aPosition, 2, gl.FLOAT, false, 0, 0)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    program.aPosition = gl.getAttribLocation(program, 'a_position')

    program.uAnimation = gl.getUniformLocation(program, 'u_animation')
    program.uMaxIterations = gl.getUniformLocation(program, 'u_maxIterations')
    program.uZoom = gl.getUniformLocation(program, 'u_zoom')
    program.uCenter = gl.getUniformLocation(program, 'u_center')
    program.uRatio = gl.getUniformLocation(program, 'u_ratio')


    for(let i = 0; i < colors.length; i++)
        gl.uniform3fv(gl.getUniformLocation(program, `u_colors[${i}]`), colors[i])

    requestAnimationFrame(loop)
})


/* RENDER LOOP */

function loop(){
    readControlls()
    render()
    fpsCounter.tick()
    updateGUI();
    requestAnimationFrame(loop)
}


function readControlls(){
    if(IS_MOBILE){
        center[0] -= zoom * getPanChangeX() / 1000 
        center[1] += zoom * getPanChangeY() / 1000
        zoom /= getPinchChange()
    } else {
        if(isKeyHold("d")) center[0] += zoom * STEP_FAKTOR
        if(isKeyHold("a")) center[0] -= zoom * STEP_FAKTOR 
        if(isKeyHold("w")) center[1] += zoom * STEP_FAKTOR
        if(isKeyHold("s")) center[1] -= zoom * STEP_FAKTOR
        if(isKeyHold("e")) zoom /= ZOOM_FAKTOR
        if(isKeyHold("q")) zoom *= ZOOM_FAKTOR
    }
}

function updateGUI(){
    document.getElementById("center").textContent = `[re: ${center[0]}, im: ${center[1]}]`;
    document.getElementById("zoom").textContent = 1/zoom;
    document.getElementById("fps").textContent = fpsCounter.getFPS();
}

var firsttime = Date.now();
function render(){
    let time = Date.now()
    gl.uniform2fv(program.uCenter, center)
    gl.uniform1f(program.uZoom, zoom)
    gl.uniform1f(program.uRatio, ratio)
    gl.uniform1i(program.uMaxIterations, MAX_ITERATION)
    gl.uniform1f(program.uAnimation, modifieAnimationCounter(Math.floor((time-firsttime)/15)))
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length/2)
}


function modifieAnimationCounter(number){
    number = number / 15
    //number += Math.sin(number/4)
    return number
}


/* EVENTS */

function resizeCanvas(){
    height = canvas.height = window.innerHeight 
    width = canvas.width = window.innerWidth   
    ratio = width/height  
    
    if(gl)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height) 
}
window.addEventListener('resize', resizeCanvas);



