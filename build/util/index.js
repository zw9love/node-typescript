"use strict";
/**
 * @author zengwei
 * @since 2017/11/15
 */
Object.defineProperty(exports, "__esModule", { value: true });
function getJson(msg, status, data) {
    if (msg === void 0) { msg = ''; }
    if (data === void 0) { data = null; }
    var json = {
        data: data,
        msg: msg,
        status: status
    };
    return json;
}
exports.getJson = getJson;
