import * as THREE from "three"
import { camera, renderer, scene } from "./main";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import * as postprocessing from "postprocessing";


let circleGeo = new THREE.CircleGeometry(50, 16);
let circleMat = new THREE.MeshBasicMaterial({
    color: 0xffccaa,
    fog: false
 });
let circle = new THREE.Mesh(circleGeo, circleMat);
circle.position.set(0, 100, -500);
circle.scale.setX(1.2);
scene.add(circle);

const godrayPass = new postprocessing.EffectPass(camera, new postprocessing.GodRaysEffect(camera, circle, {
    resolutionScale: 1,
    density: 0.8,
    decay: 0.95,
    weight: 0.9,
    samples: 100
}));
godrayPass.renderToScreen = true;


/*const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 1
bloomPass.strength = 0.5
bloomPass.radius = 0.2
let f = gui.datgui.addFolder("Bloom")
f.add(bloomPass, "threshold", 0, 1, 0.01)
f.add(bloomPass, "strength", 0, 1, 0.01)
f.add(bloomPass, "radius", 0, 1, 0.01)
composer.addPass(bloomPass);
*/



const composer = new postprocessing.EffectComposer(renderer);
composer.addPass(new postprocessing.RenderPass(scene, camera));
composer.addPass(godrayPass);


export { composer }