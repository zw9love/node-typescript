"use strict";
/**
 * @author zengwei
 * @since 2017/11/15
 */
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto"); //加载加密文件
var uuidv1 = require("uuid/v1"); //生成随机字符串
/**
 * @description 获取返回前台的json
 * @param msg
 * @param status
 * @param data
 */
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
/**
 * @description 随机生成token值
 */
function getToken() {
    return uuidv1();
}
exports.getToken = getToken;
/**
 * @description md5加密
 * @param str
 */
function md5(str) {
    var md5 = crypto.createHash('md5');
    md5.update(str);
    str = md5.digest('hex');
    return str;
}
exports.md5 = md5;
