"use strict";
/**
 * @author zengwei
 * @since 2017/11/15
 */
Object.defineProperty(exports, "__esModule", { value: true });
// let service = require('../../service/host/index')
var index_1 = require("../../service/login/index");
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
        var _this = this;
        this.service.checkLogin(json, function (data) {
            if (data.status === 200) {
                var token = index_2.getToken();
                _this.service.token = token;
                response.header("token", token);
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
        this.service.checkRole(token, function (data) {
            response.send(JSON.stringify(data));
        }, next);
    };
    return Login;
}());
exports.default = Login;
