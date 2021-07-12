export function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}



/**
 * 
 * @param {String} imgSrc 
 * @param {CallableFunction} callback 
 * @returns {Image} 
 */
export function loadImage(imgSrc, callback) {
    let img = new Image();
    img.src = imgSrc;
    img.onload = () => callback(img);
}

/**
 * @param {Image} img 
 * @returns {ImageData} 
 */
export function getImageData(img, width, height) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempContext = tempCanvas.getContext('2d');
    tempContext.drawImage(img, 0, 0, width, height);

    const imageData = tempContext.getImageData(0, 0, width, height).data;
    return imageData;
}


