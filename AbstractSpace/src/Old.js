'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var TreeTraversal_1 = require("./TreeTraversal");
var AbstractView_1 = require("./AbstractView");
var React = require("react");
var react_dom_1 = require("react-dom");
var Process = require("process");
var ipc_1 = require("./ipc");
function start() {
    log.debug("executing");
    var stdin = Process.openStdin();
    var active;
    //let keyEventEmitter = new EventEmitter();
    //let keypressListener = new keypress.Listener()
    //let view = new ViewController(window);
    //let view = React.createElement("AbstractView")
    var main = document.getElementById("main");
    var a = document.createElement("p");
    log.debug('creating element');
    var view = react_dom_1.render(React.createElement(AbstractView_1.AbstractView, null), main);
    var traversal = new TreeTraversal_1.TreeTraversal(view);
    /*
        let pub_port = 5502
        let sub_port = 5504
        log.debug('creating socket')
        let zmq = require('zeromq'),
            pub = zmq.socket('pub'),
            sub = zmq.socket('sub')
        log.debug('requested')
        sub.on('message', function(msg) {
            log.debug(msg)
            run_traversal(msg)
        });
        pub.bindSync(`tcp://127.0.0.1:${pub_port}`);
        sub.bindSync(`tcp://127.0.0.1:${sub_port}`);
        pub.send('inital tree')
    */
    var commandTrees;
    var path = 'display';
    var ipc = new ipc_1.RabbitServer(path)
        .on('tree', function (content, replyCb) {
        //log.debug('received tree')
        var name = content['data']['symbol'];
        commandTrees[name] = content;
        log.debug('added ' + name);
    })
        .on(['display', 'tree'], function (content, replyCb) {
        var result = null;
        var requestedTree = commandTrees['standard'];
        log.debug('received display request');
        if (requestedTree !== null) {
            run_traversal(requestedTree, replyCb);
        }
        else {
            log.debug('couldn+\'t find a tree called ' + content);
            replyCb({ type: 'failed' });
        }
    });
    log.debug(ipc.dataHooks);
    function processDisplayRequest(msg) {
        if (!msg.hasOwnProperty('subtype')) {
            log.debug('Expected a subtype for display request');
            return;
        }
        switch (msg.subtype) {
            case 'view':
                break;
            case 'tree':
                var requestedTree = commandTrees[msg.content];
                if (requestedTree !== null) {
                    //run_traversal(requestedTree)
                }
                else {
                    log.debug('couldn+\'t find a tree called ' + msg.content);
                }
        }
    }
    function run_traversal(tree, replyCb) {
        log.debug('adding listener');
        window.addEventListener('keydown', function (ev) {
            log.debug(ev);
            if (active) {
                try {
                    traversal.processKeyEvent(ev.key);
                }
                catch (e) { }
            }
        });
        activateSelection(tree, replyCb);
    }
    function activateSelection(tree, replyCb) {
        traversal.callback = replyCb;
        traversal.resetContext(tree);
        active = true;
    }
    function deactivateSelection() {
        active = false;
    }
    function publishTraversalState(state) {
    }
}
exports.start = start;
start();
//# sourceMappingURL=Old.js.map