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
var Command = /** @class */ (function () {
    function Command(name) {
        this.name = name;
    }
    return Command;
}());
exports.Command = Command;
var KeyCommand = /** @class */ (function (_super) {
    __extends(KeyCommand, _super);
    function KeyCommand(name, cmd) {
        var _this = _super.call(this, name) || this;
        _this.cmd = cmd;
        return _this;
    }
    return KeyCommand;
}(Command));
exports.KeyCommand = KeyCommand;
var MsgCommand = /** @class */ (function (_super) {
    __extends(MsgCommand, _super);
    function MsgCommand(name, msg, recip) {
        var _this = _super.call(this, name) || this;
        _this.msg = msg;
        _this.recip;
        return _this;
    }
    return MsgCommand;
}(Command));
exports.MsgCommand = MsgCommand;
exports.MsgCommandFacory = function (recip) {
    return function (name, msg) {
        return new MsgCommand(name, msg, recip);
    };
};
var ShellCommand = /** @class */ (function (_super) {
    __extends(ShellCommand, _super);
    function ShellCommand(name, cmd) {
        var _this = _super.call(this, name) || this;
        _this.cmd = cmd;
        return _this;
    }
    return ShellCommand;
}(Command));
exports.ShellCommand = ShellCommand;
//# sourceMappingURL=command.js.map