import * as THREE from 'three'
import HellShader from './HellShader'


export default class Hell extends THREE.Mesh {

    constructor() {

		const mat =  new HellShader()
		mat.side = THREE.BackSide
		
		super(new THREE.SphereGeometry(1000, 20, 20),mat)
    }
}



