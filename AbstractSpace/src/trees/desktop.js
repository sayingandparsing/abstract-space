"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command_1 = require("../cmd_types/command");
var Kde = function (cmd, title) {
    var name = (title) ? title : cmd;
    var cmdStr = "qdbus org.kde.kglobalaccel /component/kwin invokeShortcut \"" + cmd + "\"";
    return new command_1.ShellCommand(name, cmdStr);
};
var Sh = function (name, cmd) {
    return new command_1.ShellCommand(name, (cmd)
        ? cmd
        : name);
};
var Shl = function (name) {
    try {
        var cmd = cmds['name'];
        return Sh(name, cmd);
    }
    catch (_a) {
        return null;
    }
};
var cmds = {
    'ranger': 'alacritty -e ranger',
    'update': 'trizen -Syyu',
    'python': 'alacritty -e ipython',
    'ammonite': 'alacritty -e ammonite',
    'intellij': 'intellij-idea-ultimate-edition'
};
exports.tree = {
    lab: 'desktop',
    l: {
        lab: 'launch',
        b: Sh('vivaldi', 'vivaldi-stable'),
        d: {
            lab: 'development',
            p: Shl('python'),
            a: Shl('ammonite'),
            i: Shl('intellij')
        },
        e: Sh('vs code', 'code'),
        r: Sh('ranger', 'alacritty -e ranger'),
        f: Sh('firefox'),
        s: {
            lab: 'system',
            s: Sh('settings', 'systemsettings5')
        }
    },
    w: {
        lab: 'window',
        fn: 'fn($window)',
        c: Kde('Window Close', 'close'),
        m: Kde('Window Maximize', 'maximize'),
        h: Kde('Window Minimize', 'hide'),
        l: Kde('Window Quick Tile Left', 'left'),
        r: Kde('Window Quick Tile Right', 'right'),
        e: Kde('Expose', 'expose'),
        d: {
            lab: 'desktop',
            d: Kde('Switch One Desktop Down', 'down'),
            u: Kde('Switch One Desktop Up', 'up'),
        }
    },
    s: {
        lab: 'system',
        u: '',
        l: {
            lab: 'logs',
        }
    }
};
//# sourceMappingURL=desktop.js.map