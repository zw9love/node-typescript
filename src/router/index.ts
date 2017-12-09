/**
 * @author zengwei
 * @since 2017/11/15
 */

// ./不能忽略
// let host = require('../web/host/index')
// var multipart = require('connect-multiparty');
import Host from '../web/host/index'
import Login from '../web/login/index'
import { checkToken, getJson } from '../util/index'
import multipart = require('connect-multiparty')
import express = require('express')
import bodyParser = require('body-parser')
import fs = require("fs")

var multipartMiddleware = multipart()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

export default class Router {
    public host = new Host()
    public login = new Login()
    public app: any
    private loginActive: boolean = false
    constructor(app: any) {
        this.app = app
    }
    /**
     * @description 初始化方法
     */
    init(): void {
        // 相当于拦截器
        this.app.all("*", (req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*"); //设置允许客户端跨域请求
            res.header("Content-Type", "application/json;charset=UTF-8"); //设置响应头数据类型
            next();
        });

        /**
         * 路由块
         */

        // login路由
        this.app.post('/login/dologin', urlencodedParser, (request, response, next) => {
            this.login.checkLogin(request.body, request, response, next)
        })

        // host路由
        this.app.get('/host/delete/:ids', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            let host_ids = request.params.ids || null
            this.host.deleteDataById(host_ids, response, next)
        })

        this.app.post('/host/get', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            this.host.getData(request.body, response, next)
        })

        this.app.post('/host/delete', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            let idsArr = request.body || []
            this.host.deleteDataBatch(idsArr, response, next)
        })

        this.app.post('/host/put', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            this.host.upDateData(request.body, response, next)
        })

        this.app.post('/host/post', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            console.log(request.body)
            this.host.addData(request.body, response, next)
        })

        // 拿到FormData上传的参数
        this.app.post('/upload', multipartMiddleware, function (request, response, next) {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            console.log(request.body, request.files)
        })

        // 获取菜单
        this.app.post('/menu/get', (request, response, next) => {
            // console.log(request.headers.token)
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            this.login.getMenu(response, next)
        })


        // 获取权限
        this.app.post('/role/getCur', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            if (request.headers.token === 'debug') return response.send(JSON.stringify(getJson('成功', 200, { login_name: 'root', login_pwd: 'admin123.com', username: '超级管理员' })))
            let data = {
                zh_names: request.session.role.username,
                login_name: request.session.role.login_name
            }
            response.send(JSON.stringify(getJson('成功', 200, data)))
            // this.login.checkRole(token, response, next)
        })


        // 判断到底是登录蜂眼还是重定向到登录页
        this.app.get('/', (request, response, next) => {
            if (this.loginActive) {
                this.loginActive = false
                fs.readFile('view/index.html', function (err, data) {
                    // console.log(data)
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(data.toString())
                })
            } else {
                response.writeHead(302, { 'Location': '/login' })
                response.end()
            }
        })


        // 调到这步说明了登录账号密码正确
        this.app.get('/login/loged', (request, response, next) => {
            this.loginActive = true
            response.writeHead(302, { 'Location': '/' })
            response.end()
        })

        // 文件读取login.html文件
        this.app.get('/login', (request, response, next) => {
            this.loginActive = false
            fs.readFile('view/login.html', function (err, data) {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(data.toString())
            })
        })

        // 重定向到/login
        this.app.get('*', (request, response, next) => {
            console.log(request.url)
            response.writeHead(302, { 'Location': '/login' })
            response.end()
        })

        this.app.post('*', (request, response, next) => {
            // if (!checkToken(request)) return getJson('用户登录失效', 611, null)
            console.log(request.url)
            next()
        })
    }
}