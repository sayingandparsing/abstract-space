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
var electron_1 = require("electron");
var PseudoWindow = /** @class */ (function (_super) {
    __extends(PseudoWindow, _super);
    function PseudoWindow() {
        return _super.call(this) || this;
    }
    PseudoWindow.prototype.show = function () { };
    PseudoWindow.prototype.hide = function () { };
    return PseudoWindow;
}(electron_1.BrowserWindow));
var ProcessControllerTest = /** @class */ (function () {
    function ProcessControllerTest() {
    }
    return ProcessControllerTest;
}());
//# sourceMappingURL=process-contoller.js.map