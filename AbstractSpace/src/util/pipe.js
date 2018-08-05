"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pipe = /** @class */ (function () {
    function Pipe(value) {
        this.val = value;
    }
    Pipe.pipe = function (value) {
        return new Pipe(value);
    };
    Pipe.prototype.to = function (fn) {
        return new Pipe(fn(this.val));
    };
    Pipe.prototype.also = function (fn) {
        fn(this.val);
        return this;
    };
    return Pipe;
}());
exports.Pipe = Pipe;
var Some = /** @class */ (function () {
    function Some(value) {
        this.value = value;
    }
    Some.of = function (value) {
        return (value)
            ? new Some(value)
            : new None;
    };
    Some.prototype.map = function (fn) {
        return Some.of(fn(this.value));
    };
    Some.prototype.to = function (fn) {
        return Some.of(fn(this.value));
    };
    return Some;
}());
exports.Some = Some;
var None = /** @class */ (function () {
    function None() {
    }
    None.prototype.map = function (fn) {
        return this;
    };
    None.prototype.to = function (fn) {
        return this;
    };
    return None;
}());
exports.None = None;
//# sourceMappingURL=pipe.js.map