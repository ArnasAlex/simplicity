/// <reference path="./refs.d.ts" />
declare module NodeJS {
    export interface Global {
        now(): number;
        clone<T>(obj: T): T;
        random(min: number, max: number): number;
        getDistanceBetween(a: IPoint, b: IPoint): number;
    }
}