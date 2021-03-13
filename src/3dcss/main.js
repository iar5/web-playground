import * as THREE from '../../lib/three/build/three.module.js'
import { OrbitControls } from '../../lib/three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer, CSS3DObject } from '../../lib/three/examples/jsm/renderers/CSS3DRenderer.js'

/**
 * https://codepen.io/Fyrestar/pen/QOXJaJ](https://codepen.io/Fyrestar/pen/QOXJaJ).
 * Idee
 * canvas über html legen und an entsprechenden stellen transparent sein
 * wenn etwa html text bearbeoten: canvas pointer events durchlassen
 */
 


const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x000000, 0)
document.getElementById("html3D").appendChild(renderer.domElement)

const cssRenderer = new CSS3DRenderer({antialias: true})
cssRenderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById("webgl").appendChild(cssRenderer.domElement)


const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.001, 10000)
camera.position.z = 3

const controls = new OrbitControls(camera, renderer.domElement)
controls.maxPolarAngle = THREE.MathUtils.degToRad(90)
controls.minDistance = 0.1
controls.maxDistance = 100
controls.target.set(0, 0.5, 0)
controls.update()

const scene = new THREE.Scene()



      
let htmlElement = document.getElementById("htmlSrc")
htmlElement.style.display = "unset"

let group = new THREE.Group();
let s = 0.01
group.scale.set(s, s, s) 
scene.add(group)

// html
let css3dObject = new CSS3DObject(htmlElement);
group.add(css3dObject);


// canvas chop plane
let material = new THREE.MeshPhongMaterial({opacity: 0, color: new THREE.Color("black"), blending: THREE.NoBlending, side: THREE.DoubleSide });
let geometry = new THREE.BoxBufferGeometry(htmlElement.clientWidth,  htmlElement.clientHeight, 0.1);
let mesh = new THREE.Mesh(geometry, material);
group.add(mesh);

// back plate
material = new THREE.MeshBasicMaterial({opacity: 1, color: new THREE.Color("red")});
geometry = new THREE.BoxBufferGeometry(htmlElement.clientWidth+2,  htmlElement.clientHeight+2, 0.1);
mesh = new THREE.Mesh(geometry, material);
mesh.position.z = -1
group.add(mesh);

// sphere davor
material = new THREE.MeshBasicMaterial({opacity: 1, color: new THREE.Color("green")});
geometry = new THREE.SphereBufferGeometry(htmlElement.clientWidth/4);
mesh = new THREE.Mesh(geometry, material);
group.add(mesh);




update()
function update() {
    requestAnimationFrame(update)
    renderer.render(scene, camera)    
    cssRenderer.render(scene, camera);
}

