import * as THREE from 'three'
import * as dat from 'dat.gui';



export default class DatThreeGui {

    public datgui: dat.GUI & { addColorThree: (obj: object, property: string) => any}

    constructor()

    public addMaterial(mat: THREE.Material): void
    public addLight(light: THREE.Light): void
    public show(): void
    public hide(): void
}