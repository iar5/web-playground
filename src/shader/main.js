import { createProgramFromSource, destroyGl } from '../../libmy/webglUtils.js'
import { isMobile, lerp } from '../../libmy/utils.js'
import { vs, fs } from './shaderNebel.js'


export default function(canvas){

    const hasTouch = isMobile()
    const gl = canvas.getContext("experimental-webgl") 
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    
    var height
    var width 
    var ratio 
    var mouse = [0, 0]
    var mouseTouchDestination = [0, 0]
    var mouseT = 0

    function resizeCanvas(){
        height = window.innerHeight
        width = window.innerWidth
        ratio = width/height  

        canvas.height = height
        canvas.width = width
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height) 
    }

    function mouseMove(e) {
        mouse[0] = 1-e.clientX/width 
        mouse[1] = e.clientY/height 
    }


    resizeCanvas()
    window.addEventListener('resize', resizeCanvas);
    
    if(!hasTouch) document.addEventListener('mousemove', mouseMove)
    

    const program = createProgramFromSource(gl, vs, fs)
    const vertices = new Float32Array([-1, 1,  -1, -1,  1, 1,  1, -1]) 
    
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.enableVertexAttribArray(program.a_position)
    gl.vertexAttribPointer(program.a_position, 2, gl.FLOAT, false, 0, 0)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    
    program.a_position = gl.getAttribLocation(program, 'a_position')
    program.u_resolution = gl.getUniformLocation(program, 'u_resolution')
    program.u_time = gl.getUniformLocation(program, 'u_time')
    program.u_mouse = gl.getUniformLocation(program, 'u_mouse')

    
    var lastTime = 0
    var sum = 1;
    

    requestAnimationFrame(update)  

    function update(time){
        requestAnimationFrame(update)
     
        let delta = time-lastTime
        lastTime = time


        if(hasTouch){
            if(mouseTouchDestination[0] == mouse[0] && mouseTouchDestination[0] == mouse[0]){
                mouseT = 0
                mouseTouchDestination[0] = Math.random()
                mouseTouchDestination[1] = Math.random()
            }
            else{
                mouseT += delta/1000/2
                mouseT = Math.min(mouseT, 1)
                mouse[0] = lerp(mouse[0], mouseTouchDestination[0], mouseT)
                mouse[1] = lerp(mouse[1], mouseTouchDestination[1], mouseT)
            }   
        }
    
        gl.uniform2fv(program.u_mouse, mouse)
        gl.uniform1f(program.u_time, time/1000)
        gl.uniform2fv(program.u_resolution, [width, height])
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length/2)
    }
    


    return {
        destroy(){
            destroyGl(gl)
        }
    }
}


