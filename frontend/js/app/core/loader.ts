export class Loader{
    private loadedComponents: LoadableComponentType[] = [];
    private componentCount: number;

    constructor(private allLoadedCallback: () => void){
        this.setComponentCount();
    }

    private setComponentCount(){
        var count = 0;
        for (var val in LoadableComponentType) {
            if (isNaN(val)) {
                count++;
            }
        }
        this.componentCount = count;
    }

    public componentLoaded(component: LoadableComponentType) {
        this.checkForDuplicate(component);
        this.loadedComponents.push(component);
        this.checkAllLoaded();
    }

    private checkForDuplicate(component: LoadableComponentType){
        if (this.loadedComponents.indexOf(component) !== -1){
            throw Error('Trying to load component that is already loaded: ' + component);
        }
    }

    private checkAllLoaded(){
        if (this.loadedComponents.length === this.componentCount){
            this.allLoadedCallback();
        }
    }
}

export enum LoadableComponentType {
    images = 1,
    canvas = 2,
    background = 3,
    connected = 4
}