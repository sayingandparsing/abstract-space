'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var TreeTraversal_1 = require("./TreeTraversal");
var SingleViewService_1 = require("./SingleViewService");
var logger_1 = require("./util/logger");
var SpaceParser_1 = require("./SpaceParser");
var electron_1 = require("electron");
var command_functions_1 = require("./command/command-functions");
// const log = require('electron-log');
// log.transports.file.level = 'debug';
// log.transports.file.file = __dirname + 'log.log';
// log.debug(log)
var desktop_1 = require("./trees/desktop");
var ProcessController = /** @class */ (function () {
    function ProcessController(window) {
        this.path = 'display';
        console.log('created process controller');
        this.mainWindow = window;
        this.view = new SingleViewService_1.SingleViewService(window);
        this.viewService = new SingleViewService_1.SingleViewService(this.view);
        logger_1.log.debug('initializing process controller');
        this.commandTrees = {};
        this.start();
        /*this.socket =
            new ProcessInterface('6601')
                .on('standard')


        /*this.ipc = new RabbitServer(this.path)
            .on('tree', (content, replyCb) => {
                log.debug('received tree')
                let name = content['data']['symbol']
                this.commandTrees[name] = content
                //log.debug(this.commandTrees)
                //log.debug('added ' + name)
            })
            .on(['display', 'tree'], (content, replyCb) => {
                let requestedTree = this.commandTrees['standard']
                log.debug('received display request')
                if (requestedTree !== null) {
                    //log.debug(requestedTree)
                    this.run_traversal(requestedTree, replyCb)
                } else {
                    log.error('couldn+\'t find a tree called ' + content)
                    replyCb({type: 'failed'})
                }
            })
            .on('chain view', (content, replyCb) => {
                this.viewService.display(content, replyCb)
            })
            .on('end chain', (content, replyCb) => {
                this.viewService.breakChain()
            })
            /*.on(['display', 'appTree'] , (content, replyCb) => {
                log.debug('received app tree')
                let requestedTree = this.commandTrees['app_specific'][content.name]
                log.debug('requested tree = '+content.name)
                if (requestedTree !== null)
                    this.run_traversal(requestedTree, replyCb)
                else {
                    log.debug('couldn+\'t find a tree called ' + content)
                    replyCb({type: 'failed'})
                }
            })
            .createServer()*/
    }
    ProcessController.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var parser, _a, _b, dispatchCommand;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        parser = new SpaceParser_1.SpaceParser('');
                        _a = this.commandTrees;
                        _b = 'standard';
                        return [4 /*yield*/, parser.traverse(desktop_1.tree, 'standard')];
                    case 1:
                        _a[_b] =
                            _c.sent();
                        electron_1.ipcMain.on('key', function (ev, key) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.traversal.processKeyEvent(key)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        this.dispatch = new command_functions_1.CommandExecution(parser.commands);
                        dispatchCommand = function (cmdId) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        logger_1.log.debug('Sending command to dispatcher:');
                                        logger_1.log.debug(cmdId);
                                        return [4 /*yield*/, this.dispatch.executeCommand(cmdId)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        this.traversal = new TreeTraversal_1.TreeTraversal(this.dispatch, this.deactivateSelection, this.mainWindow);
                        return [4 /*yield*/, this.run_traversal(this.commandTrees, function () { })];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessController.prototype.processDisplayRequest = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var requestedTree;
            return __generator(this, function (_a) {
                if (!msg.hasOwnProperty('subtype')) {
                    logger_1.log.error('Expected a subtype for display request');
                    return [2 /*return*/];
                }
                switch (msg.subtype) {
                    case 'view':
                        break;
                    case 'tree':
                        requestedTree = this.commandTrees[msg.content];
                        if (requestedTree !== null) {
                            //run_traversal(requestedTree)
                        }
                        else {
                            logger_1.log.error('couldn+\'t find a tree called ' + msg.content);
                        }
                }
                return [2 /*return*/];
            });
        });
    };
    ProcessController.prototype.run_traversal = function (tree, replyFn) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('run traverse');
                        console.log(tree);
                        console.log(typeof tree);
                        console.log(tree['standard']['subtree']);
                        console.log('after');
                        /*this.mainWindow.addEventListener('keydown', (ev) => {
                            //log.debug(ev)
                            if (this.active) {
                                try {
                                    this.traversal.processKeyEvent(ev.key)
                                } catch (e) {
                                }
                            }
                        }, true)*/
                        console.log('activated selection');
                        return [4 /*yield*/, this.activateSelection(tree, replyFn)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessController.prototype.activateSelection = function (tree, replyCb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.traversal.callback = replyCb;
                        return [4 /*yield*/, this.traversal.resetContext(tree['standard'])];
                    case 1:
                        _a.sent();
                        this.active = true;
                        this.mainWindow.show();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessController.prototype.deactivateSelection = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.active = false;
                this.mainWindow.hide();
                return [2 /*return*/];
            });
        });
    };
    ProcessController.prototype.publishTraversalState = function (state) {
    };
    return ProcessController;
}());
exports.ProcessController = ProcessController;
logger_1.log.debug('executing');
//# sourceMappingURL=ProcessController.js.map