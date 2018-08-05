"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command_1 = require("../cmd_types/command");
var Kde = function (cmd, title) {
    var name = (title) ? title : cmd;
    var cmdStr = "qdbus org.kde.kglobalaccel /component/kwin invokeShortcut \"" + cmd + "\"";
    return new command_1.ShellCommand(name, cmdStr);
};
exports.tree = {
    lab: 'desktop',
    w: {
        lab: 'window',
        fn: 'fn($window)',
        c: Kde('close'),
        m: Kde('maximize'),
        l: Kde('Window Quick Tile Left', 'left'),
        r: Kde('right'),
        e: Kde('Expose', 'expose')
    }
};
//# sourceMappingURL=desktop.js.map