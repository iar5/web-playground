import * as THREE from '/lib/three/build/three.module.js'
import { OrbitControls } from '/lib/three/examples/jsm/controls/OrbitControls.js'
import createClub from './createClub.js'
import createPeople from './createPeople.js'

document.addEventListener("DOMContentLoaded", function(event) {

    /////////
    // Global variables
    ////
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

 

    

    //////
    // Camera and controls
    ////
    var camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.z = 15;
    camera.position.y = 5;

    var controls = new OrbitControls(camera, canvas);
    controls.target.set(0, camera.position.y/2, 0);
    controls.maxPolarAngle = THREE.MathUtils.degToRad(90)
    controls.minDistance = 0.1
    controls.maxDistance = 100
    controls.update();

    var scene = new THREE.Scene();

    var clubUpdate = createClub(scene, camera)
    var peopleUpdate = createPeople(scene)



    //////
    // Game Loop
    ////
    renderer.setAnimationLoop(function () { 

        clubUpdate()
        peopleUpdate()
        
        renderer.render(scene, camera);
    });




    //////
    // Window events
    ////
    window.addEventListener("resize", function () {
        width = window.innerWidth;
        height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
})