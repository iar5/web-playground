import { mat4 } from '../../../lib/glMatrix-0.9.5.min.js'
import { loadImage, getImageData } from '../../../libmy/utils/image'
import { degToRad } from '../../../libmy/utils/math'
import { createProgramFromSource } from '../../../libmy/utils/webgl'
import { setupMouseControl } from './controls.js'

const vs_src = `
precision highp float;

attribute vec3 a_vertexPosition;
attribute vec2 a_texcoord;

uniform float depth;
uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;
uniform sampler2D texture;

varying vec4 v_color;

void main(void) {
    float z = a_vertexPosition.z * depth;
    gl_Position = projectionMatrix * modelviewMatrix * vec4(a_vertexPosition.x, a_vertexPosition.y, z, 1.0);

    // y spiegelung weil textur iwie geflipt ist
    vec2 texCoord = vec2(a_vertexPosition.x, -a_vertexPosition.y) + vec2(0.5, 0.5);
    v_color = texture2D(texture, texCoord);
}`;

const fs_src = `
precision highp float;

varying vec4 v_color;

void main(void) {
    gl_FragColor = v_color;
}`;



/**
 * IDEE
 * - Berechnung von z im VS?
 * - Farbe im VS aus Texture holen von der Stelle seiner xy Position  
 * 
 * PROBLEM 
 * - Textur als uniform mit uv von 0-1 
 * - Vertices Position gehen nicht von in x und y von 0-1 sondern je nach ratio des bildes auf einer seite weniger
 * 
 * LÖSUNGEN
 * - n*n grid und überflüssige vertices alpha = 0?
 * - bei uv access ratio beachten
 * 
 * @param {CanvasElement} canvasElement 
 * @param {String} imageSrc 
 */
