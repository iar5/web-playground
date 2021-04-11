/** @ Tom Wendland */

#define MAX_LOOP 10000
#define COLOR_TABLE_SIZE 16 // muss unten bei if() manuell angepasst werden

precision highp float;
precision highp int;

uniform vec2 u_center;
uniform int u_maxIterations;
uniform float u_animation;

uniform vec3 u_colors[COLOR_TABLE_SIZE];

varying vec2 v_position;

vec4 colorizeDivision(int i){
    if(i == u_maxIterations) return vec4(0.0, 0.0, 0.0, 1.0);

    float steps = 200.0;
    float fi = float(i);

    float r = fi / steps/2.0;
    float g = fi / steps/1.0;
    float b = fi / steps/3.0;
    return vec4(r, g, b, 1.0);
}

vec4 colorTable(int i){
    int mi = int(mod(float(i), float(COLOR_TABLE_SIZE))) ;
    vec3 rgb; // Index muss in GLSLS konstent Wert haben
    if(mi==0)rgb=u_colors[0];else if(mi==1)rgb=u_colors[1];else if(mi==2)rgb=u_colors[2];else if(mi==3)rgb=u_colors[3];else if(mi==4)rgb=u_colors[4];else if(mi==5)rgb=u_colors[5];else if(mi==6)rgb=u_colors[6];else if(mi==7)rgb=u_colors[7];else if(mi==8)rgb=u_colors[8];else if(mi==9)rgb=u_colors[9];else if(mi==10)rgb=u_colors[10];else if(mi==11)rgb=u_colors[11];else if(mi==12)rgb=u_colors[12];else if(mi==13)rgb=u_colors[13];else if(mi==14)rgb=u_colors[14];else if(mi==15)rgb=u_colors[15];
    return vec4(rgb / 255.0, 1);
}

vec4 colorizeSmooth(int iteration, float x, float y){
    if(iteration == u_maxIterations) 
        return vec4(0.0, 0.0, 0.0, 1.0);
    
    // https://stackoverflow.com/questions/369438/smooth-spectrum-for-mandelbrot-set-rendering
    // import: bailout radius of 16 or bigger
    float zn = log(log(sqrt(x*x + y*y))) / log(2.0);
    float iteration_f = float(iteration) + 1.0 - zn + u_animation;

    vec4 color1 = colorTable(int(floor(iteration_f)));
    vec4 color2 = colorTable(int(floor(iteration_f)) + 1);
    return mix(color1, color2, mod(iteration_f, 1.0));
}



/**
* Main Calculation of the Mandelbrot Set
*/
void main() {
    vec2 position = v_position; // "z0" // vorher war hier gl_FragCoord der gibt Pixelkoordinaten an
    float x = 0.0;
    float y = 0.0;
    int iteration = 0;

    // GLSL unterstützt keine while und dynamische for loops 
    // Die Abbruchbedingungen müssen in den Rumpf auslagern werden
    for(int j=0; j<MAX_LOOP; j++){
        if(j >= u_maxIterations) break; 
        if((x*x + y*y) > 16.0) break; // goes to infinity 
        float xtemp = x*x - y*y + position.x;
        y = 2.0 * x*y +  position.y;
        x = xtemp;
        iteration = iteration +1;
    }

    //gl_FragColor = colorizeDivision(iteration);
    gl_FragColor = colorizeSmooth(iteration, x, y);
}
