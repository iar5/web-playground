import * as THREE from '../../lib/three/build/three.module.js'
import { OrbitControls } from '../../lib/three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from '../../lib/three/examples/jsm/loaders/GLTFLoader.js'
import { DecalGeometry } from '../../lib/three/examples/jsm/geometries/DecalGeometry.js';


let renderer, scene, camera
let mesh;
let raycaster;
let line;

const intersection = {
    intersects: false,
    point: new THREE.Vector3(),
    normal: new THREE.Vector3()
};
const mouse = new THREE.Vector2();
const intersects = [];

const textureLoader = new THREE.TextureLoader();
const decalDiffuse = textureLoader.load( './sticker.png' );
const decalNormal = textureLoader.load( './sticker.png' );

const decalMaterial = new THREE.MeshPhongMaterial( {
    specular: 0x444444,
    map: decalDiffuse,
    normalMap: decalNormal,
    normalScale: new THREE.Vector2( 1, 1 ),
    shininess: 30,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: - 4,
    wireframe: false
} );

const decals = [];
let mouseHelper;
const position = new THREE.Vector3();
const orientation = new THREE.Euler();
const size = new THREE.Vector3( 10, 10, 10 );

const params = {
    minScale: 10,
    maxScale: 20,
    rotate: true,
    clear: function () {

        removeDecals();

    }
};

window.addEventListener( 'load', init );

function init() {

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild(renderer.domElement)


    

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 120;

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 50;
    controls.maxDistance = 200;

    scene.add( new THREE.AmbientLight( 0x443333 ) );

    const dirLight1 = new THREE.DirectionalLight( 0xffddcc, 1 );
    dirLight1.position.set( 1, 0.75, 0.5 );
    scene.add( dirLight1 );

    const dirLight2 = new THREE.DirectionalLight( 0xccccff, 1 );
    dirLight2.position.set( - 1, 0.75, - 0.5 );
    scene.add( dirLight2 );

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );

    line = new THREE.Line( geometry, new THREE.LineBasicMaterial() );
    scene.add( line );

    loadLeePerrySmith();

    raycaster = new THREE.Raycaster();

    mouseHelper = new THREE.Mesh( new THREE.BoxBufferGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
    mouseHelper.visible = false;
    scene.add( mouseHelper );

    window.addEventListener( 'resize', onWindowResize, false );

    let moved = false;

    controls.addEventListener( 'change', function () {

        moved = true;

    } );

    window.addEventListener( 'pointerdown', function () {

        moved = false;

    }, false );

    window.addEventListener( 'pointerup', function ( event ) {

        if ( moved === false ) {

            checkIntersection( event.clientX, event.clientY );

            if ( intersection.intersects ) shoot();

        }

    } );

    window.addEventListener( 'pointermove', onPointerMove );

    function onPointerMove( event ) {

        if ( event.isPrimary ) {

            checkIntersection( event.clientX, event.clientY );

        }

    }

    function checkIntersection( x, y ) {

        if ( mesh === undefined ) return;

        mouse.x = ( x / window.innerWidth ) * 2 - 1;
        mouse.y = - ( y / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );
        raycaster.intersectObject( mesh, false, intersects );

        if ( intersects.length > 0 ) {

            const p = intersects[ 0 ].point;
            mouseHelper.position.copy( p );
            intersection.point.copy( p );

            const n = intersects[ 0 ].face.normal.clone();
            n.transformDirection( mesh.matrixWorld );
            n.multiplyScalar( 10 );
            n.add( intersects[ 0 ].point );

            intersection.normal.copy( intersects[ 0 ].face.normal );
            mouseHelper.lookAt( n );

            const positions = line.geometry.attributes.position;
            positions.setXYZ( 0, p.x, p.y, p.z );
            positions.setXYZ( 1, n.x, n.y, n.z );
            positions.needsUpdate = true;

            intersection.intersects = true;

            intersects.length = 0;

        } else {

            intersection.intersects = false;

        }

    }

    onWindowResize();
    animate();

}

function loadLeePerrySmith() {

    const loader = new GLTFLoader();

    loader.load( './LeePerrySmith/LeePerrySmith.glb', function ( gltf ) {

        mesh = gltf.scene.children[ 0 ];
        mesh.material = new THREE.MeshPhongMaterial( {
            specular: 0x111111,
            map: textureLoader.load( './LeePerrySmith/Map-COL.jpg' ),
            specularMap: textureLoader.load( './LeePerrySmith/Map-SPEC.jpg' ),
            normalMap: textureLoader.load( './LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg' ),
            shininess: 25
        } );

        scene.add( mesh );
        mesh.scale.set( 10, 10, 10 );

    } );

}

function shoot() {

    position.copy( intersection.point );
    orientation.copy( mouseHelper.rotation );

    if ( params.rotate ) orientation.z = Math.random() * 2 * Math.PI;

    const scale = params.minScale + Math.random() * ( params.maxScale - params.minScale );
    size.set( scale, scale, scale );

    const material = decalMaterial.clone();
    material.color.setHex( Math.random() * 0xffffff );

    const m = new THREE.Mesh( new DecalGeometry( mesh, position, orientation, size ), material );

    decals.push( m );
    scene.add( m );

}

function removeDecals() {

    decals.forEach( function ( d ) {

        scene.remove( d );

    } );

    decals.length = 0;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    renderer.render( scene, camera );

}