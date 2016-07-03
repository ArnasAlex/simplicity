define(["require", "exports"], function (require, exports) {
    var Loader = (function () {
        function Loader(allLoadedCallback) {
            this.allLoadedCallback = allLoadedCallback;
            this.loadedComponents = [];
            this.setComponentCount();
        }
        Loader.prototype.setComponentCount = function () {
            var count = 0;
            for (var val in LoadableComponentType) {
                if (isNaN(val)) {
                    count++;
                }
            }
            this.componentCount = count;
        };
        Loader.prototype.componentLoaded = function (component) {
            this.checkForDuplicate(component);
            this.loadedComponents.push(component);
            this.checkAllLoaded();
        };
        Loader.prototype.checkForDuplicate = function (component) {
            if (this.loadedComponents.indexOf(component) !== -1) {
                throw Error('Trying to load component that is already loaded: ' + component);
            }
        };
        Loader.prototype.checkAllLoaded = function () {
            if (this.loadedComponents.length === this.componentCount) {
                this.allLoadedCallback();
            }
        };
        return Loader;
    })();
    exports.Loader = Loader;
    (function (LoadableComponentType) {
        LoadableComponentType[LoadableComponentType["images"] = 1] = "images";
        LoadableComponentType[LoadableComponentType["canvas"] = 2] = "canvas";
        LoadableComponentType[LoadableComponentType["background"] = 3] = "background";
        LoadableComponentType[LoadableComponentType["connected"] = 4] = "connected";
    })(exports.LoadableComponentType || (exports.LoadableComponentType = {}));
    var LoadableComponentType = exports.LoadableComponentType;
});
//# sourceMappingURL=loader.js.map