import * as THREE from "three"
import { AmbientLight, Clock, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'
import { resize } from '../../../libmy/utils.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


const clock = new Clock()

const renderer = new WebGLRenderer({ antialias: true })
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)


const scene = new Scene()
scene.fog = new THREE.FogExp2(0x00ff00, 0.0005)

const ambientLight = new AmbientLight(0x404040, 1);
scene.add(ambientLight);



const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.001, 10000)
camera.position.z = -3
camera.position.y = 3
camera.lookAt(new Vector3())
scene.add(camera)
window.addEventListener('resize', () => { resize(renderer, camera) }, false);

// Ground
const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(10, 10), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

const controls = new OrbitControls(camera, renderer.domElement);

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




requestAnimationFrame(update)
function update() {
    requestAnimationFrame(update)

    renderer.render(scene, camera)
}




