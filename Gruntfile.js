/// <reference path="backend/typings/refs.d.ts" />
(module).exports = function (grunt) {
    var reqConfig = RequireConfigTransformer.getConfig();
    var coverageRequireConfig = RequireConfigTransformer.getCoverageConfig(grunt);
    grunt.initConfig({
        jasmine_nodejs: {
            options: {
                specNameSuffix: "spec.js",
                helperNameSuffix: "helper.js",
                useHelpers: false,
                stopOnFailure: false,
                reporters: {
                    console: {
                        colors: true,
                        cleanStack: 1,
                        verbosity: 3,
                        listStyle: "indent",
                        activity: false
                    }
                },
                customReporters: []
            },
            your_target: {
                options: {
                    useHelpers: false
                },
                specs: [
                    "test/backend/spec/**/*"
                ],
                helpers: [
                    "test/helpers/**"
                ]
            }
        },
        jasmine: {
            src: 'frontend/js/app/**/*.js',
            options: {
                specs: 'test/frontend/spec/**/*.spec.js',
                template: require('grunt-template-jasmine-requirejs'),
                templateOptions: {
                    requireConfig: reqConfig
                },
                keepRunner: true,
                outfile: 'specRunnerFrontend.html'
            },
            test: {},
            coverage: {
                src: 'frontend/js/app/**/*.js',
                options: {
                    specs: ['test/frontend/spec/**/*.spec.js'],
                    //mask: '**/*.spec.js',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'test/frontend/coverage/coverage.json',
                        report: [
                            {
                                type: 'html',
                                options: {
                                    dir: 'test/frontend/coverage/html'
                                }
                            },
                            {
                                type: 'text-summary'
                            }
                        ],
                        replace: false,
                        template: require('grunt-template-jasmine-requirejs'),
                        templateOptions: {
                            requireConfig: coverageRequireConfig
                        }
                    }
                }
            }
        },
        ts: {
            frontend: {
                src: ['frontend/js/app/**/*.ts', 'test/frontend/spec/**/*.ts'],
                options: {
                    module: 'amd'
                }
            },
            backend: {
                src: ['backend/**/*.ts', 'test/backend/spec/**/*.ts'],
                options: {
                    module: 'commonjs'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-jasmine-nodejs');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks("grunt-ts");
    grunt.registerTask('testFront', ['jasmine:test']);
    grunt.registerTask('testBack', ['jasmine_nodejs']);
    grunt.registerTask('compileFront', ['ts:frontend']);
    grunt.registerTask('compileBack', ['ts:backend']);
    grunt.registerTask('ctf', ['compileFront', 'testFront']);
};
// Fakes for TS compilation
var define;
var requirejs;
var RequireConfigTransformer = (function () {
    function RequireConfigTransformer() {
    }
    RequireConfigTransformer.getConfig = function () {
        var config = RequireConfigTransformer.readFile();
        config = RequireConfigTransformer.getConfigVariable(config);
        config = RequireConfigTransformer.parseJson(config);
        return config;
    };
    RequireConfigTransformer.getCoverageConfig = function (grunt) {
        var config = RequireConfigTransformer.getConfig();
        config.config = {
            instrumented: {
                src: grunt.file.expand('frontend/js/app/**/*.js')
            }
        };
        config.callback = function () {
            define('instrumented', ['module'], function (module) {
                return module.config().src;
            });
            var requireFakeForTs = require;
            requireFakeForTs(['instrumented'], function (instrumented) {
                var oldLoad = requirejs.load;
                requirejs.load = function (context, moduleName, url) {
                    // normalize paths
                    if (url.substring(0, 1) == '/') {
                        url = url.substring(1);
                    }
                    else if (url.substring(0, 2) == './') {
                        url = url.substring(2);
                    }
                    // redirect
                    if (instrumented.indexOf(url) > -1) {
                        url = './.grunt/grunt-contrib-jasmine/' + url;
                    }
                    return oldLoad.apply(this, [context, moduleName, url]);
                };
            });
        };
        return config;
    };
    RequireConfigTransformer.readFile = function () {
        var fs = require('fs');
        return fs.readFileSync('./frontend/js/requireConfig.js').toString();
    };
    RequireConfigTransformer.getConfigVariable = function (configFile) {
        var configStart = configFile.indexOf('{');
        var configEnd = configFile.indexOf('};');
        return configFile.substring(configStart, configEnd + 1);
    };
    RequireConfigTransformer.parseJson = function (config) {
        var replacedJson = config.replace(/'/g, '"');
        replacedJson = replacedJson.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
        var changedPaths = replacedJson.replace(/.\/lib/g, '.\/frontend\/js\/lib');
        changedPaths = changedPaths.replace(/.\/app\/shared/g, '.\/frontend\/js\/app\/shared');
        return JSON.parse(changedPaths);
    };
    return RequireConfigTransformer;
})();
//# sourceMappingURL=Gruntfile.js.map