"use strict";
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
exports.abortable = exports.fetch = void 0;
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
function abortable(executor) {
    var r;
    var p = new Promise(function (resolve, reject) {
        r = reject;
        executor(resolve, reject);
    });
    p.abort = function (reason) {
        r(reason || new Error('Promise cancelled'));
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
