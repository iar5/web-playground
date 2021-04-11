/**
 * @author Tom Wenland
 * 
 * ERWEITERUNGEN
 * - Steuerung: leichte rotation/wackeln in allen Seiten, ziehbar -> geht zurück wenn los gelassen
 * - update(img) mit sehbarer vertice veränderung, drehung etc beibehalten
 * - Lag bei update(img) verhninder durch berechnung vom bilddaten in webworker
 * - Video: vertices bleiben gleich, nur farbe wird geupdated
 * - Transition in Farbe und Tiefe wenn Dimension von bieden bildern gleich sind
 * 
 * - leichtes gedingenes displacement über noise funktion wie auf gepsiechertem IG beitrag
 * - https://cmaher.github.io/posts/working-with-simplex-noise/
 * - input: vec2 pos, time output: vec2
 * -> 3d noise?
 * 
 */

import { mat4 } from '../../lib/glMatrix-0.9.5.min.js'
import { degToRad, loadImage, getImageData } from '../../libmy/utils.js'
import { createProgramFromSource, destroyGl } from '../../libmy/webglUtils.js'
import controls from './controls.js'


const vs_src = `
precision highp float;

attribute vec3 vertexPosition;
attribute vec4 vertexColor;

uniform mat4 mvMatrix;
uniform mat4 pMatrix;
uniform float depth;

varying vec4 vColor;

void main(void) {
    float z = vertexPosition.z * depth;

    gl_Position = pMatrix * mvMatrix * vec4(vertexPosition.x, vertexPosition.y, z, 1.0);
    vColor = vertexColor;
}
`

const fs_src = `
precision highp float;

varying vec4 vColor;

void main(void) {
    gl_FragColor = vColor;
}
`

/**
 * 
 * @param {CanvasElement} canvasElement 
 * @param {String} imageSrc 
 * @param {Number?} scale scale on longest edge
 */
