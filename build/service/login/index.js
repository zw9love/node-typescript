"use strict";
/**
 * @author zengwei
 * @since 2017/12/7
 */
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../dao/index");
var index_2 = require("../../util/index");
var Service = /** @class */ (function () {
    function Service() {
        this.dao = new index_1.default();
        this.tableName = 'common_user';
        this.role = { login_name: 'root', login_pwd: '', username: '超级管理员' };
        this.token = 'debug';
        this.userData = [
            { login_name: 'sysadmin', login_pwd: 'admin123.com', username: '系统管理员' },
            { login_name: 'audadmin', login_pwd: 'admin123.com', username: '审计管理员' },
            { login_name: 'secadmin', login_pwd: 'admin123.com', username: '安全管理员' }
        ];
    }
    /**
     * @description 检查登录是否成功
     * @param data  登录的信息（账号密码）
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    Service.prototype.checkLogin = function (data, successFn, errorFn) {
        var _this = this;
        var sql = "SELECT * FROM " + this.tableName;
        // console.log(md5(data.login_name))
        this.dao.connectDatabase(sql, data, function (res) {
            var flag = false;
            var userData = _this.userData;
            userData.forEach(function (e) {
                if (e.login_name === data.login_name && e.login_pwd === data.login_pwd) {
                    flag = true;
                    _this.role = e;
                }
            });
            var json = flag ? index_2.getJson('登录成功', 200, null) : index_2.getJson('用户名或密码错误', 606, null);
            if (successFn)
                successFn(json);
        }, errorFn);
    };
    /**
     * @description 查看是哪个管理员
     * @param token  每次http请求的token值
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    Service.prototype.checkRole = function (token, successFn, errorFn) {
        if (token === this.token) {
            var data = {
                zh_names: this.role.username,
                login_name: this.role.login_name
            };
            var json = index_2.getJson('成功', 200, data);
            if (successFn)
                successFn(json);
        }
    };
    return Service;
}());
exports.default = Service;
