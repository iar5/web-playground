import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

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
controls.update()

const scene = new THREE.Scene()


const pl = new THREE.PointLight(0x00ff00)
scene.add(pl)
pl.position.set(2, 2, 2)
const pl2 = new THREE.PointLight(0xffff00)
scene.add(pl2)
pl2.position.set(-2, -2, -2)

      
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
let material = new THREE.MeshLambertMaterial({opacity: 0, color: new THREE.Color("black"), blending: THREE.NoBlending, side: THREE.DoubleSide });
let geometry = new THREE.BoxBufferGeometry(htmlElement.clientWidth,  htmlElement.clientHeight, 0.1);
let mesh = new THREE.Mesh(geometry, material);
group.add(mesh);

// back plate
material = new THREE.MeshLambertMaterial({opacity: 1, color: new THREE.Color("red")});
geometry = new THREE.BoxBufferGeometry(htmlElement.clientWidth+2,  htmlElement.clientHeight+2, 0.1);
mesh = new THREE.Mesh(geometry, material);
mesh.position.z = -1
group.add(mesh);

// sphere davor
material = new THREE.MeshLambertMaterial({opacity: 1, color: new THREE.Color("white")});
geometry = new THREE.SphereBufferGeometry(htmlElement.clientWidth/4);
let sphereMesh = new THREE.Mesh(geometry, material);
group.add(sphereMesh);




update()
function update() {
    requestAnimationFrame(update)
    renderer.render(scene, camera)    
    cssRenderer.render(scene, camera);
    sphereMesh.position.x = Math.sin(Date.now()/1000)* 100
}