export function ImagePlot3D(canvasElement, imgSrc) {

    //////////////////////
    // Initialisation 
    //////

    const canvas = canvasElement;
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    const ratio = canvas.width / canvas.height;

    const gl = canvas.getContext(document.createElement('canvas').getContext('webgl2') ? "webgl2" : "webgl")
    gl.enable(gl.DEPTH_TEST);
    const shaderProgram = createProgramFromSource(gl, vs_src, fs_src)
    const vertexPositionBuffer = gl.createBuffer();

    var stop = false

    const camera = {
        modelviewMatrix: mat4.create(),
        projectionMatrix: mat4.create(),
        rotationMatrix: mat4.create(),
        lastTick: 0,
        orientationControl: false
    };

    const animation = {
        rx: -0.2,
        ry: 1,
        rz: 0,
        depth: 1
    };
 

    setupMouseControl(canvas, camera);



    loadImage(imgSrc, img => {
        setImage(img)
        draw()
    })

    //////////////////////
    // Member Functions 
    //////

    function setImage(img) {
        const edgeLength = 1.4; // längste Kante, maxLength entsprechend viewport größe
        const maxSize = 500 // längste kante in pixel für downsampling

        var width = img.naturalWidth;
        var height = img.naturalHeight;

        if (width > maxSize && width > height) {
            height = height * maxSize / width
            width = maxSize
        }
        else if (height > maxSize) {
            width = width * maxSize / height
            height = maxSize
        }

        width = Math.round(width)
        height = Math.round(height)
        const scale = (width > height ? edgeLength / width : edgeLength / height);
        const imageData = getImageData(img, width, height)



        // Calculate min/max z 
        var colors = Array.from(imageData)
        var min_color = Number.MAX_SAFE_INTEGER
        var max_color = Number.MIN_SAFE_INTEGER
        for (let i = 0; i < colors.length; i += 4) {
            let c = calculateZ(colors[i], colors[i + 1], colors[i + 2])
            if (c < min_color) min_color = c;
            if (c > max_color) max_color = c;
        }
        const z_offset = (max_color + min_color) / 2
        const z_maxdist = max_color - min_color

        // Generate vertices and displace them by color
        let vertices = []
        for (let y = height; y > 0; y--) {
            for (let x = 0; x < width; x++) {
                let rgba = ((height - y) * width + x) * 4;
                vertices.push(
                    (x - width / 2) * scale,
                    (y - height / 2) * scale,
                    (calculateZ(colors[rgba], colors[rgba + 1], colors[rgba + 2]) - z_offset) / z_maxdist * 0.5
                );
            }
        }
        const indices = generateTriangleStripIndices(width, height);
        const tempVert = []
        for (let i of indices) {
            tempVert.push(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]);
        }
        vertices = tempVert;


        // Prepare colors for RGB texture (get rid of alpha)
        let tempColors = [] 
        for (let i = 0; i < colors.length; i += 4) {
            tempColors.push(colors[i], colors[i + 1], colors[i + 2])
        }
        colors = tempColors 

  


        // Create texture
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
         
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(colors));
        var texcoordLocation = gl.getAttribLocation(shaderProgram, "a_texcoords");
        var texBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
        gl.enableVertexAttribArray(texcoordLocation);



        // Shader Program, Attribute und Unforms initialisieren
        shaderProgram.depth = gl.getUniformLocation(shaderProgram, "depth");
        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "modelviewMatrix");
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "a_vertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        // Buffer erstellen und mit Daten befüllen sodass ready zum zeichen 
        // (Position und Farbe bleiben gleich, müssen nicht in jedem draw neu)
        vertexPositionBuffer.itemSize = 3;
        vertexPositionBuffer.numItems = vertices.length / 3;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }

    function draw() {
        requestAnimationFrame(() => draw())

        if (stop) return
        
        animateCamera(camera);

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        mat4.ortho(-1 * ratio, 1 * ratio, -1, 1, 1, -1, camera.projectionMatrix); // left, right, bottom, top, near, far bund of the frustum
        mat4.identity(camera.modelviewMatrix);
        mat4.multiply(camera.modelviewMatrix, camera.rotationMatrix);

        gl.uniform1f(shaderProgram.depth, animation.depth);
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, camera.projectionMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, camera.modelviewMatrix);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPositionBuffer.numItems)
    }

    function calculateZ(r, g, b) {
        return -Math.sqrt(r * r + g * g + b * b); // negierren damit helle farben vorne
    }

    function animateCamera(camera) {
        let timeNow = Date.now();
        if (camera.lastTick == 0) {
            camera.startStamp = timeNow
            camera.lastTick = timeNow
        }

        let elapsed = timeNow - camera.lastTick;
        let rotation = elapsed / 100;
        // let s = Math.cos((camera.startStamp-timeNow)/1000/5) 
        // TODO problem: drehung ner anderen matrix mit s damit globales koordinatensystem genommen wird?

        mat4.rotate(camera.rotationMatrix, degToRad(rotation) * animation.rx, [1, 0, 0]);
        mat4.rotate(camera.rotationMatrix, degToRad(rotation) * animation.ry, [0, 1, 0]);
        mat4.rotate(camera.rotationMatrix, degToRad(rotation) * animation.rz, [0, 0, 1]);

        camera.lastTick = timeNow;
    }



    return {
        getRotationAnimation(){
            return [animation.rx, animation.ry, animation.rz]
        },
        setRX(r){
            animation.rx = r
        },
        setRY(r){
            animation.ry = r
        },
        setRZ(r){
            animation.rz = r
        },
        getDepth() {
            return animation.depth
        },
        setDepth(d) {
            animation.depth = d
        },
        stopApp() {
            stop = true;
        },
        updateImage(imgSrc) {
            loadImage(imgSrc, img => setImage(img))
        },
        resetView() {
            this.setRX(0)
            this.setRY(0)
            this.setRZ(0)
            camera.reset = true
            camera.rotationMatrix = mat4.identity(camera.rotationMatrix);
        },
        enableOrientationControle(bool){
            camera.orientationControl = bool
        }
    }
}


/**
 * Erstellt Array mit Indices für ein Raster das dann mit gl.drawArrays(gl.TRIANGLE_STRIP, ...) gezeichnet werden kann
 * @param {Number} width 
 * @param {Number} height 
 * @returns {Array}
 */
export function generateTriangleStripIndices(width, height) {
    var result = [];
    for (let z = 0; z < height - 1; z++) {
        // degenerate index on non-first row
        if (z != 0) result.push((z * width));
        // main strip
        for (let x = 0; x < width; x++) {
            result.push(z * width + x);
            result.push((z + 1) * width + x);
        }
        // degenerate index on non-last row
        if (z != (width - 2)) result.push((z + 1) * width + (width - 1));
    }
    return result
}





