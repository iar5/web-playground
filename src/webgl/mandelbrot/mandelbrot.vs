// Funktion: varying an fs mit mandelbrot koordinaten geben

precision highp float;
precision highp int;

uniform vec2 u_center;
uniform float u_zoom;
uniform float u_ratio;

attribute vec2 a_position;

varying vec2 v_position;

void main() {

   v_position = vec2(u_center + u_zoom*a_position);
   gl_Position = vec4(a_position, 0.0, 1.0); 

   // viewport (-1 bis +1)  
   // skaliert längste bildschirmkante auf = 1 und verringert die kürzere
   if(u_ratio > 1.0){
      gl_Position.y *= u_ratio; 
   }
   else{
      gl_Position.x /= u_ratio; 
   }
}