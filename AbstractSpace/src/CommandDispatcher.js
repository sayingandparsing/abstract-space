"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataTypes_1 = require("./DataTypes");
var electron_1 = require("electron");
//import * as child_process from "child-process"
var CommandDispatcher = /** @class */ (function () {
    //commandRegistry: MapLike<String,Command>
    function CommandDispatcher() {
    }
    CommandDispatcher.prototype.notifyProcessState = function (msg) {
        console.log("notified of process result");
        console.log(msg);
        switch (msg.event) {
            case DataTypes_1.ProcessState.TERMINATED:
                this.closeWindow();
                break;
            case DataTypes_1.ProcessState.COMPLETED:
                this.closeWindow();
                this.executeCommand(msg.command);
                break;
        }
    };
    CommandDispatcher.prototype.closeWindow = function () {
        electron_1.remote.getCurrentWindow().hide();
    };
    CommandDispatcher.prototype.executeCommand = function (commandId) {
        switch (commandId.type) {
            case "KEYS":
                console.log('simulating keys');
                console.log("\"from pywinauto.keyboard import SendKeys; SendKeys('" + commandId.arg + "')\"");
        }
    };
    return CommandDispatcher;
}());
exports.CommandDispatcher = CommandDispatcher;
//# sourceMappingURL=CommandDispatcher.js.map