import { Camera, PerspectiveCamera, WebGLRenderer } from "three"


export function resize(renderer: WebGLRenderer, camera: PerspectiveCamera) {
    const canvas = renderer.domElement
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    renderer.setPixelRatio(window.devicePixelRatio) // retina
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
}