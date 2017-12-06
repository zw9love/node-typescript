"use strict";
/**
 * @author zengwei
 * @since 2017/11/15
 */
Object.defineProperty(exports, "__esModule", { value: true });
// let mysql = require('mysql');
var mysql = require("mysql");
var async = require("async");
// 接口
// interface databaseDataIf {
//     host: string,
//     port: string | number,
//     database: string,
//     user: string,
//     password: string,
// }
var Dao = /** @class */ (function () {
    function Dao() {
        this.databaseData = {
            host: 'localhost',
            port: '3306',
            database: 'beeeyehced',
            user: 'root',
            password: '159357',
        };
    }
    /**
     * @description 连接数据库
     * @param sql sql语句
     * @param dataArr sql语句参数
     * @param successFn 成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    Dao.prototype.connectDatabase = function (sql, dataArr, successFn, errorFn) {
        var connection = mysql.createConnection(this.databaseData);
        connection.connect();
        connection.query(sql, dataArr, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                if (errorFn)
                    return errorFn();
            }
            if (successFn)
                successFn(result);
        });
        connection.end();
    };
    /**
     * @description 数据库事务管理
     * @param taskArr 多个任务执行
     * @param successFn 成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    Dao.prototype.connectTransaction = function (taskArr, successFn, errorFn) {
        var connection = mysql.createConnection(this.databaseData);
        connection.connect();
        connection.beginTransaction(function (err) {
            if (err) {
                console.log(err);
                return;
            }
            var taskData = [];
            taskArr.forEach(function (o, i) {
                // console.log(o.sql)
                var task = function (callback) {
                    var query = connection.query(o.sql, o.dataArr, function (err, result) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                            return;
                        }
                        // console.log('第' + (i + 1)+ '次成功!')
                        callback(null, result);
                        // console.log(query.sql)
                        // console.log(result)
                    });
                };
                taskData.push(task);
            });
            // var task1 = function (callback) {
            //     connection.query(`UPDATE user SET money = money - 100 where name = 'zhangsan'`, function (err, result) {
            //         if (err) {
            //             console.log(err);
            //             callback(err, null);
            //             return;
            //         }
            //         console.log('第1次成功!');
            //         callback(null, result);
            //     })
            // }
            // var task2 = function (callback) {
            //     connection.query(`UPDATE user SET money = money + 100 where name = lisi'`, function (err, result) {
            //         if (err) {
            //             console.log(err);
            //             callback(err, null);
            //             return;
            //         }
            //         console.log('第2次成功!');
            //         callback(null, result);
            //     })
            // }
            async.series(taskData, function (err, result) {
                if (err) {
                    console.log(err);
                    //回滚
                    connection.rollback(function () {
                        console.log('出现错误,回滚!');
                        //释放资源
                        connection.end();
                    });
                    return;
                }
                var flag = true;
                result.forEach(function (o) {
                    if (o.affectedRows === 0) {
                        flag = false;
                    }
                });
                if (!flag) {
                    connection.rollback(function () {
                        console.log('出现错误,回滚!');
                        //释放资源
                        connection.end();
                    });
                    return;
                }
                //提交
                connection.commit(function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log('成功,提交!');
                    //释放资源
                    connection.end();
                });
            });
        });
    };
    return Dao;
}());
exports.default = Dao;
