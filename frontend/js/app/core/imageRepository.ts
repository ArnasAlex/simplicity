/// <reference path='../../typings/refs.d.ts' />
import O = require('../objects/objects');

export class ImageRepository {
    private images: HTMLImageElement[] = [];
    private imagesByType: HTMLImageElement[] = [];
    private loadCompleteCb: () => void;
    private loadedImagesCount = 0;
    private totalImageCount = O.Images.allObjects.length;

    public loadImages(loadCompleteCb: () => void) {
        this.loadCompleteCb = loadCompleteCb;
        var imageNames = O.Images.allObjects;
        _.each(imageNames, (img: O.Image) => { this.loadImage(img.name, img.type); });
    }

    public getImage(name: string): HTMLImageElement {
        if (this.loadedImagesCount != this.totalImageCount){
            throw Error('Images must be loaded before getting them.');
        }
        return this.images[name];
    }

    public getImageByType(type: GameObjectType): HTMLImageElement {
        if (this.loadedImagesCount != this.totalImageCount) {
            throw Error('Images must be loaded before getting them.');
        }

        return this.imagesByType[type];
    }

    private loadImage(name: string, type: GameObjectType) {
        var img = new Image();
        img.src = 'img/object/' + name + '.png';
        this.images[name] = img;
        this.imagesByType[type] = img;
        this.bindImageOnLoad(img)
    }

    private bindImageOnLoad(img: HTMLImageElement){
        img.onload = () => {
            this.imageLoaded();
        };
    }

    private imageLoaded() {
        this.loadedImagesCount++;
        if (this.loadedImagesCount === O.Images.allObjects.length) {
            this.loadCompleteCb();
        }
    }
} 