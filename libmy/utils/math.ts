export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
};

export function lerp(value1: number, value2: number, amount: number): number {
    return value1 + (value2 - value1) * amount;
}

export function degToRad(degrees: number): number {
    return degrees * Math.PI / 180;
}
