import * as THREE from '/lib/three/build/three.module.js'
import { OBJLoader } from '/lib/three/examples/jsm/loaders/OBJLoader.js'
import { OrbitControls } from '/lib/three/examples/jsm/controls/OrbitControls.js'



//////
// Global variables
////
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#000000");
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

var textureLoader = new THREE.TextureLoader();
var objLoader = new OBJLoader();
var scene = new THREE.Scene();
var camera;


//////
// Cameras
////
var camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.001, 10000)
camera.position.z = 15;
camera.position.y = 2;


//////
// Controls
////
var controls = new OrbitControls(camera, renderer.domElement);


//////
// Lights
////
var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5).translateY(10);
var pointLight = new THREE.PointLight(0xffffff, 1, 30).translateY(15);
scene.add(hemiLight);
scene.add(pointLight);


//////
// Scenography
////
var sphereN = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshNormalMaterial({flatShading: true}));
sphereN.position.y = sphereN.geometry.parameters.radius;
scene.add(sphereN);

var sphereL = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshLambertMaterial({color: 'red'}));
sphereL.position.x = -2;
sphereL.position.y = sphereL.geometry.parameters.radius;

scene.add(sphereL);

var blueTiles = new THREE.MeshStandardMaterial({
    map: textureLoader.load("/assets/textures/blueTiles.jpg", function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(8, 3);
    }),
    bumpMap: textureLoader.load("/assets/textures/blueTilesBump.jpg", function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(8, 3);
    }),
    bumpScale: .5,
    metalness: .2,
    roughness: .1
});
var whiteTiles = new THREE.MeshStandardMaterial({
    map: textureLoader.load("/assets/textures/whiteTiles.jpg", function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(12, 12);
    }),
    bumpMap: textureLoader.load("/assets/textures/whiteTilesBump.jpg", function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(12, 12);
    }),
    bumpScale: .5,
    metalness: .3,
    roughness: 0
});

var wall = new THREE.Group().translateY(2.5);
wall.add(new THREE.Mesh(new THREE.PlaneGeometry(20, 5, 200, 50), blueTiles).translateZ(-10));
wall.add(new THREE.Mesh(new THREE.PlaneGeometry(20, 5, 200, 50), blueTiles).translateZ(10).rotateY(THREE.MathUtils.degToRad(180)));
wall.add(new THREE.Mesh(new THREE.PlaneGeometry(20, 5, 200, 50), blueTiles).translateX(-10).rotateY(THREE.MathUtils.degToRad(90)));
wall.add(new THREE.Mesh(new THREE.PlaneGeometry(20, 5, 200, 50), blueTiles).translateX(10).rotateY(THREE.MathUtils.degToRad(-90)));
scene.add(wall);

var bottom = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 200, 20), whiteTiles).rotateX(THREE.MathUtils.degToRad(-90));
scene.add(bottom);


objLoader.load('/assets/models/restgirl/opti.obj', function (object) {
 
        object.scale.set(0.001, 0.001, 0.001);
        object.position.x = 2;
        object.position.y = 1.8;
        object.castShadow = true;
        scene.add(object);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened');
    }
);



animate();
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
})



