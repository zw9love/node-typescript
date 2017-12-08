"use strict";
/**
 * @author zengwei
 * @since 2017/11/15
 */
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto"); //加载加密文件
var index_1 = require("../dao/index");
var dao = new index_1.default();
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
/**
 * @description 检查分页参数
 * @param row 分页row参数
 * @param page 分页page参数
 * @param where where sql语句
 * @param limit limit sql语句
 */
function checkPage(_a) {
    var row = _a.row, where = _a.where, page = _a.page, limit = _a.limit;
    if (row) {
        if (row.hostIds || row.host_ids) {
            var ids = row.hostIds || row.host_ids;
            where = "where host_ids = " + ids + " ";
        }
    }
    if (page) {
        if (page.pageNumber && page.pageSize) {
            limit = "limit " + (~~page.pageNumber - 1) * ~~page.pageSize + "," + ~~page.pageSize;
        }
    }
}
exports.checkPage = checkPage;
/**
 * @description  transaction事务操作
 * @param connection 数据库连接对象
 * @param res 事务结果
 * @param page page参数
 * @param successFn 成功回调函数
 * @param dao dao对象
 */
function beginTransaction(_a) {
    var connection = _a.connection, res = _a.res, page = _a.page, successFn = _a.successFn, dao = _a.dao;
    var totalRow = res[0][0].sum;
    var list = res[1];
    var postData = {
        list: list,
        totalRow: totalRow,
        totalPage: totalRow / ~~page.pageSize,
        pageNumber: ~~page.pageNumber,
        pageSize: ~~page.pageSize,
        firstPage: ~~page.pageNumber === 1 ? true : false,
        lastPage: ~~page.pageNumber === (totalRow / ~~page.pageSize) ? true : false
    };
    var json = getJson('成功', 200, postData);
    // if (successFn) successFn(json)
    // 事务成功
    dao.commitActive = true;
    if (successFn)
        successFn(json);
    // 事务失败
    // dao.commitActive = false
    // connection.rollback(o => {
    //     console.log('出现错误,回滚!');
    //     //释放资源
    //     connection.end();
    // });
}
exports.beginTransaction = beginTransaction;
// export default {
//     getJson
// }
// exports = module.exports =  {
//     getJson
// }
// export = {
//     getJson
// } 
