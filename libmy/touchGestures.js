/**
 * @author Tom Wendland
 * 
 * Notizen
 * - wenn e.preventDefault() drin kommt auf mobiler version fehlermeldung, wenn auf einen button getouched wird
 */

document.addEventListener('touchstart', (e) => {
    panstart(e)
    pinchstart(e)
})
document.addEventListener('touchmove', (e) => {
    panmove(e)
    pinchmove(e)
})
document.addEventListener('touchend', (e) => {
    pinchend(e)
})


export function preventTouchGestures(canvas){
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); })
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); })
    canvas.addEventListener('touchend', (e) => { e.preventDefault(); })
}



var startX = 0
var startY = 0

var deltaX = 0
var deltaY = 0

var deltaX_ = 0 // to save latest send change to get diff between deltas
var deltaY_ = 0

function panstart(e){
    if(e.touches.length == 1 && !paning){
        deltaX = 0
        deltaY = 0
        deltaX_ = 0 
        deltaY_ = 0
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }
}

function panmove(e){
    if(e.touches.length == 1 && !paning){
        let clientX = e.touches[0].clientX;
        let clientY = e.touches[0].clientY;
        deltaX = startX - clientX
        deltaY = startY - clientY
    }
}

export function getPanChangeX() {
    let result = deltaX - deltaX_
    deltaX_ = deltaX
    return -result 
}

export function getPanChangeY() {
    let result = deltaY - deltaY_
    deltaY_ = deltaY
    return -result 
}




var startdiff = 0;
var diff = 0;
var paning = false // damit der letze finger nicht als pan genommmen wird

function pinchstart(e){
    if(e.touches.length == 2){
        paning = true
        let d = getTouchDist(e.touches[0], e.touches[1])
        startdiff = d
        diff = d
    }
}

function pinchmove(e){
    if(e.touches.length == 2){
        diff = getTouchDist(e.touches[0], e.touches[1])
    }
}

function pinchend(e){
    if(e.touches.length == 0){
        paning = false;
    }
}

function getTouchDist(t1, t2){
    let x = t1.clientX - t2.clientX
    let y = t1.clientY - t2.clientY
    return Math.sqrt(x*x + y*y)
}

export function getPinchChange(){
    let result = diff-startdiff
    startdiff = diff
    return 1 + result/500
}
