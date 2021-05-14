import * as THREE from "three"
import { AmbientLight, Clock, Mesh, MeshPhongMaterial, Object3D, PerspectiveCamera, Scene, SphereBufferGeometry, Vector3, WebGLRenderer } from 'three'
import { resize } from '../../../libmy/utils.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import NoiseFog from "./NoiseFog"



const renderer = new WebGLRenderer({ antialias: true })
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)


const scene = new Scene()

const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.001, 10000)
camera.position.z = -3
camera.position.y = 3
scene.add(camera)
window.addEventListener('resize', () => { resize(renderer, camera) }, false);

const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new AmbientLight(0x404040, 1);
scene.add(ambientLight);


// Ground
const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

for (let i = 0; i < 100; i++) {
    let sphereMat = new MeshPhongMaterial({ color: "red" })
    let sphereGeo = new SphereBufferGeometry(1 + Math.random() - 0.5)
    let sphereMesh = new Mesh(sphereGeo, sphereMat)
    sphereMesh.position.set(100 * (Math.random() - 0.5), 0, 100 * (Math.random() - 0.5))
    scene.add(sphereMesh)
}


const light = new THREE.DirectionalLight(0xffffff, 1);
scene.add(light);
light.position.set(5, 10, 0)
light.castShadow = true;
light.shadow.mapSize.width = 512
light.shadow.mapSize.height = 512;
light.shadow.camera.left = -2
light.shadow.camera.right = 2
light.shadow.camera.top = 2
light.shadow.camera.bottom = -2
light.shadow.camera.near = 0.5
light.shadow.camera.far = 100


let fog = new NoiseFog(scene)




requestAnimationFrame(update)
function update() {
    requestAnimationFrame(update)

    fog.update()
    renderer.render(scene, camera)
}


