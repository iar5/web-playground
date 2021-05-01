import ImagePlot3D from "./surface.js"


const canvas = document.getElementById('canvas')
const imagePlot3D = new ImagePlot3D(canvas, './example.png');

// Fileinput
const inputElement = document.getElementById("file")
inputElement.onchange = function (e) {
    let file = inputElement.files[0]
    if (file) {
        var reader = new FileReader();
        reader.addEventListener("load", () => { imagePlot3D.updateImage(reader.result) }, false);
        reader.readAsDataURL(file);
    }
}

// Load initial input values
updateButtonValues()

// Animation Parameters
document.getElementById("rx").addEventListener("change", e => imagePlot3D.setRotationParameters(e.target.value, undefined, undefined))
document.getElementById("ry").addEventListener("change", e => imagePlot3D.setRotationParameters(undefined, e.target.value, undefined))
document.getElementById("rz").addEventListener("change", e => imagePlot3D.setRotationParameters(undefined, undefined, e.target.value))
document.getElementById("depth").addEventListener('input', e => imagePlot3D.setDepth(e.target.value))
document.getElementById("resetButton").addEventListener('click', e => reset())

document.getElementById("toggleView").addEventListener('click', () => document.getElementsByTagName("header")[0].classList.toggle("closed"))
document.getElementById("checkboxDepthTest").addEventListener('click', e => imagePlot3D.toggleDepthTest(e.target.checked))
document.getElementById("checkboxOrientationControle").addEventListener('click', e => imagePlot3D.enableOrientationControle(e.target.checked))

function reset() {
    imagePlot3D.resetView();
    updateButtonValues();
}

function updateButtonValues() {
    let params = imagePlot3D.getParameters()
    rx.value = params.rotations[0]
    ry.value = params.rotations[1]
    rz.value = params.rotations[2]
    depth.value = params.depth
    checkboxDepthTest.checked = params.depthTestEnabled
    checkboxOrientationControle.checked = params.orientationControleEnabled
}