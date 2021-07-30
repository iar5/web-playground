import * as THREE from 'three'
import { Clock, CylinderBufferGeometry, MeshStandardMaterial, ObjectLoader, PlaneBufferGeometry } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Water from "./Water"
import { resize } from "../../../libmy/utils/three"
import Stats from 'stats-js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';




//////
// Materials
////
const textureLoader = new THREE.TextureLoader()

var blueTiles = new THREE.MeshStandardMaterial({
    map: textureLoader.load("/textures/tiles/blueTiles.jpg", function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 5);
    }),
    bumpMap: textureLoader.load("/textures/tiles/blueTilesBump.jpg", function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 5);
    }),
    bumpScale: .5,
    metalness: .2,
    roughness: .1
});
var whiteTiles = new THREE.MeshStandardMaterial({
    map: textureLoader.load("/textures/tiles/whiteTiles.jpg", function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(15, 15);
    }),
    bumpMap: textureLoader.load("/textures/tiles/whiteTilesBump.jpg", function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(15, 15);
    }),
    bumpScale: .5,
    metalness: .8,
    roughness: 0.5,
    refletive: 1
});
var blackMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color(0x000000),
})







/////////
// Global variables
////
var width = window.innerWidth
var height = window.innerHeight

var renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setClearColor("#000000");
renderer.setSize(width, height);
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement)
renderer.toneMapping = THREE.ACESFilmicToneMapping
const clock = new Clock()

const stats = new Stats();
document.body.appendChild(stats.dom);

//////
// Camera and controls
////
var camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
camera.position.z = 15;
camera.position.y = 5;

var controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, camera.position.y/2, 0);
controls.maxPolarAngle = THREE.MathUtils.degToRad(90)
controls.minDistance = 0.1
controls.maxDistance = 100
controls.update();

var scene = new THREE.Scene();

window.addEventListener("resize", resize(renderer, camera) );
resize(renderer, camera)


const cylinder = new THREE.Mesh(new CylinderBufferGeometry(2, 2, 2.5, 24), new MeshStandardMaterial({color: "white"}))
cylinder.translateY(1.25)
scene.add(cylinder)

const water = new Water(20, 20, 5)
scene.add(water)
var wt = 0


new OBJLoader().load("/models/restgirl/opti.obj", (model) => {
    model.position.set(0, 4.3, 0)
    model.scale.set(0.001, 0.001, 0.001)
    scene.add(model)
})

//////
// Game Loop
////
renderer.setAnimationLoop(() => {
    wt += clock.getDelta()
    if(wt >= 2){
        water.drop(Math.random(), Math.random(), Math.random())
        wt = 0
    }  
    water.renderEnvMapUpdate(camera, renderer, scene)
    water.update()   
    renderer.render(scene, camera);
    stats.update();
});



var loader = new ObjectLoader()
/*
loader.load('/models/restgirl/opti.obj', function (object) {
    object.traverse(child => {
        if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
        }
    })
    let scale = 1
    object.scale.set(scale, scale, scale);
    object.rotateY(THREE.MathUtils.degToRad(180))
    scene.add(object);
});
*/



//////
// Room
////
var walls = new THREE.Group().translateY(5);
var wall = new THREE.Mesh(new THREE.PlaneGeometry(20, 10, 1, 1), blueTiles)
walls.add(wall.clone().translateZ(-10))
walls.add(wall.clone().translateZ(10).rotateY(THREE.MathUtils.degToRad(180)))
walls.add(wall.clone().translateX(-10).rotateY(THREE.MathUtils.degToRad(90)))
walls.add(wall.clone().translateX(10).rotateY(THREE.MathUtils.degToRad(-90)))
scene.add(walls);

var bottom = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 1, 1), whiteTiles)
    .rotateX(THREE.MathUtils.degToRad(-90))
bottom.castShadow = true
bottom.receiveShadow = true
scene.add(bottom);

var top = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 1, 1), blackMaterial)
    .translateY(10)
    .rotateX(THREE.MathUtils.degToRad(90))
top.castShadow = true
top.receiveShadow = true
scene.add(top);


//////
// Lights
////
var pointLightR = new THREE.PointLight(0xffffff, 0.5, 20);
pointLightR.position.set(5, 9, -5)
pointLightR.castShadow = true;
scene.add(pointLightR);

var pointLightL = pointLightR.clone()
pointLightL.position.x *= -1
scene.add(pointLightL);

var ambient = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambient)

var dir = new THREE.DirectionalLight(0xffffff, 0.05)
scene.add(dir)

var am = new THREE.AmbientLight(0xaaccff, 0.05)
scene.add(am)


