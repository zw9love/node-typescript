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
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
var Router = /** @class */ (function () {
    function Router(app) {
        this.host = new index_1.default();
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
            next();
        });
        /**
         * 路由块
         */
        // host路由
        this.app.get('/host/delete/:ids', function (request, response, next) {
            var host_ids = request.params.ids || null;
            _this.host.deleteDataById(host_ids, response, next);
        });
        this.app.post('/host/get', function (request, response, next) {
            var host_ids = request.body.host_ids || null;
            _this.host.getData(host_ids, response, next);
        });
        this.app.post('/host/delete', function (request, response, next) {
            var idsArr = request.body || [];
            _this.host.deleteDataBatch(idsArr, response, next);
        });
        this.app.post('/host/put', function (request, response, next) {
            _this.host.upDateData(request.body, response, next);
        });
        this.app.post('/host/post', function (request, response, next) {
            console.log(request.body);
            _this.host.addData(request.body, response, next);
        });
        /**
         * @description 拿到FormData上传的参数
         * @author zengwei
         */
        this.app.post('/upload', multipartMiddleware, function (request, response, next) {
            console.log(request.body, request.files);
        });
    };
    return Router;
}());
exports.default = Router;
