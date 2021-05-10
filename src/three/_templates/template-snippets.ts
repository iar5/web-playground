

import * as THREE from "three"
import { Scene, Color, Mesh, HemisphereLight, Fog, DirectionalLight, PlaneBufferGeometry, MeshPhongMaterial, GridHelper, AxesHelper, SphereBufferGeometry, WebGLRenderer } from "three"


const scene = new Scene()



const hemilight = new THREE.HemisphereLight(0xffffff, 0x444444)
hemilight.position.set(0, 200, 0)
scene.add(hemilight)

const dirlight = new THREE.DirectionalLight(0xffffff, 1);
dirlight.position.set(5, 10, 0)
dirlight.castShadow = true;
dirlight.shadow.mapSize.width = 512
dirlight.shadow.mapSize.height = 512;
dirlight.shadow.camera.left = -2
dirlight.shadow.camera.right = 2
dirlight.shadow.camera.top = 2
dirlight.shadow.camera.bottom = -2
dirlight.shadow.camera.near = 0.5
dirlight.shadow.camera.far = 100
scene.add(dirlight);


// Ground
const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(10, 10), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

// Grid
const grid = new THREE.GridHelper(10, 10, 0x000000, 0x000000);
// @ts-ignore 
grid.material.opacity = 0.2;
// @ts-ignore 
grid.material.transparent = true;
scene.add(grid);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

