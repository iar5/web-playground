const keysHold = []

document.addEventListener('keydown', function (e) {
    if(keysHold.indexOf(e.keyCode) == -1) 
        keysHold.push(e.keyCode); 
})
document.addEventListener('keyup', function (e) {
    const i = keysHold.indexOf(e.keyCode);
    keysHold.splice(i, 1);
})

export function isKeyHold(keyCode) { 
    return keysHold.indexOf(keyCode) != -1 
}