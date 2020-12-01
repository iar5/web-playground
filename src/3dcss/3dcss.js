import * as THREE from '../../lib/three/build/three.module.js'
import { FBXLoader } from '../../lib/three/examples/jsm/loaders/FBXLoader.js'
import { OrbitControls } from '../../lib/three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer } from '../../lib/three/examples/jsm/renderers/CSS3DRenderer.js.js'

/**
 * Idee
Webgl über html
Canvas pointer events weiter geben an html mit css 

 */
      
      let htmlElement = document.getElementById("dvdscreen")
        if(htmlElement) {
            htmlElement.style.display = "unset"
            let obj = new THREE.Object3D();
            let s = 0.008
            obj.scale.set(s, s, s) 
            tvGroup.add(obj)
        
            var css3dObject = new CSS3DObject(htmlElement);
            obj.add(css3dObject);
        
            // chop plane
            var material = new THREE.MeshPhongMaterial({opacity: 0, color: new THREE.Color("black"), blending: THREE.NoBlending, side: THREE.DoubleSide });
            var geometry = new THREE.BoxBufferGeometry(htmlElement.clientWidth,  htmlElement.clientHeight, 0.1);
            var mesh = new THREE.Mesh(geometry, material);
            obj.add(mesh);

            material = new THREE.MeshBasicMaterial({opacity: 1, color: new THREE.Color("black")});
            geometry = new THREE.BoxBufferGeometry(htmlElement.clientWidth+2,  htmlElement.clientHeight+2, 0.1);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.z = -2
            obj.add(mesh);

            material = new THREE.MeshBasicMaterial({opacity: 1, color: new THREE.Color("white"), wireframe: true});
            geometry = new THREE.BoxBufferGeometry(htmlElement.clientWidth-2,  htmlElement.clientHeight-2, 0.1);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.z = -1
            obj.add(mesh);

        }