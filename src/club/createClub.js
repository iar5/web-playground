import * as THREE from '/lib/three/build/three.module.js'

export default function createLocation(scene, camera){

    //////
    // Room
    ////
    const textureLoader = new THREE.TextureLoader()

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
    var blackMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0x000000),
    })

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

    var tgeo = new THREE.Geometry()
    tgeo.merge(new THREE.BoxGeometry(7.4, 0.1, 2.4).translate(0, 3, 0))
    let t_ = new THREE.BoxGeometry(0.2, 3, 0.2).translate(0, 1.5, 0)
    tgeo.merge(t_.clone().translate(3.5, 0, 1))
    tgeo.merge(t_.clone().translate(-3.5, 0, 1))
    tgeo.merge(t_.clone().translate(3.5, 0, -1))
    tgeo.merge(t_.clone().translate(-3.5, 0, -1))
    var table = new THREE.Mesh(tgeo, blackMaterial)
    table.translateZ(-5)
    table.castShadow = true
    table.receiveShadow = true
    scene.add(table)


    var boxr = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 2, 1, 1, 1), blackMaterial)
    .translateX(5.5)
    .translateY(2)
    .translateZ(-5)
    boxr.castShadow = true
    boxr.receiveShadow = true
    scene.add(boxr)

    var boxl = boxr.clone()
    .translateX(-2*boxr.position.x)
    scene.add(boxl)


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


    //////
    // Sound
    ////
    var listener = new THREE.AudioListener();
    camera.add(listener);

    var sound = new THREE.PositionalAudio(listener);
    new THREE.AudioLoader().load('/assets/audio/Universe of 90s Techno Parties.mp4', (buffer) => {
        sound.setBuffer(buffer);
        sound.setRefDistance(5);
        //sound.play();
    })
    sound.position.set(0, 5, 0)

    var analyser = new THREE.AudioAnalyser(sound, 32);


    return function(){
        // update something

        if(sound.isPlaying){
            let f = analyser.getAverageFrequency() / 256;
            pointLightL.intensity = f
            pointLightR.intensity = f
        }
    }
}


