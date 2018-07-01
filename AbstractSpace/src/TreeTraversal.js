"use strict";
/**
 * Created by rmacc on 5/2/2017.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = require("events");
var TreeTraversal = /** @class */ (function () {
    //type NodeSymbol = String
    function TreeTraversal(view, deactivate) {
        this.viewEmitter = new EventEmitter();
        this.updateViewState = view.stateUpdateCallback();
        this.deactivate = deactivate;
    }
    TreeTraversal.prototype.resetContext = function (root) {
        console.log(root);
        this.context = {
            root: root,
            current: root,
            level: root.subtree.map(function (item) { return item.data; }),
            path: []
        };
        console.log('context');
        this.updateViewState(this.context.level);
    };
    TreeTraversal.prototype.processKeyEvent = function (key) {
        if (key === 'Escape') {
            console.log("Terminated");
            this.callback({
                type: 'failed',
                path: this.context.path
            });
            this.deactivate();
            return;
        }
        var symbols = this.context.level.map(function (node) { return node.symbol; });
        if (symbols.indexOf(key) > -1) {
            console.log("update!!!");
            this.context.path.push(key);
            var current = this.context.current;
            console.log("current");
            this.context.current = current.subtree[current.subtree.map(function (node) { return node.data.symbol; }).indexOf(key)];
            if (this.isTerminal(this.context.current)) {
                console.log("is terminal");
                var term = this.context.current;
                this.callback({
                    type: 'command',
                    path: this.context.path,
                    content: term.command
                });
                this.deactivate();
                return;
            }
            else {
                var level = this.extractLevel(this.context.current);
                if (level) {
                    this.context.level = level;
                    console.log('updating view state');
                    this.updateViewState(level);
                }
                else {
                    this.callback({
                        type: 'failure',
                        path: this.context.path
                    });
                    this.deactivate();
                    return;
                }
            }
        }
    };
    TreeTraversal.prototype.sendShutdownSignal = function () {
    };
    TreeTraversal.prototype.connectedTo = function (n, sym) {
        for (var _i = 0, _a = n.subtree; _i < _a.length; _i++) {
            var conn = _a[_i];
            if (conn.data.symbol === sym)
                return true;
        }
        return false;
    };
    TreeTraversal.prototype.extractLevel = function (node) {
        return node.subtree.map(function (desc) { return desc.data; });
    };
    TreeTraversal.prototype.isTerminal = function (node) {
        console.log("is terminal?");
        return node.command !== undefined;
    };
    return TreeTraversal;
}());
exports.TreeTraversal = TreeTraversal;
//# sourceMappingURL=TreeTraversal.js.map