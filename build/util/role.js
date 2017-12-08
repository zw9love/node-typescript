"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuidv1 = require("uuid/v1"); //生成随机字符串
var timers_1 = require("timers");
var Role = /** @class */ (function () {
    function Role() {
        console.log('创建了token');
        this.createToken();
        Role.timer = timers_1.setTimeout(function (o) { Role.token = null; console.log('token已经失效咯'); }, 1 * 60 * 1000);
    }
    Role.prototype.createToken = function () {
        Role.token = uuidv1();
    };
    Role.checkToken = function (token) {
        if (token === Role.token)
            return true;
        return false;
    };
    Role.refreshToken = function () {
        clearTimeout(Role.timer);
        Role.timer = timers_1.setTimeout(function (o) { Role.token = null; console.log('token已经失效咯'); }, 1 * 60 * 1000);
    };
    Role.token = 'debug';
    Role.role = { login_name: 'root', login_pwd: '', username: '超级管理员' };
    Role.timer = null;
    return Role;
}());
exports.default = Role;
