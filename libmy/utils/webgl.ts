/**
 * @author Tom Wendland
 */


/**
 * loads a local textfile
 * @param {String} url 
 * @param {Callback} callback 
 */
export function loadTextResource(url, callback) {
    const request = new XMLHttpRequest()
    request.open('GET', url + '?please-dont-cache=' + Math.random(), true)
    request.onload = function () {
        callback(request.responseText)
    }
    request.send()
}

/**
 * 
 */
export function isWebGL2Supported() {
    return !!document.createElement('canvas').getContext('webgl2')
}

/**
 * 
 */
export function getHighestWebGL(canvas) {
    return isWebGL2Supported ? canvas.getContext('webgl2') : canvas.getContext('webgl')
}

/**
 * Erstellt ein Programm und erstellt Shader für übergebenen Shadercode
 * @param {RenderingContext} gl 
 * @param {String} vsSrc
 * @param {String} fsSrc
 * @returns {WebGLProgram}
 */
export function createProgramFromSource(gl, vsSrc, fsSrc) {
    const program = gl.createProgram()

    let vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vsSrc)
    gl.compileShader(vertexShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        // eslint-disable-next-line 
        console.log(gl.getShaderInfoLog(vertexShader))
    }
    gl.attachShader(program, vertexShader)

    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, fsSrc)
    gl.compileShader(fragmentShader)
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        // eslint-disable-next-line
        console.log(gl.getShaderInfoLog(fragmentShader))
    }
    gl.attachShader(program, fragmentShader)

    gl.linkProgram(program)
    gl.useProgram(program)
    return program
}

/**
 * 
 * @param {RenderingContext} gl 
 * @param {String} vsPath 
 * @param {String} fsPath 
 * @param {Callback} callback 
 */
export function createProgramFromFiles(gl, vsPath, fsPath, callback) {
    loadTextResource(vsPath, (vsSrc) => {
        loadTextResource(fsPath, (fsSrc) => {
            const program = createProgramFromSource(gl, vsSrc, fsSrc)
            callback(program)
        })
    })
}


/**
 * 
 * @param {WebGLRenderingContext} gl 
 */
export function destroyGl(gl) {
    // https://stackoverflow.com/questions/23598471/how-do-i-clean-up-and-unload-a-webgl-canvas-context-from-gpu-after-use
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.canvas.width = 1;
    gl.canvas.height = 1;
    gl.getExtension('WEBGL_lose_context').loseContext();
}


