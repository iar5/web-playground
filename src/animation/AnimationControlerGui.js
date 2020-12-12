import * as THREE from '../../lib/three/build/three.module.js'
import { GLTFLoader } from '../../lib/three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from '../../lib/dat.gui.js';

var clock = new THREE.Clock();

var loaded = false
var model
var skeleton
var mixer

var crossFadeControls = [];

var idleAction
var walkAction
var runAction;
var idleWeight
var walkWeight
var runWeight

var actions
var settings;

var singleStepMode = false;
var sizeOfNextStep = 0;

var loader = new GLTFLoader();



export function create(scene){

    loader.load( 'models/Soldier.glb', function ( gltf ) {

        console.log(gltf);
        model = gltf.scene;
        scene.add( model );

        model.traverse( function ( object ) {
            if ( object.isMesh ) object.castShadow = true;
        } );

        skeleton = new THREE.SkeletonHelper( model );
        skeleton.visible = false;
        scene.add( skeleton );

        createPanel();

        var animations = gltf.animations;
        mixer = new THREE.AnimationMixer( model );
        idleAction = mixer.clipAction(animations[ 0 ]);
        walkAction = mixer.clipAction(animations[ 3 ]);
        runAction = mixer.clipAction(animations[ 1 ]);

        actions = [ idleAction, walkAction, runAction ];
        activateAllActions();

        loaded = true
    });
}


function createPanel() {

    var panel = new dat.GUI( { width: 310 } );
    var folder1 = panel.addFolder( 'Visibility' );
    var folder2 = panel.addFolder( 'Activation/Deactivation' );
    var folder3 = panel.addFolder( 'Pausing/Stepping' );
    var folder4 = panel.addFolder( 'Crossfading' );
    var folder5 = panel.addFolder( 'Blend Weights' );
    var folder6 = panel.addFolder( 'General Speed' );

    settings = {
        'show model': true,
        'show skeleton': false,
        'deactivate all': deactivateAllActions,
        'activate all': activateAllActions,
        'pause/continue': pauseContinue,
        'make single step': toSingleStepMode,
        'modify step size': 0.05,
        'from walk to idle': function () {
            prepareCrossFade( walkAction, idleAction, 1.0 );
        },
        'from idle to walk': function () {
            prepareCrossFade( idleAction, walkAction, 0.5 );
        },
        'from walk to run': function () {
            prepareCrossFade( walkAction, runAction, 2.5 );
        },
        'from run to walk': function () {
            prepareCrossFade( runAction, walkAction, 5.0 );
        },
        'use default duration': true,
        'set custom duration': 3.5,
        'modify idle weight': 0.0,
        'modify walk weight': 1.0,
        'modify run weight': 0.0,
        'modify time scale': 1.0
    };

    folder1.add( settings, 'show model' ).onChange( showModel );
    folder1.add( settings, 'show skeleton' ).onChange( showSkeleton );
    folder2.add( settings, 'deactivate all' );
    folder2.add( settings, 'activate all' );
    folder3.add( settings, 'pause/continue' );
    folder3.add( settings, 'make single step' );
    folder3.add( settings, 'modify step size', 0.01, 0.1, 0.001 );
    crossFadeControls.push( folder4.add( settings, 'from walk to idle' ) );
    crossFadeControls.push( folder4.add( settings, 'from idle to walk' ) );
    crossFadeControls.push( folder4.add( settings, 'from walk to run' ) );
    crossFadeControls.push( folder4.add( settings, 'from run to walk' ) );
    folder4.add( settings, 'use default duration' );
    folder4.add( settings, 'set custom duration', 0, 10, 0.01 );
    folder5.add( settings, 'modify idle weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) {
        setWeight( idleAction, weight );
    } );
    folder5.add( settings, 'modify walk weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) {
        setWeight( walkAction, weight );
    } );
    folder5.add( settings, 'modify run weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) {
        setWeight( runAction, weight );
    } );
    folder6.add( settings, 'modify time scale', 0.0, 1.5, 0.01 ).onChange( modifyTimeScale );

    folder1.open();
    folder2.open();
    folder3.open();
    folder4.open();
    folder5.open();
    folder6.open();

    crossFadeControls.forEach( function ( control ) {
        control.classList1 = control.domElement.parentElement.parentElement.classList;
        control.classList2 = control.domElement.previousElementSibling.classList;

        control.setDisabled = function () {
            control.classList1.add( 'no-pointer-events' );
            control.classList2.add( 'control-disabled' );
        };

        control.setEnabled = function () {
            control.classList1.remove( 'no-pointer-events' );
            control.classList2.remove( 'control-disabled' );
        };
    } );
}


