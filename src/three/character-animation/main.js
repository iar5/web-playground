import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from '../../../lib/stats.module.js'

import { create, update} from './AnimationViewer.js';


// TODO in rvaespace project intergeiren

let renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );
window.addEventListener( 'resize', onWindowResize, false );

let stats = new Stats();
document.body.appendChild( stats.dom );

let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 1, 2, - 3 );
camera.lookAt( 0, 1, 0 );

let controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, camera.position.y/2, 0);
controls.maxPolarAngle = THREE.MathUtils.degToRad(90)
controls.minDistance = 0.1
controls.maxDistance = 100
controls.update();

let scene = new THREE.Scene();
scene.background = new THREE.Color( 0xa0a0a0 );
scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );

var dirLight = new THREE.DirectionalLight( 0xffffff );
dirLight.position.set( - 3, 10, - 10 );
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = - 2;
dirLight.shadow.camera.left = - 2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add( dirLight );

var ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
ground.rotation.x = - Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);


create(scene)

requestAnimationFrame(animate);



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    update()
    stats.update();
    renderer.render( scene, camera );
}