import * as THREE from 'three'

// http://glslsandbox.com/e#71011.0

const shader = {

    vertexShader: `
	  uniform vec3 positionOffset;

      varying vec3 vPos;
  
      void main() {
        vPos = position;
        vec4 mvPosition = modelViewMatrix * vec4( vPos, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
      }
  
    `,

    // #extension GL_OES_standard_derivatives : enable

    fragmentShader: `
	#ifdef GL_ES
	precision mediump float;
	#endif

	uniform float time;
	uniform vec2 resolution;
	uniform vec3 positionOffset;

    varying vec3 vPos;

	// a raymarching experiment by kabuto

	#define R_FACTOR 5.
	#define G_FACTOR 0.
	#define B_FACTOR 0.

	const int MAXITER = 42;

	vec3 field(vec3 p) {
		p *= .1;
		float f = .1;
		for (int i = 0; i < 5; i++) {
			p = p.yzx*mat3(.8,.6,0,-.6,.8,0,0,0,1);
			p += vec3(.123,.456,.789)*float(i);
			p = abs(fract(p)-.5);
			p *= 2.0;
			f *= 2.0;
		}
		p *= p;
		return sqrt(p+p.yzx)/f-.002;
	}

	void main( void ) {
		vec3 dir = normalize(vPos);
		vec3 pos = positionOffset/100.;

		// vec3 dir = normalize(vPos+positionOffset); // cooler zoom fail
		// vec3 pos = vec3(0, 0,time/4.+vPos.z/600.*0.5); // vorbei ziehen lassen

		vec3 color = vec3(0);
		for (int i = 0; i < MAXITER; i++) {
			vec3 f2 = field(pos);
			float f = min(min(f2.x,f2.y),f2.z);
			
			pos += dir*f;
			color += float(MAXITER-i)/(f2+.001);
		}
		vec3 color3 = vec3(1.-1./(1.+color*(.09/float(MAXITER*MAXITER))));
		color3 *= color3;
		gl_FragColor = vec4(color3.r*R_FACTOR, color3.g*G_FACTOR, color3.b*B_FACTOR,1.);
	}    
    `,

};


export default class Room extends THREE.ShaderMaterial {

    constructor() {

        let uniforms = {
            time: { value: 0 },
			positionOffset: { value: new THREE.Vector3() },
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        }

        super({
            uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
        })
    }
}



