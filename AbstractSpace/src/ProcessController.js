"use strict";
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
var ipc_1 = require("./ipc");
var SingleViewService_1 = require("./SingleViewService");
var logger_1 = require("./util/logger");
var SpaceParser_1 = require("./SpaceParser");
var electron_1 = require("electron");
var command_functions_1 = require("./command/command-functions");
var load_trees_1 = require("./trees/load-trees");
var ipc_events_1 = require("./ipc/ipc-events");
var ProcessController = /** @class */ (function () {
    function ProcessController(window) {
        this.path = 'display';
        this.savedRefs = {};
        console.log('created process controller');
        this.mainWindow = window;
        this.view = new SingleViewService_1.SingleViewService(window);
        this.viewService = new SingleViewService_1.SingleViewService(this.view);
        logger_1.log.debug('initializing process controller');
        this.commandTrees = {};
        this.start();
    }
    ProcessController.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var parser, dispatchCommand;
            var _this = this;
            return __generator(this, function (_a) {
                parser = new SpaceParser_1.SpaceParser('');
                load_trees_1.loadTrees().forEach(function (config) { return __awaiter(_this, void 0, void 0, function () {
                    var lab, _a, _b, err_1;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _c.trys.push([0, 2, , 3]);
                                logger_1.log.debug("LABEL: " + config.tree.lab + '\n\n\n');
                                lab = config.tree.lab;
                                _a = this.commandTrees;
                                _b = lab;
                                return [4 /*yield*/, parser.traverse(config.tree, config['tree']['lab'])
                                    //console.log('COMMAND TREE:')
                                ];
                            case 1:
                                _a[_b] =
                                    _c.sent();
                                //console.log('COMMAND TREE:')
                                console.log(JSON.stringify(this.commandTrees[lab], null, 2));
                                return [3 /*break*/, 3];
                            case 2:
                                err_1 = _c.sent();
                                logger_1.log.error('CONFIG WARNING: tree not loaded');
                                console.log(err_1);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
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
                this.requestListener =
                    new ipc_1.IpcServer('6601')
                        .on('tree', function (msg) { return __awaiter(_this, void 0, void 0, function () {
                        var tree;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    logger_1.log.debug('recieved tree request');
                                    tree = this.commandTrees[msg];
                                    if (!(tree !== undefined)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.run_traversal(tree, function () { })];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    logger_1.log.debug('no tree found for request ' + msg);
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })
                        .on('reload', function (msg) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.reload()];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); })
                        .on('quit', function () {
                        ipc_events_1.ipcEvents.emit('disconnect');
                    });
                return [2 /*return*/];
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
                    case 0: return [4 /*yield*/, this.traversal.resetContext(tree)];
                    case 1:
                        _a.sent();
                        this.active = true;
                        this.mainWindow.show();
                        this.mainWindow.focus();
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
    ProcessController.prototype.reload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.log.debug('Reloading configuration');
                        ipc_events_1.ipcEvents.emit('disconnect');
                        return [4 /*yield*/, this.sleep(3000)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.start()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessController.prototype.sleep = function (ms) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(resolve, ms);
                    })];
            });
        });
    };
    return ProcessController;
}());
exports.ProcessController = ProcessController;
logger_1.log.debug('executing');
//# sourceMappingURL=ProcessController.js.map