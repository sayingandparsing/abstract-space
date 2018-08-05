"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataTypes_1 = require("./DataTypes");
var electron_1 = require("electron");
var logger_1 = require("./util/logger");
//import * as child_process from "child-process"
var CommandDispatcher = /** @class */ (function () {
    //commandRegistry: MapLike<String,Command>
    function CommandDispatcher() {
    }
    CommandDispatcher.prototype.notifyProcessState = function (msg) {
        logger_1.log.debug("notified of process result");
        logger_1.log.debug(msg);
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
                logger_1.log.debug('simulating keys');
                logger_1.log.debug("\"from pywinauto.keyboard import SendKeys; SendKeys('" + commandId.arg + "')\"");
            /*                let x = child_process.spawn('python.exe',
                                ['C:\\Users\\rmacc\\as_scripts\\simulate_key.py', commandId.arg],
                                //['-c', `"from pywinauto.keyboard import SendKeys; SendKeys('${commandId.arg}')"`],
                                {
                                    detached: true,
                                    stdio: 'ignore'
                                })*/
            /*				x.on('exit', function (code, signal) {
                                log.debug('child process exited with ' +
                                    `code ${code} and signal ${signal}`);
                            });
                            x.stdout.on('data', (data) => {
                                log.debug(`child stdout:\n${data}`);
                            });
            
                            x.stderr.on('data', (data) => {
                                console.error(`child stderr:\n${data}`);
                            });*/
            //'python.exe C:\\Users\\rmacc\\as_scripts\\simulate_key.py "' + commandId.arg + '"')
        }
    };
    return CommandDispatcher;
}());
exports.CommandDispatcher = CommandDispatcher;
//# sourceMappingURL=CommandDispatcher.js.map