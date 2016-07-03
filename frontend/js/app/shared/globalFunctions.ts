/// <reference path='../../typings/refs.d.ts' />
window.now = () => {
    return new Date().getTime();
}

window.clone = function<T>(obj: T) {
    return JSON.parse(JSON.stringify(obj));
}