/// <reference path="typings/refs.d.ts" />
var config: RequireConfig = {
    paths: {
        'jquery': './lib/jquery',
        'lodash': './lib/lodash',
        'globalFunctions': './app/shared/globalFunctions'
    },
    shim: {
        lodash: {exports: '_'},
        jquery: {exports: '$'}
    },
    deps: ['lodash', 'jquery', 'globalFunctions']
};

requirejs.config(config);

require(['./app/core/main'], (main) => {
    var x = new main.Main();
});
