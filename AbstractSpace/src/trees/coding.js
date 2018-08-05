"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command_1 = require("../cmd_types/command");
var Cmd = command_1.MsgCommandFacory('vivaldi');
exports.tree = {
    f: {
        lab: 'format',
        fn: 'format::fn($obj)',
        c: {
            lab: 'call'
        },
        f: {
            lab: 'function',
            fn: 'format::fn(function)',
            p: {
                lab: 'parameters'
            }
        }
    },
    s: {
        lab: 'search',
        fn: 'search($obj)[.in($cxt)]',
        l: Cmd('line', 'select-line'),
        s: {
            lab: 'symbol',
            p: Cmd('in project', 'search-sym-project'),
            f: Cmd('in file', 'search-sym-file'),
        },
        f: {
            lab: 'file',
            'o': Cmd('open', 'search-open-file'),
            'p': Cmd('in project', 'search-project-file'),
        },
        m: {
            lab: 'mark'
        },
        o: {
            lab: 'object'
        }
    }
};
//# sourceMappingURL=coding.js.map