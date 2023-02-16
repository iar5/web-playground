import * as THREE from 'three'
import { Clock, CylinderBufferGeometry, MeshStandardMaterial, ObjectLoader, PlaneBufferGeometry } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Water from "./Water"
import { resize } from "../../../libmy/utils/three"
import * as Stats from 'stats-js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';




/////////
// General 
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

var scene = new THREE.Scene();


var camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
camera.position.z = 15;
camera.position.y = 5;

var controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, camera.position.y / 2, 0);
controls.maxPolarAngle = THREE.MathUtils.degToRad(90)
controls.minDistance = 0.1
controls.maxDistance = 100
controls.update();

window.addEventListener("resize", resize(renderer, camera));
resize(renderer, camera)

const stats = new Stats();
document.body.appendChild(stats.dom);



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
var whiteTiles = new THREE.MeshPhysicalMaterial({
    map: textureLoader.load("/textures/tiles/whiteTiles.jpg", function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(15, 15);
    }),
    bumpMap: textureLoader.load("/textures/tiles/whiteTilesBump.jpg", function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(15, 15);
    }),
    bumpScale: .5,
    metalness: .2,
    roughness: 0.4,
    reflectivity: 1,
    clearcoat: 0.5
});
var blackMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color(0x000000),
})


//////
// Room
////
const H = 12
var walls = new THREE.Group().translateY(H / 2);
var wall = new THREE.Mesh(new THREE.PlaneGeometry(20, H, 1, 1), blueTiles)
walls.add(wall.clone().translateZ(-10))
walls.add(wall.clone().translateZ(10).rotateY(THREE.MathUtils.degToRad(180)))
walls.add(wall.clone().translateX(-10).rotateY(THREE.MathUtils.degToRad(90)))
walls.add(wall.clone().translateX(10).rotateY(THREE.MathUtils.degToRad(-90)))
scene.add(walls);

var bottom = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 1, 1), whiteTiles)
    .rotateX(THREE.MathUtils.degToRad(-90))
scene.add(bottom);

// var top = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 1, 1), whiteTiles)
//     .translateY(12)
//     .rotateX(THREE.MathUtils.degToRad(90))
// scene.add(top);


//////
// Model
////
const cylinder = new THREE.Mesh(new CylinderBufferGeometry(2, 2, 2.5, 24), new MeshStandardMaterial({ color: "white" }))
cylinder.translateY(1.25)
scene.add(cylinder)

new OBJLoader().load("/models/restgirl/opti.obj", (model) => {
    model.position.set(0, 4.3, 0)
    model.scale.set(0.001, 0.001, 0.001)
    scene.add(model)
})


const water = new Water(20, 20, 5)
scene.add(water)
var wt = 0



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






//////
// Game Loop
////
renderer.setAnimationLoop(() => {
    wt += clock.getDelta()
    if(wt >= 0.1){
        water.drop(Math.random(), Math.random(), Math.random())
        wt = 0
    }  
    water.update()   
    renderer.render(scene, camera);
    stats.update();
});




