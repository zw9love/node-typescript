"use strict";
/**
 * @author zengwei
 * @since 2017/12/7
 */
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../dao/index");
var index_2 = require("../../util/index");
var role_1 = require("../../util/role");
var Service = /** @class */ (function () {
    function Service() {
        this.dao = new index_1.default();
        this.tableName = 'common_user';
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
        this.dao.connectDatabase(sql, data, function (res) {
            var flag = false;
            var userData = _this.userData;
            userData.forEach(function (e) {
                if (e.login_name === data.login_name && e.login_pwd === data.login_pwd) {
                    flag = true;
                    role_1.default.role = e;
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
        if (token === role_1.default.token) {
            var data = {
                zh_names: role_1.default.role.username,
                login_name: role_1.default.role.login_name
            };
            var json = index_2.getJson('成功', 200, data);
            if (successFn)
                successFn(json);
        }
    };
    /**
     * @description 获取菜单
     * @param token 每次http请求的token值
     * @param successFn 成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    Service.prototype.getMenu = function (successFn, errorFn) {
        var sql = "SELECT * FROM common_menu";
        this.dao.connectDatabase(sql, null, function (res) {
            var json = index_2.getJson('成功', 200, res);
            if (successFn)
                successFn(json);
        }, errorFn);
    };
    return Service;
}());
exports.default = Service;
