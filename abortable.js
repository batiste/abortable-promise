"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Abortables = exports.AbortedPromiseError = exports.Abortable = exports.abortable = exports.fetch = void 0;
var abort_controller_1 = require("abort-controller");
var node_fetch_1 = require("node-fetch");
var Abortable = /** @class */ (function () {
    function Abortable() {
    }
    Abortable.prototype.then = function (onfulfilled, onrejected) {
        throw new Error("Method not implemented.");
    };
    Abortable.prototype["catch"] = function (onrejected) {
        throw new Error("Method not implemented.");
    };
    Abortable.prototype.abort = function (reason) {
        throw new Error("Method not implemented.");
    };
    return Abortable;
}());
exports.Abortable = Abortable;
var AbortedPromiseError = /** @class */ (function (_super) {
    __extends(AbortedPromiseError, _super);
    function AbortedPromiseError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AbortedPromiseError;
}(Error));
exports.AbortedPromiseError = AbortedPromiseError;
function abortable(executor) {
    var r;
    var p = new Promise(function (resolve, reject) {
        r = reject;
        executor(resolve, reject);
    });
    p.abort = function (reason) {
        r(reason || new AbortedPromiseError('Promise aborted'));
        return p;
    };
    return p;
}
exports.abortable = abortable;
function abortableFetch(input, init) {
    var controller = new abort_controller_1["default"]();
    var signal = controller.signal;
    var p = node_fetch_1["default"](input, __assign({ signal: signal }, init));
    var abortable = p;
    abortable.abort = function () {
        controller.abort();
        return p;
    };
    return abortable;
}
exports.fetch = abortableFetch;
var Abortables = /** @class */ (function () {
    function Abortables(a) {
        if (a === void 0) { a = []; }
        this.abortables = [];
        this.abortables = a;
    }
    Abortables.prototype.add = function (a) {
        this.abortables.push(a);
        return a;
    };
    Abortables.prototype.abort = function (silent) {
        if (silent === void 0) { silent = true; }
        silent && this.abortables.forEach(function (a) { return a["catch"](function () { }); });
        this.abortables.forEach(function (a) { return a.abort(); });
    };
    return Abortables;
}());
exports.Abortables = Abortables;
