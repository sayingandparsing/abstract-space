/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/home/reagan/code/proj/abstract-space/AbstractSpace/src";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AbstractView_1 = __webpack_require__(2);
var React = __webpack_require__(0);
var dom = __webpack_require__(4);
var Render = /** @class */ (function () {
    function Render() {
        this.main = document.getElementById("main");
        this.a = document.createElement("p");
        this.view = dom.render(React.createElement(AbstractView_1.AbstractView, null), this.main);
    }
    return Render;
}());
var r = new Render();
//# sourceMappingURL=Render.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
//import * from "React"
var React = __webpack_require__(0);
var electron_1 = __webpack_require__(3);
var AbstractView = /** @class */ (function (_super) {
    __extends(AbstractView, _super);
    function AbstractView(props) {
        var _this = _super.call(this, props) || this;
        console.log('instantiating view');
        _this.ipc = electron_1.ipcRenderer;
        _this.state = {
            items: []
        };
        window.addEventListener('keydown', function (ev) {
            console.log(ev);
            electron_1.ipcRenderer.send('key', ev.key);
        });
        _this.ipc.prependListener('keyup', function (ev) {
            console.log('heard keypress');
            console.log(ev.which);
            _this.ipc.emit('key', ev.which);
        });
        _this.setState(_this.state);
        _this.ipc.on('update', function (event, state) {
            console.log('revieved update event');
            console.log(state);
            _this.setState({
                items: state
            });
        });
        return _this;
    }
    AbstractView.prototype.stateUpdateCallback = function () {
        var _this = this;
        return function (items) {
            _this.setState({
                selections: items
            });
            console.log(_this.state);
        };
    };
    AbstractView.prototype.viewCallbacks = function () {
        var _this = this;
        return {
            update: this.stateUpdateCallback(),
            reset: function () { return _super.prototype.setState.call(_this, {
                items: []
            }); }
        };
    };
    AbstractView.prototype.render = function () {
        var rows = this.state.items.map(function (node) {
            return React.createElement("tr", { className: "list-row" },
                React.createElement("td", { className: (node.nested) ? 'nested-list-key' : 'list-key' }, node.symbol),
                React.createElement("td", { className: (node.nested) ? 'nested-list-value' : 'list-value' }, node.lab));
        });
        return (React.createElement("table", { className: "list-table" },
            React.createElement("tbody", null, rows)));
    };
    return AbstractView;
}(React.Component));
exports.AbstractView = AbstractView;
//# sourceMappingURL=AbstractView.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("react-dom");

/***/ })
/******/ ]);