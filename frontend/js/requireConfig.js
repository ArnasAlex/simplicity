/// <reference path="typings/refs.d.ts" />
var config = {
    paths: {
        'jquery': './lib/jquery',
        'lodash': './lib/lodash',
        'globalFunctions': './app/shared/globalFunctions'
    },
    shim: {
        lodash: { exports: '_' },
        jquery: { exports: '$' }
    },
    deps: ['lodash', 'jquery', 'globalFunctions']
};
requirejs.config(config);
require(['./app/core/main'], function (main) {
    var x = new main.Main();
});
//# sourceMappingURL=requireConfig.js.map