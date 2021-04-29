
import * as THREE from 'three'
import * as dat from '../lib/dat.gui.js';


/**
 * Objekte müssen THREE.Object3D.name property haben
 */
export default class DatThreeGui{

    constructor() {
        this.datgui = new dat.GUI();
        this.datgui.domElement.style.float = "left"

        this.datgui.__proto__.addColorThree = function (object, property) {
            // folder.addColor({ emissive: material.emissive.getHex() }, 'emissive').onChange((c) => material.emissive.set(c))
            // problem wenn ich direkt zum object.property color objekt verlinke: three ist rgb 0-1 datgui liest aber 0-255
            let o = {}
            o[property] = object[property].getHex()
            this.addColor(o, property).onChange(c => object[property].set(c))
        }
    }
    
    register(obj){
        if (obj instanceof THREE.Material) {
            this.registerMaterial(obj)
        }
        else if (obj instanceof THREE.Light) {
            this.registerLight(obj)
        }
    }

    registerMaterial(material){
        if (!this.materialsFolder) this.materialsFolder = this.datgui.addFolder('Materials');
        let folder = this.materialsFolder.addFolder(material.type + " " + material.name)

        if (material instanceof THREE.MeshStandardMaterial) {
            folder.addColorThree(material, "color")
            folder.addColorThree(material, "emissive")
            folder.add(material, "roughness", 0, 1, 0.01)
            folder.add(material, "metalness", 0, 1, 0.01)
            folder.add(material, 'wireframe')

            if (material instanceof THREE.MeshPhysicalMaterial) {
                folder.add(material, "reflectivity", 0, 1, 0.01)
                folder.add(material, "clearcoat", 0, 1, 0.01)
                folder.add(material, "clearcoatRoughness", 0, 1, 0.01)
                folder.add(material, "transmission", 0, 1, 0.01)
                folder.add(material, "ior", 1, 2, 0.01)
            }
        }
    }

    registerLight(light){       
        if (!this.lightFolder) this.lightFolder = this.datgui.addFolder('Lights');
        let folder = this.lightFolder.addFolder(light.type + " " + light.name)

        folder.addColorThree(light, "color")
        folder.add(light, "intensity", 0, 5, 0.01)

        if (!(light instanceof THREE.AmbientLight)) {
            folder.add(light.position, "x", -50, 50, 0.01)
            folder.add(light.position, "y", -50, 50, 0.01)
            folder.add(light.position, "z", -50, 50, 0.01)
        }

        if (light instanceof THREE.PointLight) {
            folder.add(light, "distance", 0, 100, 0.01)
            folder.add(light, "decay", 0, 5, 0.01)

            const helper = new THREE.PointLightHelper(light, 1);
            helper.visible = false
            light.parent.add(helper)
            folder.add({ "show helper": helper.visible }, "show helper").onChange(b => { helper.visible = b })
        }

        if (light instanceof THREE.SpotLight) {
            const helper = new THREE.SpotLightHelper(light);
            helper.visible = false
            light.parent.add(helper);
            folder.add({ "show helper": helper.visible }, "show helper").onChange(b => { helper.visible = b })
        }

        //folder.add(light.rotation, "x", 0, Math.PI*2, 0.01)
    }


    show() {
        this.datgui.domElement.style.display = "initial"
    }

    hide() {
        this.datgui.domElement.style.display = "none"
    }
}




