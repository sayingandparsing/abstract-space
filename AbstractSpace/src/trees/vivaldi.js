"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command_1 = require("../cmd_types/command");
var tree = {
    v: {
        lab: 'vivaldi',
        t: {
            lab: 'tab',
            fn: 'fn(tab)',
            l: new command_1.KeyCommand('left', 'c.PageUp'),
            r: new command_1.KeyCommand('right', 'c.PageDown'),
            n: new command_1.KeyCommand('new', 'c.t'),
            w: {
                lab: 'window',
                fn: 'fn(window.as(tab))',
                n: new command_1.KeyCommand('new', 'c.n'),
                k: new command_1.KeyCommand('kill', 'c.s.w')
            },
            k: {
                lab: 'kill',
                fn: '+kill(tab.which($x))',
                c: new command_1.KeyCommand('current', 'c.w'),
            }
        },
        v: {
            lab: 'view',
            fn: '+open($view)',
            b: new command_1.KeyCommand('bookmarks', 'c.b'),
            d: new command_1.KeyCommand('downloads', 'c.d'),
            e: new command_1.KeyCommand('extensions', 'c.s.e'),
            h: new command_1.KeyCommand('history', 'c.h'),
            s: new command_1.KeyCommand('settings', 'a.p'),
        }
    }
};
//# sourceMappingURL=vivaldi.js.map