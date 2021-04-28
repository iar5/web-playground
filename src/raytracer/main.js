import * as THREE from '../../lib/three/build/three.module.js';


var isUserInteracting = false
var onMouseDownMouseX = 0
var onMouseDownMouseY = 0
var lon = 0, onMouseDownLon = 0
var lat = 0, onMouseDownLat = 0
var phi = 0, theta = 0

var container = document.getElementById( 'container' );

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
camera.target = new THREE.Vector3( 0, 0, 0 );

var scene = new THREE.Scene();

var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
geometry.scale( - 1, 1, 1 ); // invert the geometry on the x-axis so that all of the faces point inward

var texture = new THREE.TextureLoader().load("raytracerspace.jpg");
var material = new THREE.MeshBasicMaterial( {map: texture } );
var mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );




const startTimeStamp = Date.now()
const startAnimDuration = 2500;
const threashold = 800
const startAnimSpeed = 0.3

{(function update() {
    requestAnimationFrame(update);

    let now = Date.now()
    let tDiff = now - startTimeStamp

    if (isUserInteracting === false && tDiff < startAnimDuration) {
        if(tDiff > threashold){
            lon += startAnimSpeed *  (1 - (tDiff - threashold) / (startAnimDuration - threashold))
        }
        else{
            lon += startAnimSpeed
        }
     }
 
     lat = Math.max( - 85, Math.min( 85, lat ) );
     phi = THREE.Math.degToRad( 90 - lat );
     theta = THREE.Math.degToRad( lon );
 
     const r = 200
     camera.target.x = r * Math.sin( phi ) * Math.cos( theta );
     camera.target.y = r * Math.cos( phi );
     camera.target.z = r * Math.sin( phi ) * Math.sin( theta );
     camera.lookAt( camera.target );
     
     camera.position.copy( camera.target ).negate(); // distortion
 
     renderer.render( scene, camera );
})()}








document.addEventListener( 'mousedown', onPointerStart, false );
document.addEventListener( 'mousemove', onPointerMove, false );
document.addEventListener( 'mouseup', onPointerUp, false );

document.addEventListener( 'touchstart', onPointerStart, false );
document.addEventListener( 'touchmove', onPointerMove, false );
document.addEventListener( 'touchend', onPointerUp, false );

document.addEventListener( 'wheel', onDocumentMouseWheel, false );

document.addEventListener( 'dragover', function ( event ) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
}, false );

document.addEventListener( 'dragenter', function () {
    document.body.style.opacity = 0.5;
}, false );

document.addEventListener( 'dragleave', function () {
    document.body.style.opacity = 1;
}, false );

document.addEventListener( 'drop', function ( event ) {
    event.preventDefault();
    var reader = new FileReader();

    reader.addEventListener( 'load', function ( event ) {
        material.map.image.src = event.target.result;
        material.map.needsUpdate = true;
    }, false );
    reader.readAsDataURL( event.dataTransfer.files[ 0 ] );

    document.body.style.opacity = 1;

}, false );

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onPointerStart( event ) {
    isUserInteracting = true;

    var clientX = event.clientX || event.touches[ 0 ].clientX;
    var clientY = event.clientY || event.touches[ 0 ].clientY;

    onMouseDownMouseX = clientX;
    onMouseDownMouseY = clientY;

    onMouseDownLon = lon;
    onMouseDownLat = lat;
}

function onPointerMove( event ) {
    if ( isUserInteracting === true ) {
        var clientX = event.clientX || event.touches[ 0 ].clientX;
        var clientY = event.clientY || event.touches[ 0 ].clientY;
        lon = ( onMouseDownMouseX - clientX ) * 0.1 + onMouseDownLon;
        lat = ( clientY - onMouseDownMouseY ) * 0.1 + onMouseDownLat;
    }
}

function onPointerUp() {
    isUserInteracting = false;
}

function onDocumentMouseWheel( event ) {
    var fov = camera.fov + event.deltaY * 0.05;
    camera.fov = THREE.Math.clamp( fov, 10, 75 );
    camera.updateProjectionMatrix();
}