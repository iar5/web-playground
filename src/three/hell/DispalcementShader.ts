import * as THREE from "three"
import { Mesh, OrthographicCamera, Plane, PlaneBufferGeometry, Scene, SphereBufferGeometry, Vector3, WebGLBufferRenderer, WebGLRenderer } from "three";


const vertexShader = /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`


const fragmentShader = `
precision mediump float;

varying vec2 vUv;
uniform float time;

const float waves = 19.;

// triangle wave from 0 to 1
float wrap(float n) {
  return abs(mod(n, 2.)-1.)*-1. + 1.;
}

// creates a cosine wave in the plane at a given angle
float wave(float angle, vec2 point) {
  float cth = cos(angle);
  float sth = sin(angle);
  return (cos (cth*point.x + sth*point.y) + 1.) / 2.;
}

// sum cosine waves at various interfering angles
// wrap values when they exceed 1
float quasi(float interferenceAngle, vec2 point) {
  float sum = 0.;
  for (float i = 0.; i < waves; i++) {
    sum += wave(3.1416*i*interferenceAngle, point);
  }
  return wrap(sum);
}

void main() {
  float b = quasi(time*0.02, (vUv-0.5)*2.);
  vec4 c1 = vec4(0.0,0.,0.2,1.);
  vec4 c2 = vec4(1.5,0.7,0.,1.);
  gl_FragColor = mix(c1,c2,b);
}`


const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2() }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
});



const renderTarget = new THREE.WebGLRenderTarget(128, 128);

const scene = new Scene()
const camera = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -0.5, 0.5)
const plane = new Mesh(new PlaneBufferGeometry(1, 1), material)
scene.add(plane)



function renderDisplacement(renderer: THREE.WebGLRenderer){
  material.uniforms.time.value = performance.now()/1000

  renderer.setRenderTarget(renderTarget);
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);
}


const displacementMap = renderTarget.texture
export { renderDisplacement, displacementMap}
