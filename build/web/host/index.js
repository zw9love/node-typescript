"use strict";
/**
 * @author zengwei
 * @since 2017/11/15
 */
Object.defineProperty(exports, "__esModule", { value: true });
// let service = require('../../service/host/index')
var index_1 = require("../../service/host/index");
var role_1 = require("../../util/role");
var index_2 = require("../../util/index");
var Host = /** @class */ (function () {
    function Host() {
        this.service = new index_1.default();
    }
    /**
     * @description 获取数据
     * @param host_ids 主机ids
     * @param response 响应体
     * @param next 向下执行方法
     */
    Host.prototype.getData = function (token, postData, response, next) {
        if (!role_1.default.checkToken(token))
            return response.send(JSON.stringify(index_2.getJson('用户登录失效', 611)));
        this.service.getData(postData, function (data) {
            response.send(JSON.stringify(data));
        }, next);
    };
    /**
     * @description 根据主机ids删除数据
     * @param host_ids 主机ids
     * @param response 响应体
     * @param next 向下执行方法
     */
    Host.prototype.deleteDataById = function (token, host_ids, response, next) {
        if (!role_1.default.checkToken(token))
            return response.send(JSON.stringify(index_2.getJson('用户登录失效', 611)));
        this.service.deleteData(host_ids, function (data) {
            response.send(JSON.stringify(data));
        }, next);
    };
    /**
     * @description 批量删除主机
     * @param idsArr 主机ids数组
     * @param response 响应体
     * @param next 向下执行方法
     */
    Host.prototype.deleteDataBatch = function (token, idsArr, response, next) {
        if (!role_1.default.checkToken(token))
            return response.send(JSON.stringify(index_2.getJson('用户登录失效', 611)));
        this.service.deleteData(idsArr, function (data) {
            response.send(JSON.stringify(data));
        }, next);
    };
    /**
     * @description 更新数据
     * @param json 更新的json
     * @param response 响应体
     * @param next 向下执行方法
     */
    Host.prototype.upDateData = function (token, json, response, next) {
        if (!role_1.default.checkToken(token))
            return response.send(JSON.stringify(index_2.getJson('用户登录失效', 611)));
        this.service.upDateData(json, function (data) {
            response.send(JSON.stringify(data));
        }, next);
    };
    /**
     * @description 添加数据
     * @param json 添加的json
     * @param response 响应体
     * @param next 向下执行方法
     */
    Host.prototype.addData = function (token, json, response, next) {
        if (!role_1.default.checkToken(token))
            return response.send(JSON.stringify(index_2.getJson('用户登录失效', 611)));
        this.service.addData(json, function (data) {
            response.send(JSON.stringify(data));
        }, next);
    };
    return Host;
}());
exports.default = Host;
