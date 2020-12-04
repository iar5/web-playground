import * as THREE from '../../lib/three/build/three.module.js'
import { OrbitControls } from '../../lib/three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer } from '../../lib/three/examples/jsm/renderers/CSS3DRenderer.js.js'

/**
 * Idee
canvas über html und transparent an entsprechenden stellen
canvas pointer events weiter geben an html mit css 
 */



var renderer = new CSS3DRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
document.getElementById("webgl").appendChild(renderer.domElement)

var camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.001, 10000)
camera.position.z = 3
camera.position.y = 1

var controls = new OrbitControls(camera, renderer.domElement)
controls.maxPolarAngle = THREE.MathUtils.degToRad(90)
controls.minDistance = 0.1
controls.maxDistance = 100
controls.target.set(0, 0.5, 0)
controls.update()

var scene = new THREE.Scene()

var ambientLight = new THREE.AmbientLight('rgb(255,255,255)', 0.5) 
scene.add(ambientLight)

      
let htmlElement = document.getElementById("html3d")
htmlElement.style.display = "unset"
let obj = new THREE.Object3D();
let s = 0.008
obj.scale.set(s, s, s) 
tvGroup.add(obj)

var css3dObject = new CSS3DObject(htmlElement);
obj.add(css3dObject);

// chop plane
var material = new THREE.MeshPhongMaterial({opacity: 0, color: new THREE.Color("black"), blending: THREE.NoBlending, side: THREE.DoubleSide });
var geometry = new THREE.BoxBufferGeometry(htmlElement.clientWidth,  htmlElement.clientHeight, 0.1);
var mesh = new THREE.Mesh(geometry, material);
obj.add(mesh);

material = new THREE.MeshBasicMaterial({opacity: 1, color: new THREE.Color("black")});
geometry = new THREE.BoxBufferGeometry(htmlElement.clientWidth+2,  htmlElement.clientHeight+2, 0.1);
mesh = new THREE.Mesh(geometry, material);
mesh.position.z = -2
obj.add(mesh);

material = new THREE.MeshBasicMaterial({opacity: 1, color: new THREE.Color("white"), wireframe: true});
geometry = new THREE.BoxBufferGeometry(htmlElement.clientWidth-2,  htmlElement.clientHeight-2, 0.1);
mesh = new THREE.Mesh(geometry, material);
mesh.position.z = -1
obj.add(mesh);





update()
function update() {
    requestAnimationFrame(update)
    renderer.render(scene, camera)    
}

