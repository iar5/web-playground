// https://stackoverflow.com/a/4819886/7764088
export function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

export function doubleArray(m: number, n: number, v: any): Array<Array<any>> {
    return Array(m).fill(v).map(() => Array(n).fill(v))

}