function showModel( visibility ) {
    model.visible = visibility;
}

function showSkeleton( visibility ) {
    skeleton.visible = visibility;
}

function modifyTimeScale( speed ) {
    mixer.timeScale = speed;
}

function deactivateAllActions() {
    actions.forEach( function ( action ) {
        action.stop();
    } );
}

function activateAllActions() {

    setWeight( idleAction, settings[ 'modify idle weight' ] );
    setWeight( walkAction, settings[ 'modify walk weight' ] );
    setWeight( runAction, settings[ 'modify run weight' ] );

    actions.forEach( function ( action ) {
        action.play();
    } );
}

function pauseContinue() {

    if ( singleStepMode ) {
        singleStepMode = false;
        unPauseAllActions();
    } else {
        if ( idleAction.paused ) {
            unPauseAllActions();
        } else {
            pauseAllActions();
        }
    }
}

function pauseAllActions() {
    actions.forEach( function ( action ) {
        action.paused = true;
    } );
}

function unPauseAllActions() {
    actions.forEach( function ( action ) {
        action.paused = false;
    });
}

function toSingleStepMode() {
    unPauseAllActions();
    singleStepMode = true;
    sizeOfNextStep = settings[ 'modify step size' ];
}

function prepareCrossFade(startAction, endAction, defaultDuration) {

    // Switch default / custom crossfade duration (according to the user's choice)
    var duration = setCrossFadeDuration( defaultDuration );

    // Make sure that we don't go on in singleStepMode, and that all actions are unpaused
    singleStepMode = false;
    unPauseAllActions();

    // If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
    // else wait until the current action has finished its current loop

    if ( startAction === idleAction ) {
        executeCrossFade( startAction, endAction, duration );
    } else {
        synchronizeCrossFade( startAction, endAction, duration );
    }

}

function setCrossFadeDuration( defaultDuration ) {

    // Switch default crossfade duration <-> custom crossfade duration
    if ( settings[ 'use default duration' ] ) {
        return defaultDuration;
    } else {
        return settings[ 'set custom duration' ];
    }
}

function synchronizeCrossFade( startAction, endAction, duration ) {
    mixer.addEventListener( 'loop', onLoopFinished );

    function onLoopFinished( event ) {
        if ( event.action === startAction ) {
            mixer.removeEventListener( 'loop', onLoopFinished );
            executeCrossFade( startAction, endAction, duration );
        }
    }
}

function executeCrossFade( startAction, endAction, duration ) {
    // Not only the start action, but also the end action must get a weight of 1 before fading
    // (concerning the start action this is already guaranteed in this place)
    setWeight( endAction, 1 );
    endAction.time = 0;

    // Crossfade with warping - you can also try without warping by setting the third parameter to false
    startAction.crossFadeTo( endAction, duration, true );
}

// This function is needed, since animationAction.crossFadeTo() disables its start action and sets
// the start action's timeScale to ((start animation's duration) / (end animation's duration))
function setWeight( action, weight ) {
    action.enabled = true;
    action.setEffectiveTimeScale( 1 );
    action.setEffectiveWeight( weight );
}



export function update(){
    if(!loaded) return

    idleWeight = idleAction.getEffectiveWeight();
    walkWeight = walkAction.getEffectiveWeight();
    runWeight = runAction.getEffectiveWeight();

    // Update the panel values if weights are modified from "outside" (by crossfadings)
    settings[ 'modify idle weight' ] = idleWeight;
    settings[ 'modify walk weight' ] = walkWeight;
    settings[ 'modify run weight' ] = runWeight;


    // Enable/disable crossfade controls according to current weight values
    crossFadeControls.forEach( function ( control ) {
        control.setDisabled();
    });

    if ( idleWeight === 1 && walkWeight === 0 && runWeight === 0 ) {
        crossFadeControls[ 1 ].setEnabled();
    }
    if ( idleWeight === 0 && walkWeight === 1 && runWeight === 0 ) {
        crossFadeControls[ 0 ].setEnabled();
        crossFadeControls[ 2 ].setEnabled();
    }
    if ( idleWeight === 0 && walkWeight === 0 && runWeight === 1 ) {
        crossFadeControls[ 3 ].setEnabled();
    }

    // Get the time elapsed since the last frame, used for mixer update (if not in single step mode)
    var mixerUpdateDelta = clock.getDelta();
    // If in single step mode, make one step and then do nothing (until the user clicks again)
    if ( singleStepMode ) {
        mixerUpdateDelta = sizeOfNextStep;
        sizeOfNextStep = 0;
    }

    // Update the animation mixer, the stats panel, and render this frame
    mixer.update(mixerUpdateDelta);
}

