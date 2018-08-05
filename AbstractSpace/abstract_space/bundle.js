/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/home/reagan/code/proj/AbstractSpace/src";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TreeTraversal_1 = __webpack_require__(2);
var AbstractView_1 = __webpack_require__(4);
var React = __webpack_require__(0);
var react_dom_1 = __webpack_require__(5);
var ipc_1 = __webpack_require__(6);
var electron_1 = __webpack_require__(9);
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
        this.path = 'display';
        this.commandTrees = {};
        this.ipc = new ipc_1.RabbitServer(this.path)
            .on('tree', function (content, replyCb) {
            log.debug('received tree');
            var name = content['data']['symbol'];
            _this.commandTrees[name] = content;
            //log.debug(this.commandTrees)
            //log.debug('added ' + name)
        })
            .on(['display', 'tree'], function (content, replyCb) {
            var requestedTree = _this.commandTrees['standard'];
            log.debug('received display request');
            if (requestedTree !== null) {
                //log.debug(requestedTree)
                _this.run_traversal(requestedTree, replyCb);
            }
            else {
                log.debug('couldn+\'t find a tree called ' + content);
                replyCb({ type: 'failed' });
            }
        })
            .createServer();
    }
    ProcessController.prototype.processDisplayRequest = function (msg) {
        if (!msg.hasOwnProperty('subtype')) {
            log.debug('Expected a subtype for display request');
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
                    log.debug('couldn+\'t find a tree called ' + msg.content);
                }
        }
    };
    ProcessController.prototype.run_traversal = function (tree, replyCb) {
        var _this = this;
        //log.debug('adding listener')
        window.addEventListener('keydown', function (ev) {
            //log.debug(ev)
            if (_this.active) {
                try {
                    _this.traversal.processKeyEvent(ev.key);
                }
                catch (e) {
                }
            }
        });
        this.activateSelection(tree, replyCb);
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
    };
    ProcessController.prototype.publishTraversalState = function (state) {
    };
    return ProcessController;
}());
log.debug('executing');
var p = new ProcessController();
//# sourceMappingURL=ProcessController.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Created by rmacc on 5/2/2017.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = __webpack_require__(3);
var TreeTraversal = /** @class */ (function () {
    //type NodeSymbol = String
    function TreeTraversal(view, deactivate) {
        this.viewEmitter = new EventEmitter();
        this.updateViewState = view.stateUpdateCallback();
        this.deactivate = deactivate;
    }
    TreeTraversal.prototype.resetContext = function (root) {
        this.context = {
            root: root,
            current: root,
            level: root.subtree.map(function (item) { return item.data; }),
            path: []
        };
        log.debug('context');
        this.updateViewState(this.context.level);
    };
    TreeTraversal.prototype.processKeyEvent = function (key) {
        if (key === 'Escape') {
            log.debug("Terminated");
            this.callback({
                type: 'failed',
                path: this.context.path
            });
            this.deactivate();
            return;
        }
        var symbols = this.context.level.map(function (node) { return node.symbol; });
        if (symbols.indexOf(key) > -1) {
            log.debug("update!!!");
            this.context.path.push(key);
            var current = this.context.current;
            log.debug("current");
            this.context.current = current.subtree[current.subtree.map(function (node) { return node.data.symbol; }).indexOf(key)];
            if (this.isTerminal(this.context.current)) {
                log.debug("is terminal");
                var term = this.context.current;
                this.callback({
                    type: 'command',
                    path: this.context.path,
                    content: term.command
                });
                this.deactivate();
                return;
            }
            else {
                var level = this.extractLevel(this.context.current);
                if (level) {
                    this.context.level = level;
                    log.debug('updating view state');
                    this.updateViewState(level);
                }
                else {
                    this.callback({
                        type: 'failure',
                        path: this.context.path
                    });
                    this.deactivate();
                    return;
                }
            }
        }
    };
    TreeTraversal.prototype.sendShutdownSignal = function () {
    };
    TreeTraversal.prototype.connectedTo = function (n, sym) {
        for (var _i = 0, _a = n.subtree; _i < _a.length; _i++) {
            var conn = _a[_i];
            if (conn.data.symbol === sym)
                return true;
        }
        return false;
    };
    TreeTraversal.prototype.extractLevel = function (node) {
        return node.subtree.map(function (desc) { return desc.data; });
    };
    TreeTraversal.prototype.isTerminal = function (node) {
        log.debug("is terminal?");
        return node.command !== undefined;
    };
    return TreeTraversal;
}());
exports.TreeTraversal = TreeTraversal;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
//import * from "React"
var React = __webpack_require__(0);
var AbstractView = /** @class */ (function (_super) {
    __extends(AbstractView, _super);
    function AbstractView(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            selections: []
        };
        return _this;
    }
    AbstractView.prototype.stateUpdateCallback = function () {
        var _this = this;
        return function (items) {
            _this.setState({
                selections: items
            });
        };
    };
    AbstractView.prototype.viewCallbacks = function () {
        var _this = this;
        return {
            update: this.stateUpdateCallback(),
            reset: function () { return _super.prototype.setState.call(_this, {
                selections: []
            }); }
        };
    };
    AbstractView.prototype.render = function () {
        log.debug('rendering');
        var rows = this.state.selections
            .map(function (node) {
            return React.createElement("tr", { className: "list-row" },
                React.createElement("td", { className: "list-key" }, node.symbol),
                React.createElement("td", { className: "list-value" }, node.label));
        });
        return (React.createElement("table", { className: "list-table" },
            React.createElement("tbody", null, rows)));
    };
    return AbstractView;
}(React.Component));
exports.AbstractView = AbstractView;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("react-dom");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var net = __webpack_require__(7);
var ProcessInterface = /** @class */ (function () {
    function ProcessInterface(port, dataHooks) {
        if (dataHooks === void 0) { dataHooks = {}; }
        this.port = port;
        this.dataHooks = dataHooks;
    }
    ProcessInterface.prototype.createConnection = function (port) {
        var _this = this;
        this.socket = net.createConnection(port, function (sock) {
            sock.on('data', function (msg) {
                _this.handleIncoming(_this.parse(msg));
            });
        });
    };
    ProcessInterface.prototype.handleIncoming = function (msg) {
        var type = msg.type, data = msg.data;
        this.dataHooks[type](data);
    };
    ProcessInterface.prototype.on = function (type, fn) {
        this.dataHooks[type] = fn;
        return this;
    };
    ProcessInterface.prototype.parse = function (data) {
        return JSON.parse(data.trim());
    };
    ProcessInterface.prototype.send = function (typ, content, meta) {
        if (meta === void 0) { meta = null; }
        this.socket.write({
            type: typ,
            content: content,
            meta: meta
        }.toString());
    };
    return ProcessInterface;
}());
exports.ProcessInterface = ProcessInterface;
var IpcServer = /** @class */ (function () {
    function IpcServer(path) {
        this.dataHooks = {};
        this.path = path;
    }
    IpcServer.prototype.createServer = function () {
        var _this = this;
        this.server = net.createServer();
        this.server.listen(this.path);
        this.server.on('connection', function (socket) {
            socket.on('message', function (msg) {
                _this.handleIncoming(_this.parse(msg), socket);
            });
        });
    };
    IpcServer.prototype.handleIncoming = function (msg, socket) {
        var type = msg.type, content = msg.content;
        this.dataHooks[type](content);
    };
    IpcServer.prototype.on = function (type, fn) {
        this.dataHooks[type] = fn;
        return this;
    };
    IpcServer.prototype.parse = function (data) {
        return JSON.parse(data);
    };
    return IpcServer;
}());
exports.IpcServer = IpcServer;
var amqp = __webpack_require__(8);
var RabbitServer = /** @class */ (function () {
    function RabbitServer(name) {
        this.dataHooks = {};
        this.name = name;
    }
    RabbitServer.prototype.createServer = function () {
        var _this = this;
        amqp.connect('amqp://localhost', function (err, conn) {
            conn.createChannel(function (err, ch) {
                ch.assertQueue(_this.name, { durable: false });
                log.debug('created channel');
                ch.consume(_this.name, function (msg) {
                    _this.handleIncoming(_this.parse(msg), function (reply) {
                        log.debug('relied to sender');
                        var replyBuff = new Buffer(JSON.stringify(reply));
                        ch.sendToQueue(
                        //'daemon',
                        msg.properties.replyTo, replyBuff ///w Buffer(replyStr),
                        //{correlationId: msg.properties.correlationId}
                        );
                    });
                    ch.ack(msg);
                });
            });
        });
    };
    RabbitServer.prototype.handleIncoming = function (msg, replyCb) {
        var type = msg['type'], content = msg['content'];
        var subtype;
        if (msg.hasOwnProperty('subtype')) {
            subtype = msg['subtype'];
        }
        else {
            subtype = null;
        }
        //log.debug('type: ' + type + ', content: ' + content + ', subtree: ' +subtype)
        if (subtype !== null) {
            var f = this.dataHooks[type][subtype];
            f(content, replyCb);
        }
        else {
            var f = this.dataHooks[type];
            f(content, replyCb);
        }
    };
    RabbitServer.prototype.on = function (type, fn) {
        if (typeof (type) === 'string') {
            this.dataHooks[type] = fn;
        }
        else {
            var subtype = void 0;
            var type2 = type[0];
            subtype = type[1];
            this.dataHooks[type2] = {};
            this.dataHooks[type2][subtype] = fn;
        }
        return this;
    };
    RabbitServer.prototype.parse = function (data) {
        return JSON.parse(data.content.toString('utf-8'));
    };
    return RabbitServer;
}());
exports.RabbitServer = RabbitServer;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("amqplib/callback_api");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ })
/******/ ]);