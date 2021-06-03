import * as THREE from "three"
import { AmbientLight, Clock, ConeBufferGeometry, Mesh, MeshPhongMaterial, MeshStandardMaterial, Object3D, PerspectiveCamera, Scene, SphereBufferGeometry, Vector3, WebGLRenderer } from 'three'
import { scene } from "./main"


const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0x999999 }));
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);


const mat = new MeshStandardMaterial({ color: "red" })
for (let i = 0; i < 100; i++) {
    let h = 3 + Math.random() * 2
    let geo = new ConeBufferGeometry(2 + Math.random() - 0.5, h)
    let mesh = new Mesh(geo, mat)
    mesh.position.set(100 * (Math.random() - 0.5), 0, 100 * (Math.random() - 0.5))
    mesh.position.y = h/2
    scene.add(mesh)
}
