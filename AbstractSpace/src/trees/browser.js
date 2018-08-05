"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command_1 = require("../cmd_types/command");
var C = command_1.MsgCommandFacory('vivaldi');
exports.tree = {
    lab: 'vivaldi',
    t: {
        lab: 'tab',
        fn: 'fn(tab)',
        l: C('go left', 'go_tab_left'),
        r: C('go right', 'go_tab_right'),
        n: C('new', 'new_tab'),
        N: {},
        w: {
            lab: 'window',
            fn: 'fn(window.as(tab))',
            n: C('new', 'new_window'),
            k: C('kill', 'close_window')
        },
        k: {
            lab: 'kill',
            fn: '+kill(tab.which($x))',
            c: C('current', 'close_current_tab'),
            l: C('left', 'close_tabs_left'),
            r: C('right', 'close_tabs_right')
        },
        a: {
            lab: 'activate',
            n: C('newest', 'activate_tab_newest'),
            p: C('previous', 'activate_tab_previous')
        }
    },
    v: {
        lab: 'view',
        fn: '+open($view)',
        b: C('bookmarks', 'view_bookmarks'),
        d: C('downloads', 'view_downloads'),
        e: C('extensions', 'view_extensions'),
        h: C('history', 'view_history'),
        s: C('settings', 'view_settings'),
    }
};
//# sourceMappingURL=browser.js.map