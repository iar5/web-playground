import * as THREE from "../../lib/three/build/three.module.js"



function ShaderLoader(vertex_url, fragment_url, onLoad, onProgress, onError) {
    var vertex_loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
    vertex_loader.setResponseType('text');
    vertex_loader.load(vertex_url, function (vertex_text) {
      var fragment_loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
      fragment_loader.setResponseType('text');
      fragment_loader.load(fragment_url, function (fragment_text) {
        onLoad(vertex_text, fragment_text);
      });
    }, onProgress, onError);
  }

// ============================================================================

//const _textures = "programs/solarsystem/textures/"
//const _shaders = "programs/solarsystem/"
const  _textures = "./textures/"
const  _shaders = ""


ShaderLoader(_shaders + "solar.vert", _shaders + "solar.frag", (vertexShader, fragmentShader) => {

    var width = window.innerWidth;
    var height = window.innerHeight;
    var renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    renderer.setClearColor("#ffffff");
    renderer.setSize(width, height);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    document.body.append(renderer.domElement)

    var clock = new THREE.Clock();
    var scene = new THREE.Scene();
    var loader = new THREE.TextureLoader();
    var paused = false;
    var camera;

    ////////////////
    // Cameras
    //let r = width / height
    //let d = 100
    //var orbitCamera = new THREE.OrthographicCamera(-d, d, d/r, -d/r, 1, 10000);
    var orbitCamera = new THREE.PerspectiveCamera(25, width /height, 1, 10000);
    var topCamera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    topCamera.position.y = 300;
    topCamera.lookAt(new THREE.Vector3(0, 0, 0));
    camera = orbitCamera;

    ////////////////
    // Szene

    // Lava sun by https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Shader-Fireball.html
    var repeatT, repeatS;
    repeatT = repeatS = 4.0;

    var noiseTexture = new THREE.ImageUtils.loadTexture(_textures+'cloud.png');
    noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
    var noiseScale = 0.7;

    var blendTexture = new THREE.ImageUtils.loadTexture(_textures+'sun.jpg');
    blendTexture.wrapS = blendTexture.wrapT = THREE.RepeatWrapping;
    var blendSpeed = 0.01;
    var blendOffset = 0.25;

    var lavaTexture = new THREE.ImageUtils.loadTexture(_textures+'lava.jpg');
    lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;
    var baseSpeed = 0.01;

    // texture to determine normal displacement
    var bumpTexture = noiseTexture;
    var bumpSpeed = 0.05;
    var bumpScale = 15.0;

    window.customUniforms = {
        baseTexture: {type: "t", value: lavaTexture},
        baseSpeed: {type: "f", value: baseSpeed},
        repeatS: {type: "f", value: repeatS},
        repeatT: {type: "f", value: repeatT},
        noiseTexture: {type: "t", value: noiseTexture},
        noiseScale: {type: "f", value: noiseScale},
        blendTexture: {type: "t", value: blendTexture},
        blendSpeed: {type: "f", value: blendSpeed},
        blendOffset: {type: "f", value: blendOffset},
        bumpTexture: {type: "t", value: bumpTexture},
        bumpSpeed: {type: "f", value: bumpSpeed},
        bumpScale: {type: "f", value: bumpScale},
        alpha: {type: "f", value: 1.0},
        time: {type: "f", value: 1.0}
    };

    var sunMaterial = new THREE.ShaderMaterial({
            uniforms: window.customUniforms,
            vertexShader,
            fragmentShader
        });

    var sunGeometry = new THREE.SphereGeometry(60, 46, 256);
    var sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // var sunTexture = loader.load("textures/sun.jpg");
    // var sun = new THREE.Group(); // new THREE.Mesh(new THREE.SphereGeometry(50, 64, 64), new THREE.MeshBasicMaterial({map: sunTexture}));
    var sunLight = new THREE.PointLight(0xfff8ef, 1);
    sunLight.shadow.mapSize.width = 1560;
    sunLight.shadow.mapSize.height = 1560;

    // Skydome
    var skyTexture = loader.load(_textures+"eso0932a.jpg");
    skyTexture.minFilter = THREE.LinearFilter;
    var skyMaterial = new THREE.MeshLambertMaterial({map: skyTexture});
    skyMaterial.side = THREE.BackSide;
    var sky = new THREE.Mesh(new THREE.SphereGeometry(4500, 16, 16), skyMaterial);


    // Saturn
    var saturnTexture = loader.load(_textures+"saturn.jpg");
    var saturn = new THREE.Mesh(new THREE.SphereGeometry(8, 16, 16), new THREE.MeshLambertMaterial({map: saturnTexture}));

    // Jupiter
    var jupiterTexture = loader.load(_textures+"jupiter.jpg");
    var jupiter = new THREE.Mesh(new THREE.SphereGeometry(10, 16, 16), new THREE.MeshLambertMaterial({map: jupiterTexture}));

    // Earth
    var earthGeometry = new THREE.SphereGeometry(6, 32, 32);
    var earthMaterial = new THREE.MeshStandardMaterial({
        map: loader.load(_textures+'earthmap1024.jpg'),
        bumpMap: loader.load(_textures+'earthbump1024.jpg'),
        bumpScale: 5,
        specularMap: loader.load(_textures+'earthspec1024.jpg'),
        metalness: 0.1,
        roughness: 0.5,
    });
    var earth = new THREE.Mesh(earthGeometry, earthMaterial);

    var cloudGeometry = new THREE.SphereGeometry(6.2, 16, 16);
    var cloudMaterial = new THREE.MeshLambertMaterial({
        map: loader.load(_textures+'earthclouds.jpg'),
        opacity: 0.7,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    var clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earth.add(clouds);

    var moonTexture = loader.load(_textures+"moon.jpg");
    var moon = new THREE.Mesh(new THREE.SphereGeometry(2, 316, 316), new THREE.MeshLambertMaterial({map: moonTexture}));

    var earthOrbit = new THREE.Group();
    var moonOrbit = new THREE.Group();

    var saturnOrbit = new THREE.Group();
    var jupiterOrbit = new THREE.Group();

    earth.position.x = 95;
    earth.rotation.y = 90;
    moon.position.z = -8.5;
    jupiter.position.x = 130;
    saturn.position.x = 170;
    orbitCamera.position.x = 80; // z in resize

    sunLight.castShadow = true;
    moon.castShadow = true;
    moon.receiveShadow = true;
    earth.receiveShadow = true;
    earth.castShadow = true;
    jupiter.receiveShadow = true;
    jupiter.castShadow = true;
    saturn.receiveShadow = true;
    saturn.castShadow = true;

    scene.add(topCamera);
    scene.add(sun);
    scene.add(sunLight);
    scene.add(sky);
    sun.add(saturnOrbit);
    sun.add(jupiterOrbit);
    sun.add(earthOrbit);
    saturnOrbit.add(saturn);
    jupiterOrbit.add(jupiter);

    earthOrbit.add(earth);
    earthOrbit.add(orbitCamera);

    earth.add(moonOrbit);
    moonOrbit.add(moon);


    ////////////////
    // Window Events

    window.addEventListener("resize", function () {
        width = window.innerWidth;
        height = window.innerHeight;
        renderer.setSize(width, height);
        topCamera.aspect = width / height;
        topCamera.updateProjectionMatrix();
        orbitCamera.aspect = width / height;
        orbitCamera.position.z = (orbitCamera.aspect < 1 ? 200 : 150);
        orbitCamera.updateProjectionMatrix();
    });

    window.addEventListener('keydown', function (evt) {

        switch (evt.which) {
            case 87:
                camera.position.y += 1;
                break; // w
            case 83:
                camera.position.y -= 1;
                break; // s
            case 65:
                camera.position.x -= 1;
                break; // a
            case 68:
                camera.position.x += 1;
                break; // d
            case 80:
                paused = !paused;
                break; // p
            case 67:
                camera == topCamera ? camera = orbitCamera : camera = topCamera;
                break; // c
        }
    });

    var render = function () {
        requestAnimationFrame(render);

        if (!paused) {
            sun.rotation.y += 0.0005;
            moonOrbit.rotation.y += 0.005;
            earth.rotation.y += 0.002;

            jupiterOrbit.rotation.y += 0.002;
            saturnOrbit.rotation.y += 0.001;

            var delta = clock.getDelta();
            window.customUniforms.time.value += delta;
        }
        
        renderer.render(scene, camera);
    };


    ////////////////
    // START

    window.dispatchEvent(new Event("resize"))
    render();
})








