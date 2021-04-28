/**
 * @author Tom Wendland
 */


export default function FpsCounter(){
    let totalFramCount = 0;
    let elapsedTime = 0;
    let frameCount = 0;
    let lastTime = new Date().getTime();
    let lastTimeDelta = new Date().getTime();
    let fps = 0;

    return {
        tick() {
            const now = Date.now();
            totalFramCount++
            frameCount++;
            elapsedTime += (now - lastTime);
            lastTime = now;
            if(elapsedTime >= 1000) {
                fps = frameCount;
                frameCount = 0;
                elapsedTime -= 1000;
            }
        },
        getFPS(){
            return fps;
        },
        getTotalFrames(){
            return totalFramCount
        },
        getDelta(){
             // noch nicht getested
            const now = Date.now();
            let diff = now - lastTimeDelta;
            lastTimeDelta = now;
            return diff;
        }
    }
}


    
