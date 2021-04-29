

import * as THREE from "three"
import { Scene, Color, Mesh, HemisphereLight, Fog, DirectionalLight, PlaneBufferGeometry, MeshPhongMaterial, GridHelper, AxesHelper, SphereBufferGeometry } from "three"


export function createDemoScene(): THREE.Scene {
    let scene = new THREE.Scene
    scene.background = new THREE.Color(0xa0a0a0)
    scene.fog = new THREE.Fog(0xa0a0a0, 1000, 2000)

    const hemilight = new THREE.HemisphereLight(0xffffff, 0x444444)
    hemilight.position.set(0, 200, 0)
    scene.add(hemilight)

    const light = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(light);
    light.position.set(5, 10, 0)
    light.castShadow = true;
    light.shadow.mapSize.width = 512
    light.shadow.mapSize.height = 512;
    light.shadow.camera.left = -2
    light.shadow.camera.right = 2
    light.shadow.camera.top = 2
    light.shadow.camera.bottom = -2
    light.shadow.camera.near = 0.5
    light.shadow.camera.far = 100


    // Ground
    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const grid = new THREE.GridHelper(10, 10, 0x000000, 0x000000);
    // @ts-ignore 
    grid.material.opacity = 0.2;
    // @ts-ignore 
    grid.material.transparent = true;
    scene.add(grid);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    return scene
}
