export const vs = `
	attribute vec3 a_position;

	void main()	{
		gl_Position = vec4(a_position, 1.0 );
	}
`


export const fs = `

precision mediump float;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
const float pi = 3.14159265359;

float rand(int seed, float ray) 
{
	return mod(sin(float(seed)*363.5346+ray*674.2454)*6743.4365, 1.0);
}


vec3 lampcirc (vec2 pt, vec2 pos, float power, float fallof, vec3 color)
{
	pt = pt - pos;
	float d = length(pt);
	//vec3 col = vec3(0.5, 0.5, 0.9) * (pow(dist, -0.8) * 0.11);
	vec3 col = color * (pow(d, power * -1.0) * fallof) - (d/3.0 * fallof);
	return col;
}

vec3 lamprect (vec2 pt, vec2 pos, vec2 size, float power, float fallof, vec3 color)
{
  	float d = length(max(abs(pt - pos), size) - size);
	return color * (pow(d, power * -1.0) * fallof) - (d/3.0 * fallof);   
}


void main( void )
{
	vec2 npos = gl_FragCoord.xy / u_resolution.xy;   // 0.0 .. 1.0
	float aspect = u_resolution.x / u_resolution.y;    // aspect ratio x/y
 	vec2 ratio = vec2(aspect, 1.0);                // aspect ratio (x/y,1)
 	vec2 uv = (2.0 * npos - 1.0) * ratio;          // -1.0 .. 1.0
 	vec2 pt = uv;
	
	vec2 pos = vec2(0,0);
  	vec2 size = vec2(0.1, 0.01);
  	float power = .2;
	float fallof = 0.2;
	vec3 light_color = vec3(0.1, 0.1, 0.5);

	size = u_mouse/1.9;
	size.x *= min(aspect, 1.1);
	
	float f = 0.5 + (1.+sin(fallof*u_time))/3.0;


  	vec3 col1 = lamprect(pt, pos, size, power, f, light_color);
	gl_FragColor = vec4(col1, 1.0);
}

`
