declare namespace Arcaela {
    module aliasses {
        /**
         *
         * @param {string} alias
         * @param {string} target
         */
        function add(alias: string, target: string): void;
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
        function merge(alias: Record<string, string>): void;
        /**
         * Remove all aliasses from registry.
         */
        function reset(): void;
    }
}
declare const _default: typeof Arcaela.aliasses;
export = _default;
