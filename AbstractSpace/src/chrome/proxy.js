#! /usr/bin/env node
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
var ChromeMessageProxy = /** @class */ (function () {
    function ChromeMessageProxy(port) {
        var _this = this;
        process.stdin.on('readable', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); });
        this.commandServer = new net.Socket({
            readable: true,
            writable: true,
            allowHalfOpen: true
        });
        this.commandServer.connect({
            port: 6542,
        });
        this.commandServer.on('data', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //fs.writeFile('/home/reagan/test/gotIt.txt', 'one instance', ()=>{})
                    return [4 /*yield*/, this.sendMessage(JSON.stringify({ text: 'hello firefox' }))];
                    case 1:
                        //fs.writeFile('/home/reagan/test/gotIt.txt', 'one instance', ()=>{})
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        //new IpcSocket(port).createConnection()
        // .on('command', async (msg) => {
        // 	await this.sendMessage(JSON.stringify({text: msg.command}))
        // })
    }
    ChromeMessageProxy.prototype.sendMessage = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var buffer, len, lenBuff;
            return __generator(this, function (_a) {
                buffer = Buffer.from(msg, 'utf-8');
                len = buffer.length;
                lenBuff = Buffer.alloc(4);
                lenBuff.writeUInt32LE(len, 0);
                process.stdout.write(Buffer.concat([lenBuff, buffer]));
                return [2 /*return*/];
            });
        });
    };
    return ChromeMessageProxy;
}());
var proxy = new ChromeMessageProxy('6542');
//# sourceMappingURL=proxy.js.map