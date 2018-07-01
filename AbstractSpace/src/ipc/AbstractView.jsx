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
var React = require("react");
var AbstractView = (function (_super) {
    __extends(AbstractView, _super);
    function AbstractView(props) {
        var _this = _super.call(this, props) || this;
        _super.prototype.state = {
            selections: []
        };
        return _this;
    }
    AbstractView.prototype.stateUpdateCallback = function () {
        var _this = this;
        return function (items) {
            _super.prototype.setState.call(_this, {
                selections: items
            });
        };
    };
    AbstractView.prototype.viewCallbacks = function () {
        var _this = this;
        return {
            update: this.stateUpdateCallback(),
            reset: function () { return _super.prototype.setState.call(_this, {
                selections: []
            }); }
        };
    };
    AbstractView.prototype.render = function () {
        var rows = this.state.selections
            .map(function (node) {
            return <row class="list-row">
                <cell class="list-key">{node.symbol}</cell>
                <cell class="list-value">{node.name}</cell>
            </row>;
        });
        return (<table class="list-table">{rows}</table>);
    };
    return AbstractView;
}(React.Component));
exports.AbstractView = AbstractView;
