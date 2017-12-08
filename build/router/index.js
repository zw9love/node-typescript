"use strict";
/**
 * @author zengwei
 * @since 2017/11/15
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ./不能忽略
// let host = require('../web/host/index')
// var multipart = require('connect-multiparty');
var index_1 = require("../web/host/index");
var index_2 = require("../web/login/index");
var multipart = require("connect-multiparty");
var bodyParser = require("body-parser");
var fs = require("fs");
var multipartMiddleware = multipart();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var Router = /** @class */ (function () {
    function Router(app) {
        this.host = new index_1.default();
        this.login = new index_2.default();
        this.loginActive = false;
        this.app = app;
    }
    /**
     * @description 初始化方法
     */
    Router.prototype.init = function () {
        var _this = this;
        // 相当于拦截器
        this.app.all("*", function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*"); //设置允许客户端跨域请求
            res.header("Content-Type", "application/json;charset=UTF-8"); //设置响应头数据类型
            // res.writeHead(302, { 'Location': '/' });
            // res.end();  
            next();
        });
        /**
         * 路由块
         */
        // login路由
        this.app.post('/login/dologin', urlencodedParser, function (request, response, next) {
            var name = request.body.login_name;
            var pwd = request.body.login_pwd;
            _this.login.checkLogin(request.body, response, next);
            // next()
        });
        // host路由
        this.app.get('/host/delete/:ids', function (request, response, next) {
            var host_ids = request.params.ids || null;
            var token = request.headers.token;
            _this.host.deleteDataById(token, host_ids, response, next);
        });
        this.app.post('/host/get', function (request, response, next) {
            // let host_ids = request.body
            var token = request.headers.token;
            _this.host.getData(token, request.body, response, next);
        });
        this.app.post('/host/delete', function (request, response, next) {
            var idsArr = request.body || [];
            var token = request.headers.token;
            _this.host.deleteDataBatch(token, idsArr, response, next);
        });
        this.app.post('/host/put', function (request, response, next) {
            var token = request.headers.token;
            _this.host.upDateData(token, request.body, response, next);
        });
        this.app.post('/host/post', function (request, response, next) {
            console.log(request.body);
            var token = request.headers.token;
            _this.host.addData(token, request.body, response, next);
        });
        // 拿到FormData上传的参数
        this.app.post('/upload', multipartMiddleware, function (request, response, next) {
            console.log(request.body, request.files);
        });
        // 获取菜单
        this.app.post('/menu/get', function (request, response, next) {
            // console.log(request.headers.token)
            var token = request.headers.token;
            _this.login.getMenu(token, response, next);
        });
        // 获取权限
        this.app.post('/role/getCur', function (request, response, next) {
            // console.log(request.headers.token)
            var token = request.headers.token;
            _this.login.checkRole(token, response, next);
        });
        // 判断到底是登录蜂眼还是重定向到登录页
        this.app.get('/', function (request, response, next) {
            if (_this.loginActive) {
                _this.loginActive = false;
                fs.readFile('view/index.html', function (err, data) {
                    // console.log(data)
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(data.toString());
                });
            }
            else {
                response.writeHead(302, { 'Location': '/login' });
                response.end();
            }
        });
        // 调到这步说明了登录账号密码正确
        this.app.get('/login/loged', function (request, response, next) {
            _this.loginActive = true;
            response.writeHead(302, { 'Location': '/' });
            response.end();
        });
        // 文件读取login.html文件
        this.app.get('/login', function (request, response, next) {
            _this.loginActive = false;
            fs.readFile('view/login.html', function (err, data) {
                // console.log(data)
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(data.toString());
            });
        });
        // 重定向到/login
        this.app.get('*', function (request, response, next) {
            console.log(request.url);
            response.writeHead(302, { 'Location': '/login' });
            response.end();
        });
    };
    return Router;
}());
exports.default = Router;
