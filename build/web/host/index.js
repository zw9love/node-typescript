"use strict";
/**
 * @author zengwei
 * @since 2017/11/15
 */
Object.defineProperty(exports, "__esModule", { value: true });
// let service = require('../../service/host/index')
var index_1 = require("../../service/host/index");
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
    Host.prototype.getData = function (host_ids, response, next) {
        this.service.getData(host_ids, function (data) {
            response.send(JSON.stringify(data));
        }, function (o) {
            next();
        });
    };
    /**
     * @description 根据主机ids删除数据
     * @param host_ids 主机ids
     * @param response 响应体
     * @param next 向下执行方法
     */
    Host.prototype.deleteDataById = function (host_ids, response, next) {
        this.service.deleteData(host_ids, function (data) {
            response.send(JSON.stringify(data));
        }, function (o) {
            next();
        });
    };
    /**
     * @description 批量删除主机
     * @param idsArr 主机ids数组
     * @param response 响应体
     * @param next 向下执行方法
     */
    Host.prototype.deleteDataBatch = function (idsArr, response, next) {
        this.service.deleteData(idsArr, function (data) {
            response.send(JSON.stringify(data));
        }, function (o) {
            next();
        });
    };
    /**
     * @description 更新数据
     * @param json 更新的json
     * @param response 响应体
     * @param next 向下执行方法
     */
    Host.prototype.upDateData = function (json, response, next) {
        this.service.upDateData(json, function (data) {
            response.send(JSON.stringify(data));
        }, function (o) {
            next();
        });
    };
    /**
     * @description 添加数据
     * @param json 添加的json
     * @param response 响应体
     * @param next 向下执行方法
     */
    Host.prototype.addData = function (json, response, next) {
        this.service.addData(json, function (data) {
            response.send(JSON.stringify(data));
        }, function (o) {
            next();
        });
    };
    return Host;
}());
exports.default = Host;
