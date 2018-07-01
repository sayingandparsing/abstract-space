'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var TreeTraversal_1 = require("./TreeTraversal");
var AbstractView_1 = require("./AbstractView");
var React = require("react");
var react_dom_1 = require("react-dom");
var ipc_1 = require("./ipc");
var electron_1 = require("electron");
var SingleViewService_1 = require("./SingleViewService");
var ProcessController = /** @class */ (function () {
    function ProcessController() {
        var _this = this;
        //let keyEventEmitter = new EventEmitter();
        //let keypressListener = new keypress.Listener()
        //let view = new ViewController(window);
        //let view = React.createElement("AbstractView")
        this.main = document.getElementById("main");
        this.a = document.createElement("p");
        this.view = react_dom_1.render(React.createElement(AbstractView_1.AbstractView, null), this.main);
        this.traversal = new TreeTraversal_1.TreeTraversal(this.view, this.deactivateSelection);
        this.viewService = new SingleViewService_1.SingleViewService(this.view);
        this.path = 'display';
        this.commandTrees = {};
        this.ipc = new ipc_1.RabbitServer(this.path)
            .on('tree', function (content, replyCb) {
            console.log('received tree');
            var name = content['data']['symbol'];
            _this.commandTrees[name] = content;
            //console.log(this.commandTrees)
            //console.log('added ' + name)
        })
            .on(['display', 'tree'], function (content, replyCb) {
            var requestedTree = _this.commandTrees['standard'];
            console.log('received display request');
            if (requestedTree !== null) {
                //console.log(requestedTree)
                _this.run_traversal(requestedTree, replyCb);
            }
            else {
                console.log('couldn+\'t find a tree called ' + content);
                replyCb({ type: 'failed' });
            }
        })
            .on('chain view', function (content, replyCb) {
            _this.viewService.display(content, replyCb);
        })
            .on('end chain', function (content, replyCb) {
            _this.viewService.breakChain();
        })
            .createServer();
    }
    ProcessController.prototype.processDisplayRequest = function (msg) {
        if (!msg.hasOwnProperty('subtype')) {
            console.log('Expected a subtype for display request');
            return;
        }
        switch (msg.subtype) {
            case 'view':
                break;
            case 'tree':
                var requestedTree = this.commandTrees[msg.content];
                if (requestedTree !== null) {
                    //run_traversal(requestedTree)
                }
                else {
                    console.log('couldn+\'t find a tree called ' + msg.content);
                }
        }
    };
    ProcessController.prototype.run_traversal = function (tree, replyFn) {
        var _this = this;
        console.log('running traversal');
        window.addEventListener('keydown', function (ev) {
            //console.log(ev)
            if (_this.active) {
                try {
                    _this.traversal.processKeyEvent(ev.key);
                }
                catch (e) {
                }
            }
        });
        this.activateSelection(tree, replyFn);
    };
    ProcessController.prototype.activateSelection = function (tree, replyCb) {
        this.traversal.callback = replyCb;
        this.traversal.resetContext(tree);
        this.active = true;
        electron_1.remote.getCurrentWindow().show();
    };
    ProcessController.prototype.deactivateSelection = function () {
        this.active = false;
        electron_1.remote.getCurrentWindow().hide();
        //// REPLACE
        //window.removeEventListener('keydown')
    };
    ProcessController.prototype.publishTraversalState = function (state) {
    };
    return ProcessController;
}());
console.log('executing');
var p = new ProcessController();
//# sourceMappingURL=ProcessController.js.map