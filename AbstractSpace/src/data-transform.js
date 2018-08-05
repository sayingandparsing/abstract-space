"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./util/logger");
var DataTransform = /** @class */ (function () {
    function DataTransform() {
        this.match = {
            Map: function (str) { return logger_1.log.debug(str); }
        };
    }
    return DataTransform;
}());
//# sourceMappingURL=data-transform.js.map