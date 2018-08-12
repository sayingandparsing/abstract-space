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
var net = require("net");
var logger_1 = require("./util/logger");
var ipc_events_1 = require("./ipc/ipc-events");
var ProcessInterface = /** @class */ (function () {
    function ProcessInterface(port, dataHooks) {
        if (dataHooks === void 0) { dataHooks = {}; }
        this.port = port;
        this.dataHooks = dataHooks;
        logger_1.log.debug('Created ProcessInterface');
        this.createConnection(this.port);
    }
    ProcessInterface.prototype.createConnection = function (port) {
        var _this = this;
        logger_1.log.debug('creating ipc socket on port ' + port);
        this.socket = net.createConnection(port, function (sock) {
            sock.on('data', function (msg) {
                logger_1.log.debug('ProcessInterface received a message');
                _this.handleIncoming(_this.parse(msg));
            });
        });
    };
    ProcessInterface.prototype.handleIncoming = function (msg) {
        logger_1.log.debug('handling incoming message');
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
        var _this = this;
        this.dataHooks = {};
        this.ipcEvents = ipc_events_1.ipcEvents;
        this.path = path;
        logger_1.log.debug('creating server on ' + this.path);
        this.createServer();
        ipc_events_1.ipcEvents.on('disconnect', function () { return _this.disconnect(); });
    }
    IpcServer.prototype.createServer = function () {
        var _this = this;
        this.server = net.createServer(function (connect) {
            connect.on('data', function (data) {
                logger_1.log.debug('received data on ' + _this.path);
                logger_1.log.debug(data.toString('utf-8'));
                try {
                    _this.handleIncoming(_this.parse(data.toString('utf-8')), connect);
                }
                catch (e) {
                    logger_1.log.debug(e.message);
                }
            });
        });
        this.server.listen(this.path);
        /*this.server.on('connection', (socket) => {
            socket.on('message', (msg) => {
                this.handleIncoming(
                    this.parse(msg),
                    socket
                )
            })
        })*/
    };
    IpcServer.prototype.handleIncoming = function (msg, socket) {
        logger_1.log.debug(typeof msg);
        //const msgObj = JSON.parse(msg)
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
    IpcServer.prototype.disconnect = function () {
        logger_1.log.debug('IpcServer disconnecting from port ' + this.path);
        this.server.close();
    };
    return IpcServer;
}());
exports.IpcServer = IpcServer;
var IpcSocket = /** @class */ (function () {
    function IpcSocket(port) {
        var _this = this;
        this.ipcEvents = ipc_events_1.ipcEvents;
        this.port = port;
        this.createConnection();
        ipc_events_1.ipcEvents.on('disconnect', function () { return _this.disconnect(); });
    }
    IpcSocket.prototype.createConnection = function () {
        this.socket = new net.Socket({
            readable: true,
            writable: true,
            allowHalfOpen: true
        });
    };
    IpcSocket.prototype.send = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.socket.write(Buffer.from(JSON.stringify(msg)));
                return [2 /*return*/];
            });
        });
    };
    IpcSocket.prototype.disconnect = function () {
        logger_1.log.debug('IpcSocket disconnecting from port ' + this.port);
        this.socket.destroy();
    };
    return IpcSocket;
}());
exports.IpcSocket = IpcSocket;
var amqp = require('amqplib/callback_api');
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
                logger_1.log.debug('created channel');
                ch.consume(_this.name, function (msg) {
                    _this.handleIncoming(_this.parse(msg), function (reply) {
                        logger_1.log.debug('replied to sender on queue');
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
        logger_1.log.debug('received cue message: ' + type);
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
//# sourceMappingURL=ipc.js.map