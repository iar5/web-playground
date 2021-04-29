import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from '../../../lib/dat.gui.js';
import { isKeyHold } from '../../../libmy/keyhold.js'

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

    var loader = new GLTFLoader();
    loader.load( 'models/c4d.gltf', function ( gltf ) {

        console.log(gltf);
        model = gltf.scene;
        scene.add(model);

        model.traverse( function ( object ) {
            if ( object.isMesh ) object.castShadow = true;
        } );

        skeleton = new THREE.SkeletonHelper( model );
        skeleton.visible = true;
        scene.add( skeleton );

        var animations = gltf.animations;
        mixer = new THREE.AnimationMixer( model );

        action1 = mixer.clipAction(animations[0]);
        action2 = mixer.clipAction(animations[3]);
        action3 = mixer.clipAction(animations[1]);

        action1.play()
        action2.play()
        action3.play()
        setWeight(action1, weight1)
        setWeight(action2, weight2)
        setWeight(action3, weight3)
    });
}



function setWeight(action, weight) {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight( weight );
}




export function update(){
    if(!mixer) return


    if(isKeyHold(87)) {
        weight2 = Math.min(weight2+0.03, 1)
        if(weight2 != 1) {
            action2.setEffectiveWeight(weight2)
            action1.setEffectiveWeight(1-weight2)
        }
    }
    else {
        weight2 = Math.max(weight2-0.05, 0)
        if(weight2 != 0) {
            action2.setEffectiveWeight(weight2)
            action1.setEffectiveWeight(1-weight2)
        }
    }

    weight1 = action1.getEffectiveWeight()
    weight2 = action2.getEffectiveWeight()
    weight3 = action3.getEffectiveWeight()

    mixer.update(clock.getDelta());
}



