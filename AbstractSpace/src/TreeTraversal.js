"use strict";
/**
 * Created by rmacc on 5/2/2017.
 */
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
var events_1 = require("events");
var logger_1 = require("./util/logger");
var TreeTraversal = /** @class */ (function () {
    //type NodeSymbol = String
    function TreeTraversal(execution, deactivate, window) {
        this.viewEmitter = new events_1.EventEmitter();
        this.deactivate = deactivate;
        this.mainWindow = window;
        this.execution = execution;
        console.log('new traverser');
    }
    TreeTraversal.prototype.resetContext = function (nodePtr) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log('resetting context');
                this.context = {
                    root: nodePtr,
                    current: nodePtr,
                    level: nodePtr.subtree.map(function (item) { return item.data; }),
                    path: []
                };
                console.log(this.context.level);
                console.log('sending update command');
                this.mainWindow.webContents.once('dom-ready', function () {
                    console.log('dom ready');
                    _this.mainWindow.webContents.send('update', _this.context.level);
                });
                this.mainWindow.webContents.send('update', this.context.level);
                return [2 /*return*/];
            });
        });
    };
    TreeTraversal.prototype.processKeyEvent = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var symbols, current, term, level;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.log.debug('Key press detected: ' + key);
                        if (key === 'Escape') {
                            logger_1.log.debug("Terminated");
                            /*this.callback({
                                type: 'failed',
                                path: this.context.path
                            })*/
                            this.deactivate();
                            return [2 /*return*/];
                        }
                        symbols = this.context.level.map(function (node) { return node.symbol; });
                        if (!(symbols.indexOf(key) > -1)) return [3 /*break*/, 3];
                        logger_1.log.debug("Symbol found for transmitted key");
                        this.context.path.push(key);
                        current = this.context.current;
                        this.context.current = current.subtree[current.subtree.map(function (node) { return node.data.symbol; }).indexOf(key)];
                        console.log(this.context.current);
                        if (!this.isTerminal(this.context.current)) return [3 /*break*/, 2];
                        logger_1.log.debug("Node is terminal");
                        term = this.context.current;
                        console.log(term.command);
                        return [4 /*yield*/, this.execution.executeCommand(term.command)];
                    case 1:
                        _a.sent();
                        this.deactivate();
                        return [2 /*return*/];
                    case 2:
                        level = this.extractLevel(this.context.current);
                        if (level) {
                            this.context.level = level;
                            logger_1.log.debug('updating view state');
                            this.mainWindow.webContents.send('update', level);
                        }
                        else {
                            /*this.callback({
                                type: 'failure',
                                path: this.context.path
                            })*/
                            this.deactivate();
                            return [2 /*return*/];
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TreeTraversal.prototype.sendShutdownSignal = function () {
    };
    TreeTraversal.prototype.connectedTo = function (n, sym) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, conn;
            return __generator(this, function (_b) {
                for (_i = 0, _a = n.subtree; _i < _a.length; _i++) {
                    conn = _a[_i];
                    if (conn.data.symbol === sym)
                        return [2 /*return*/, true];
                }
                return [2 /*return*/, false];
            });
        });
    };
    TreeTraversal.prototype.extractLevel = function (node) {
        return node.subtree.map(function (desc) { return desc.data; });
    };
    TreeTraversal.prototype.isTerminal = function (node) {
        logger_1.log.debug("Checking if node is terminal");
        return node.command !== undefined;
    };
    return TreeTraversal;
}());
exports.TreeTraversal = TreeTraversal;
//# sourceMappingURL=TreeTraversal.js.map