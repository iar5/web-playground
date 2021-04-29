import * as THREE from '../../lib/three/build/three.module.js'
import { GLTFLoader } from '../../lib/three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from '../../lib/three/examples/jsm/loaders/FBXLoader.js'
import * as dat from '../../lib/dat.gui.js';
import { isKeyHold } from '../../libmy/keyhold.js' 

var clock = new THREE.Clock();

let model
let skeleton
let mixer

var action1
var action2
var action3;

var weight1 = 1
var weight2 = 0
var weight3 = 0




export function create(scene){
    
    new FBXLoader().load('models/character/Untitled 1.fbx', object => {

        console.log(object);
        mixer = new THREE.AnimationMixer(object)
        mixer.clipAction(object.animations[0]).play()
                    
        object.traverse(child => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true } })
        object.scale.set(0.01, 0.01, 0.01)
        scene.add(object)
    })

    return
    new GLTFLoader().load( 'models/Soldier.glb', function ( gltf ) {

        console.log(gltf);
        model = gltf.scene;
        scene.add(model);
        model.traverse(child => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true } })

        skeleton = new THREE.SkeletonHelper( model );
        skeleton.visible = true;
        scene.add(skeleton);

        var animations = gltf.animations;
        mixer = new THREE.AnimationMixer( model );

        let action = mixer.clipAction(animations[0]);

        action.play()
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(1);
    });
}







export function update(){
    if(mixer) mixer.update(clock.getDelta());
}



