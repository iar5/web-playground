import * as THREE from '/lib/three/build/three.module.js'
import { FBXLoader } from '/lib/three/examples/jsm/loaders/FBXLoader.js'
import { OrbitControls } from '/lib/three/examples/jsm/controls/OrbitControls.js'




/**
 * setup and render the described scene 
 * @param {HTMLCanvasElement} canvas target canvas to render the scene
 */

const TEXLOADER  = new THREE.TextureLoader()
const FBXLOADER = new FBXLoader()

////////////////
// SETUP
////////////////
var renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
document.body.appendChild(renderer.domElement)

var camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.001, 10000)
camera.position.z = 3
camera.position.y = 1

var controls = new OrbitControls(camera, renderer.domElement)
controls.maxPolarAngle = THREE.MathUtils.degToRad(90)
controls.minDistance = 0.1
controls.maxDistance = 100
controls.target.set(0, 0.5, 0)
controls.update()

var clock = new THREE.Clock();


////////////////
// SCENE
////////////////
var scene = new THREE.Scene()

var ambientLight = new THREE.AmbientLight('rgb(255,255,255)', 0.5) 
scene.add(ambientLight)

var spotLight = new THREE.SpotLight(0xffffff, 1)
spotLight.position.set(0.5, 3, 2)
spotLight.angle = THREE.MathUtils.degToRad(30)
spotLight.castShadow = true
spotLight.penumbra = 0.5
spotLight.distance = 10
spotLight.decay = 2
spotLight.shadow.camera.near = 0.1
spotLight.shadow.camera.far = 100 // performance
scene.add(spotLight)
//scene.add(new THREE.CameraHelper(spotLight.shadow.camera))

var ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), new THREE.MeshLambertMaterial({color: 'rgb(150, 255, 150)'}))
ground.rotateX(THREE.MathUtils.degToRad(90))
ground.material.side = THREE.DoubleSide
ground.receiveShadow = true
scene.add(ground)

var skytexture = TEXLOADER.load('/assets/img/360/sky16.bmpf33d334a-3dfd-4a67-9131-9721af012d32Zoom.jpg')
var skymesh = new THREE.Mesh(new THREE.SphereGeometry(100, 25, 25), new THREE.MeshBasicMaterial({map: skytexture}))
skymesh.rotateY(THREE.MathUtils.degToRad(-90))
skymesh.material.side = THREE.BackSide
scene.add(skymesh)

var mixer
FBXLOADER.load('/assets/models/Golf Drive.fbx', object => {

    mixer = new THREE.AnimationMixer(object)
    mixer.clipAction(object.animations[0]).play()
                
    object.traverse(child => {
        if (child.isMesh){
            child.castShadow = true
            child.receiveShadow = true
        }
    })
    object.scale.set(0.01, 0.01, 0.01)
    scene.add(object)
})


update()
function update() {
    requestAnimationFrame(update)
    if (mixer) mixer.update(clock.getDelta())
    renderer.render(scene, camera)    
}

