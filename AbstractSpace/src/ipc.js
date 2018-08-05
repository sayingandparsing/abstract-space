"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require("net");
var logger_1 = require("./util/logger");
var ProcessInterface = /** @class */ (function () {
    function ProcessInterface(port, dataHooks) {
        if (dataHooks === void 0) { dataHooks = {}; }
        this.port = port;
        this.dataHooks = dataHooks;
        logger_1.log.debug('Created ProcessInterface');
    }
    ProcessInterface.prototype.createConnection = function (port) {
        var _this = this;
        this.socket = net.createConnection(port, function (sock) {
            sock.on('data', function (msg) {
                logger_1.log.debug('ProcessInterface received a message');
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
        var msgObj = JSON.parse(msg);
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