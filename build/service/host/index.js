"use strict";
/**
 * @author zengwei
 * @since 2017/11/15
 */
Object.defineProperty(exports, "__esModule", { value: true });
/*
    module.exports 初始值为一个空对象 {}，所以 exports 初始值也是 {}
    exports 是指向的 module.exports 的引用
    require() 返回的是 module.exports 而不是 exports
*/
var index_1 = require("../../dao/index");
// 1、
var index_2 = require("../../filters/index");
var index_3 = require("../../util/index");
// 2、
// let { autoGetData } = require('../../filters/index')
// let { getJson } = require('../../util/index')
// 3、
// import util from '../../util/index'
// let { getJson} = util
var Service = /** @class */ (function () {
    function Service() {
        this.dao = new index_1.default();
        this.tableName = 'beeeye_host';
    }
    /**
     * @description 查询全部
     * @param data  sql语句参数
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    Service.prototype.getData = function (data, successFn, errorFn) {
        var host_ids = data;
        var sql = '';
        if (host_ids === null || host_ids === undefined) {
            sql = "SELECT * FROM " + this.tableName;
        }
        else {
            sql = "SELECT * FROM " + this.tableName + " where host_ids = '" + host_ids + "'";
        }
        console.log(sql);
        this.dao.connectDatabase(sql, data, function (res) {
            var json = index_3.getJson('', 200, res);
            if (successFn) {
                successFn(json);
            }
        }, errorFn);
    };
    /**
     * @description 删除 / 批量删除
     * @param idsArr  sql语句参数
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    Service.prototype.deleteData = function (idsArr, successFn, errorFn) {
        var sql = idsArr.length >= 0 ? "DELETE FROM " + this.tableName + " where host_ids in (?)" : "DELETE FROM " + this.tableName + " where host_ids = ?";
        this.dao.connectDatabase(sql, idsArr, function (_a) {
            var affectedRows = _a.affectedRows;
            var json;
            if (affectedRows > 0) {
                json = index_3.getJson('删除成功', 200);
            }
            else {
                json = index_3.getJson('删除失败', 404);
            }
            if (successFn) {
                successFn(json);
            }
        }, errorFn);
    };
    /**
     * @description 更新
     * @param json  sql语句参数
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    Service.prototype.upDateData = function (json, successFn, errorFn) {
        var sql = "UPDATE " + this.tableName + " SET name = ?, ip = ?, port = ?,login_name = ?,login_pwd = ? where host_ids = ?";
        var arr = [json.name, json.ip, json.port, json.login_name, json.login_pwd, json.host_ids];
        this.dao.connectDatabase(sql, json, function (_a) {
            var affectedRows = _a.affectedRows;
            var json;
            if (affectedRows > 0) {
                json = index_3.getJson('修改成功', 200);
            }
            else {
                json = index_3.getJson('修改失败', 404);
            }
            if (successFn) {
                successFn(json);
            }
        }, errorFn);
    };
    /**
     * @description 增加
     * @param json  sql语句参数
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    Service.prototype.addData = function (json, successFn, errorFn) {
        var sql = "INSERT INTO " + this.tableName + " (host_ids, name, ip, port, os_type, os_version, os_arch, login_name, login_pwd) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var arr = [json.host_ids, index_2.autoGetData(json.name), index_2.autoGetData(json.ip), index_2.autoGetData(json.port), index_2.autoGetData(json.os_type), index_2.autoGetData(json.os_version), index_2.autoGetData(json.os_arch), index_2.autoGetData(json.login_name), index_2.autoGetData(json.login_pwd)];
        this.dao.connectDatabase(sql, json, function (_a) {
            var affectedRows = _a.affectedRows;
            var json;
            if (affectedRows > 0) {
                json = index_3.getJson('添加成功', 200);
            }
            else {
                json = index_3.getJson('添加失败', 404);
            }
            if (successFn) {
                successFn(json);
            }
        }, errorFn);
    };
    return Service;
}());
exports.default = Service;
