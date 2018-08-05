"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractView_1 = require("./AbstractView");
var React = require("react");
var react_dom_1 = require("react-dom");
var Render = /** @class */ (function () {
    function Render() {
        this.main = document.getElementById("main");
        this.a = document.createElement("p");
        this.view = react_dom_1.render(React.createElement(AbstractView_1.AbstractView, null), this.main);
    }
    return Render;
}());
var r = new Render();
//# sourceMappingURL=Render.js.map