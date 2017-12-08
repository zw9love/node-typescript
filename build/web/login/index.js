"use strict";
/**
 * @author zengwei
 * @since 2017/11/15
 */
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../service/login/index");
var role_1 = require("../../util/role");
var index_2 = require("../../util/index");
var Login = /** @class */ (function () {
    function Login() {
        this.service = new index_1.default();
    }
    /**
     * @description 检查登录是否成功
     * @param json 登录的信息（账号密码）
     * @param response 响应体
     * @param next 向下执行方法
     */
    Login.prototype.checkLogin = function (json, response, next) {
        this.service.checkLogin(json, function (data) {
            if (data.status === 200) {
                new role_1.default(); // 登录成功才生成Role对象
                response.header("token", role_1.default.token);
            }
            response.send(JSON.stringify(data));
        }, next);
    };
    /**
     * @description 查看是哪个管理员
     * @param token 每次http请求的token值
     * @param response 响应体
     * @param next 向下执行方法
     */
    Login.prototype.checkRole = function (token, response, next) {
        if (!role_1.default.checkToken(token))
            return response.send(JSON.stringify(index_2.getJson('用户登录失效', 611)));
        this.service.checkRole(token, function (data) {
            response.send(JSON.stringify(data));
        }, next);
    };
    /**
     * @description 获取菜单
     * @param token 每次http请求的token值
     * @param response 响应体
     * @param next 向下执行方法
     */
    Login.prototype.getMenu = function (token, response, next) {
        if (!role_1.default.checkToken(token))
            return response.send(JSON.stringify(index_2.getJson('用户登录失效', 611)));
        this.service.getMenu(function (data) {
            response.send(JSON.stringify(data));
        }, next);
    };
    return Login;
}());
exports.default = Login;
