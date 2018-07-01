"use strict";
/**
 * Created by rmacc on 6/7/2017.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var DataTypes_1 = require("./DataTypes");
var ViewController = /** @class */ (function () {
    function ViewController(window) {
        this.window = window;
    }
    ViewController.prototype.message = function (msg) {
        if (msg.signal) {
            this.processSignal(msg.signal);
        }
        else {
            this.updateView(msg);
        }
    };
    ViewController.prototype.processSignal = function (signal) {
        switch (signal) {
            case DataTypes_1.ProcessState.TERMINATED:
        }
    };
    ViewController.prototype.updateView = function (msg) {
        var table = document.createElement('table');
        for (var _i = 0, _a = Object.keys(msg); _i < _a.length; _i++) {
            var item = _a[_i];
            var row = table.insertRow();
            var cell1 = row.insertCell(0);
            cell1.innerHTML = item.toString();
            var cell2 = row.insertCell(1);
            cell2.innerHTML = msg[item];
            this.tableDiv.remove(this.table);
            this.table = table;
            this.tableDiv.appendElement(this.table);
        }
    };
    return ViewController;
}());
exports.ViewController = ViewController;
//# sourceMappingURL=ViewController.js.map