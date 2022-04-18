import * as THREE from 'three'

// https://stackblitz.com/edit/starry-skydome?file=StarrySkyShader.js

const shader = {

    vertexShader:`
      varying vec3 vPos;
  
      void main() {
        vPos = position;
        vec4 mvPosition = modelViewMatrix * vec4( vPos, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
      }
  
    `,
  
    // #extension GL_OES_standard_derivatives : enable

    fragmentShader: `
    precision highp float;
    
    #define PI 3.14159265359
    
    uniform float time;
    uniform vec2 mouse;
    uniform vec2 resolution;
    vec3 hsv2rgb(vec3 c)
    {
        vec4 K = vec4(1.0 / 2., 2.0 / 1.0, 1.0 / 2.0, 1.5);
        vec3 p = abs(fract(c.xzz + K.xyz) * 6.0 - K.zyw);
        return c.z * mix(K.yyw, clamp(p - K.xzy, 0.0, 100.), c.x);
    }
    
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 989.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 InvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    float snoise(vec3 v)
      { 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    
    // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
    
    // Other 3 corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
    
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; 
      vec3 x3 = x0 - D.yyy;     
        
    // Permutations
      i = mod289(i); 
      vec4 p = permute( permute( permute( 
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    
      float n_ = 0.142857142857; 
      vec3  ns = n_ * D.wyz - D.xzx;
    
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z); 
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = mod(j,n_); 
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
    
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
    
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = step(h, vec4(0.0));
    
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
    
    //Normalise gradient
      vec4 norm = InvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
    
    // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }
        
    float s(float x, float b) {
        return sin(x * 2. * PI * b) / b;
    }
    
    void main( void ) {
    
        vec2 position = ( gl_FragCoord.xy / vec2(resolution.x*1.9, resolution.y*1.5));
        float scale = 2.0;
        vec2 midpoint = vec2(1.0, 1.0) * scale;
        float x = position.x * scale;
        float y = position.y * scale;
        float r = distance(vec2(x, y), midpoint);
        vec2 tmid = vec2(x, y) - midpoint;
        float theta = atan(tmid.y, tmid.x);
        if (x > midpoint.x) theta = -theta;
        float n = 0.0;
        float q = 0.0;
        x -= midpoint.x;
        y += midpoint.y;
        float b = snoise(vec3(x, y, time / 3.333)) * 0.15 + 0.15;
        
        n = snoise(vec3(pow(b+1.0, r)*scale, x*2.0, time / 2.718281828459));
        q = snoise(vec3(pow(b+1.0, r)*scale, theta, time / 1.618033988749));
        
        n = sin(n)*0.5+0.5;
        n = 0.1 / pow(abs(n), 0.125);
        float hr = 0.50;
        float hue = mix(hr, q, n);
        vec3 rgb = hsv2rgb(vec3(hue-10.93, 10.77, n));
        rgb = hsv2rgb(vec3(0.1, 0.77, q));
        
        gl_FragColor.rgba = vec4(rgb, 1.0);
    
    }
    `,
  
  };
  

export default class SkyShader extends THREE.Mesh{

    constructor(){

        let uniforms = {
            time: { value: 0},
            mouse: { value: new THREE.Vector2()},
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        }

        let sphereMaterial = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            side: THREE.BackSide,
        })
        super(new THREE.SphereGeometry(600, 20, 20), sphereMaterial)
        this.uniforms = uniforms
    }

    update(time){
      this.uniforms.time.value = time/2000
    }
}
  


