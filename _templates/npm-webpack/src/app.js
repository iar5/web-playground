import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

document.addEventListener("DOMContentLoaded", function(event) {

    const canvas = document.getElementById("canvas")
    var width = canvas.clientWidth
    var height = canvas.clientHeight;

    var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
    });
    renderer.setClearColor("#000000");
    renderer.setSize(width, height);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;

    
 

    
    var camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.z = 5;
    camera.position.y = 2;

    var controls = new OrbitControls(camera, canvas);
    controls.target.set(0, camera.position.y/2, 0);
    controls.maxPolarAngle = THREE.MathUtils.degToRad(90)
    controls.minDistance = 0.1
    controls.maxDistance = 100
    controls.update();

    var scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 1000, 2000 );

    let hemilight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemilight.position.set( 0, 200, 0 );
    scene.add(hemilight);

    let directlight = new THREE.DirectionalLight(0xffffff);
    directlight.position.set( 0, 200, 100 );
    directlight.castShadow = true;
    directlight.shadow.camera.top = 180;
    directlight.shadow.camera.bottom = - 100;
    directlight.shadow.camera.left = - 120;
    directlight.shadow.camera.right = 120;
    scene.add(directlight);

    // Ground
    const mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(5, 5), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );

    const grid = new THREE.GridHelper(5, 5, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );




    var fbxLoader = new FBXLoader()
    var clock = new THREE.Clock();

    var mixer
    fbxLoader.load('models/Belly Dance.fbx', function (object) {
        mixer = new THREE.AnimationMixer(object)
        mixer.clipAction(object.animations[0]).play()
                    
        object.traverse(child => {
            if (child.isMesh){
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        let scale = 0.01
        object.position.set(0, 0.1, 0)
        object.scale.set(scale, scale, scale);
        scene.add(object);    
    });







    renderer.setAnimationLoop(function () { 
        renderer.render(scene, camera);

        const delta = clock.getDelta()
        if(mixer) mixer.update(delta)
    })
 
    window.addEventListener("resize", function () {
        width = window.innerWidth;
        height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
})