export default function ImagePlot3D(canvasElement, imgSrc, scale=0.4) {
    
    const canvas = canvasElement
    const gl = canvas.getContext("webgl2")
    gl.enable(gl.DEPTH_TEST) 
    gl.clearColor(1, 1, 1, 1)
    gl.getExtension('OES_element_index_uint')

    const camera = {
        projectionMatrix: mat4.create(),
        modelViewMatix: mat4.identity(mat4.create()),
    }

    const animation = {
        lastTick: 0,
        enabled: true,
        rotationValues: [-0.2, 1, 0],
        depth: 1
    }
 
    
    // Controls, GUI, Events
    controls.setupMouseControl(canvas, camera.modelViewMatix)
    controls.setupTouchControl(canvas, camera.modelViewMatix)
    controls.setupOrientationControl(canvas, camera.modelViewMatix)
    window.addEventListener('resize', resize)

    // Shader Program, Attribute und Unforms initialisieren
    const shaderProgram = createProgramFromSource(gl, vs_src, fs_src)
    const vertexColorBuffer = gl.createBuffer()
    const vertexPositionBuffer = gl.createBuffer()
    const indexBuffer = gl.createBuffer()
    shaderProgram.depth = gl.getUniformLocation(shaderProgram, "depth")
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "pMatrix")
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "mvMatrix")
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor")
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPosition")
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute)
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute)
    
    // Start
    loadImage(imgSrc, img => {
        resize()
        setImage(img)
        draw()
    })


    function resize(){        
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        let ratio = canvas.width / canvas.height
        mat4.ortho(-1*ratio, 1*ratio, -1, 1, 10, -10, camera.projectionMatrix)
        gl.viewport(0, 0, canvas.width, canvas.height)
    }

    function setImage(img) {
        const maxSize = 500 // längste kante pixelnanzahl 

        let ratio = canvas.width / canvas.height
        let imgWidth = img.naturalWidth
        let imgHeight = img.naturalHeight

        if (imgWidth > imgHeight) {
            imgHeight = imgHeight * maxSize / imgWidth
            imgHeight = Math.round(imgHeight)
            imgWidth = maxSize
        }
        else {
            imgWidth = imgWidth * maxSize / imgHeight
            imgWidth = Math.round(imgWidth)
            imgHeight = maxSize
        }

        // skalierung damit bild maximal im screen liegt, keine ahnung warumm die formeln klappen lol
        const imgRatio = imgWidth/imgHeight
        const imgScale = (imgRatio > ratio ? 2/imgWidth : 2/imgHeight) * scale

        // Generate Data
        const imageData = getImageData(img, imgWidth, imgHeight)
        const colors = Array.from(imageData).map(x => x / 255)
        var min_color = Number.MAX_SAFE_INTEGER
        var max_color = Number.MIN_SAFE_INTEGER
        for (let i = 0; i < colors.length; i += 4) {
            let c = depthFunction(colors[i], colors[i + 1], colors[i + 2])
            if (c < min_color) min_color = c
            if (c > max_color) max_color = c
        }
        const z_offset = (max_color + min_color) / 2
        const z_maxdist = max_color - min_color

        const vertices = []
        for (let y = imgHeight; y > 0; y--) {
            for (let x = 0; x < imgWidth; x++) {
                let rgba = ((imgHeight - y) * imgWidth + x) * 4
                vertices.push(
                    (0.5+x - imgWidth/2) * imgScale,
                    (0.5+y - imgHeight/2) * imgScale,
                    (depthFunction(colors[rgba], colors[rgba + 1], colors[rgba + 2]) - z_offset) / z_maxdist * 0.5
                )
            }
        }

        const stripIndices = generateTriangleStripIndices(imgWidth, imgHeight)
        setBufferData(vertices, colors, stripIndices)
    }

    function depthFunction(r, g, b) {
        return -Math.sqrt(r * r + g * g + b * b) // negierren damit helle farben vorne
    }

    function setBufferData(vertices, colors, indices){
        vertexColorBuffer.itemSize = 4
        vertexColorBuffer.numItems = colors.length / 4
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0)

        vertexPositionBuffer.itemSize = 3
        vertexPositionBuffer.numItems = vertices.length / 3
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)

        indexBuffer.itemSize = 1
        indexBuffer.numItems = indices.length
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW)
    }


    //////////////////////////
    // APPLICATION LOOP
    /////
    var stopApp = false

    function draw() {
        if(stopApp) 
            return
        
        requestAnimationFrame(() => draw())
        
        if(animation.enabled)
            animate()

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, camera.projectionMatrix)
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, camera.modelViewMatix)
        gl.uniform1f(shaderProgram.depth, animation.depth)
        gl.drawElements(gl.TRIANGLE_STRIP, indexBuffer.numItems, gl.UNSIGNED_INT, 0)
    }

    function animate(){
        let timeNow = Date.now()
        if (animation.lastTick == 0) {
            camera.startStamp = timeNow
            animation.lastTick = timeNow
        }
        let elapsed = timeNow - animation.lastTick
        animation.lastTick = timeNow

        let rotation = degToRad(elapsed / 100)
        // let s = Math.cos((camera.startStamp-timeNow)/1000/5) 
        // TODO problem: drehung ner anderen matrix mit s damit globales koordinatensystem genommen wird?
        mat4.rotate(camera.modelViewMatix, rotation * animation.rotationValues[0], [1, 0, 0])
        mat4.rotate(camera.modelViewMatix, rotation * animation.rotationValues[1], [0, 1, 0])
        mat4.rotate(camera.modelViewMatix, rotation * animation.rotationValues[2], [0, 0, 1])
    }




    return {
        updateImage(imgSrc) {
            /**
             * TODO WebkWorker damit nicht lagt
             */
            loadImage(imgSrc, img => setImage(img))
        },
        setRotationParameters(x, y, z){
            if(x != undefined) animation.rotationValues[0] = x
            if(y != undefined) animation.rotationValues[1] = y
            if(z != undefined) animation.rotationValues[2] = z
        },
        setDepth(d) {
            animation.depth = d
        },
        setControleAxis(x, y){ 
            controls.activeMouseAndTouchAxis = [x, y]
        },
        resetView() {
            this.setRotationParameters(0, 0, 0)
            animation.depth = 1
            mat4.identity(camera.modelViewMatix)
            controls.initialOrientation = null 
        },
        enableMouseAndTouchControle(bool){
            controls.enableMouse = bool
            controls.enableTouch = bool
        },
        enableOrientationControle(bool){
            animation.enabled = !bool
            controls.enableMouse = !bool
            controls.enableTouch = !bool  
            controls.enableOrientation = bool  
            animation.lastTick = Date.now()  
            controls.initialOrientation = null 
        },
        toggleDepthTest(bool){
            bool = bool | !gl.isEnabled(gl.DEPTH_TEST)
            bool ? gl.enable(gl.DEPTH_TEST) : gl.disable(gl.DEPTH_TEST)
        },
        getParameters(){
            return {
                depth: animation.depth,
                rotations: [...animation.rotationValues],
                depthTestEnabled: gl.isEnabled(gl.DEPTH_TEST),
                orientationControleEnabled: controls.enableOrientation,
            }
        },
        destroyGl(){
            stopApp = true
            destroyGl(gl)
        }
    }
}



/**
 * TRIANGLE_STRIP indices 
 * @param {Number} width 
 * @param {Number} height 
 * @returns {Array}
 */
function generateTriangleStripIndices(width, height) {
    var result = []
    for (let z = 0; z < height - 1; z++) {
        // degenerate index on non-first row
        if (z != 0) result.push((z * width))
        // main strip
        for (let x = 0; x < width; x++) {
            result.push(z * width + x)
            result.push((z + 1) * width + x)
        }
        // degenerate index on non-last row
        if (z != (width - 2)) result.push((z + 1) * width + (width - 1))
    }
    return result
}
