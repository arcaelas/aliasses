'use strict';
const __path = require("path");
const __main = '_simulateRepl' in require.main ? undefined : require.main;
const __module = module.constructor.length ? module.constructor : require("module");
const __store = {
    paths: [],
    alias: {},
    aliasNames: [],
};
let __nodeModulePaths = __module._nodeModulePaths;
__module._nodeModulePaths = src => {
    let paths = __nodeModulePaths.call(__module, src);
    return src.indexOf("node_modules") < 0 ? __store.paths.concat(paths) : paths;
};
let __resolveFilename = __module._resolveFilename;
__module._resolveFilename = function _resolveFilename(req, parent, main, opts) {
    for (let alias of __store.aliasNames) {
        if (isAlias(req, alias)) {
            let target = __store.alias[alias];
            if (typeof target === 'function') {
                let from = parent.filename;
                target = target(from, req, alias);
                if (!target || typeof target !== 'string')
                    throw new Error('[module-alias] Expecting custom handler function to return path.');
            }
            req = __path.join(target, req.substr(alias.length));
            break;
        }
    }
    return __resolveFilename.call(this, req, parent, main, opts);
};
function isAlias(path, alias) {
    return path.indexOf(alias) === 0 && (path.length === alias.length || path[alias.length] === '/');
}
function removeAlias(path, target) {
    if (target) {
        let i = target.indexOf(path);
        if (i >= 0)
            target.splice(i, 1);
    }
}
var Arcaela;
(function (Arcaela) {
    let aliasses;
    (function (aliasses) {
        /**
         *
         * @param {string} alias
         * @param {string} target
         */
        function add(alias, target) {
            __store.alias[alias] = target;
            __store.aliasNames = Object.keys(__store.alias);
            __store.aliasNames = __store.aliasNames.sort();
        }
        aliasses.add = add;
        /**
         * @example
         * merge({
         *  "js":__dirname + "/dist/js/",
         *  "css":__dirname + "/dist/css/",
         * });
         *
         * require("js/index");
         * require("css/index.css");
         *
         * @param alias - Add aliasses as Object Alias
         */
        function merge(alias) {
            for (let a in alias)
                add(a, alias[a]);
        }
        aliasses.merge = merge;
        /**
         * Remove all aliasses from registry.
         */
        function reset() {
            __store.paths.forEach(function (path) {
                if (__main)
                    removeAlias(path, __main.paths);
                Object.getOwnPropertyNames(require.cache).forEach(function (name) {
                    if (name.indexOf(path) !== -1)
                        delete require.cache[name];
                });
                var parent = module.parent;
                while (parent && parent !== __main) {
                    removeAlias(path, parent.paths);
                    parent = parent.parent;
                }
            });
            __store.paths = [];
            __store.alias = {};
            __store.aliasNames = [];
        }
        aliasses.reset = reset;
    })(aliasses = Arcaela.aliasses || (Arcaela.aliasses = {}));
})(Arcaela || (Arcaela = {}));
module.exports = Arcaela.aliasses;
