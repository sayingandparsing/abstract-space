'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var TreeTraversal_1 = require("./TreeTraversal");
var AbstractView_1 = require("./AbstractView");
var React = require("react");
var react_dom_1 = require("react-dom");
var Process = require("process");
var ipc_1 = require("./ipc");
function start() {
    console.log("executing");
    var stdin = Process.openStdin();
    var active;
    //let keyEventEmitter = new EventEmitter();
    //let keypressListener = new keypress.Listener()
    //let view = new ViewController(window);
    //let view = React.createElement("AbstractView")
    var main = document.getElementById("main");
    var a = document.createElement("p");
    console.log('creating element');
    var view = react_dom_1.render(React.createElement(AbstractView_1.AbstractView, null), main);
    var traversal = new TreeTraversal_1.TreeTraversal(view);
    /*
        let pub_port = 5502
        let sub_port = 5504
        console.log('creating socket')
        let zmq = require('zeromq'),
            pub = zmq.socket('pub'),
            sub = zmq.socket('sub')
        console.log('requested')
        sub.on('message', function(msg) {
            console.log(msg)
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
        //console.log('received tree')
        var name = content['data']['symbol'];
        commandTrees[name] = content;
        console.log('added ' + name);
    })
        .on(['display', 'tree'], function (content, replyCb) {
        var result = null;
        var requestedTree = commandTrees['standard'];
        console.log('received display request');
        if (requestedTree !== null) {
            run_traversal(requestedTree, replyCb);
        }
        else {
            console.log('couldn+\'t find a tree called ' + content);
            replyCb({ type: 'failed' });
        }
    });
    console.log(ipc.dataHooks);
    function processDisplayRequest(msg) {
        if (!msg.hasOwnProperty('subtype')) {
            console.log('Expected a subtype for display request');
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
                    console.log('couldn+\'t find a tree called ' + msg.content);
                }
        }
    }
    function run_traversal(tree, replyCb) {
        console.log('adding listener');
        window.addEventListener('keydown', function (ev) {
            console.log(ev);
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