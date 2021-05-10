const keysHold = []

document.addEventListener('keydown', function (e) {
    if(keysHold.indexOf(e.key) == -1) 
        keysHold.push(e.key); 
})
document.addEventListener('keyup', function (e) {
    const i = keysHold.indexOf(e.key);
    keysHold.splice(i, 1);
})

document.addEventListener("visibilitychange", () => {
    resetKeys()
})
window.addEventListener("pagehide", () => {
    resetKeys()
});


/**
 * @param key string der Taste
 */
export function isKeyHold(key) { 
    return keysHold.indexOf(key) != -1 
}


export function resetKeys(){
    keysHold.length = 0
}

