import * as THREE from '/lib/three/build/three.module.js'
import { FBXLoader } from '/lib/three/examples/jsm/loaders/FBXLoader.js'

export default function createPeople(scene){

    var fbxLoader = new FBXLoader()
    var clock = new THREE.Clock();

    var mixer
    fbxLoader.load('/assets/models/Belly Dance.fbx', function (object) {
        mixer = new THREE.AnimationMixer(object)
        mixer.clipAction(object.animations[0]).play()
                    
        object.traverse(child => {
            if (child.isMesh){
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        let scale = 0.03
        object.scale.set(scale, scale, scale);
        object.rotateY(THREE.MathUtils.degToRad(180))
        scene.add(object);    
    });

    return function(){
        if (mixer) mixer.update(clock.getDelta())
    }
}