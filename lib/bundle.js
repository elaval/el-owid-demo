(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["owid-demo"] = {}, global.d3));
})(this, (function (exports, d3) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var d3__namespace = /*#__PURE__*/_interopNamespace(d3);

    class OWIDTrendChart {
        data = [];
        container;
        constructor(data, options) {
            this.data = data;
            this.container = d3__namespace.create("svg");
        }
        render() {
            return this.container.node();
        }
    }

    const hello = (name) => "Hello, " + name + "!";
    function OWIDPlot(data, options) {
        const chart = new OWIDTrendChart(data, options);
        return chart.render();
    }

    exports.OWIDPlot = OWIDPlot;
    exports.hello = hello;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
