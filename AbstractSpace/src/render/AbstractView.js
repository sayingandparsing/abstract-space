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
var electron_1 = require("electron");
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