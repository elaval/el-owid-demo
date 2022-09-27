(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.myBundle = {}));
})(this, (function (exports) { 'use strict';

	const hello = (name) => "Hello, " + name + "!";

	exports.hello = hello;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
