import * as THREE from "three"
import { AmbientLight, Clock, Mesh, MeshPhongMaterial, Object3D, PerspectiveCamera, Scene, SphereBufferGeometry, Vector3, WebGLRenderer } from 'three'
import { resize } from '../../../libmy/utils/three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import NoiseFog from "./NoiseFog"
import NoiseFog2 from "./NoiseFog2"



const renderer = new WebGLRenderer({ antialias: true })
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)


const scene = new Scene()

const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.001, 10000)
camera.position.z = -30
camera.position.y = 15
scene.add(camera)
window.addEventListener('resize', () => { resize(renderer, camera) }, false);

const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new AmbientLight(0x404040, 1);
scene.add(ambientLight);


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


export { scene }
import "./forest"

const fog = new NoiseFog(scene, new THREE.FogExp2(0x444444, 0.005))




requestAnimationFrame(update)
function update() {
    requestAnimationFrame(update)

    fog.update()
    renderer.render(scene, camera)
}


