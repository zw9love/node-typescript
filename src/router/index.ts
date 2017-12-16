/**
 * @author zengwei
 * @since 2017/11/15
 */

// ./不能忽略
import Host from '../web/Host'
import Login from '../web/Login'
import Setting from '../web/Setting'
import User from '../web/User'
import BeeneedleModule from '../web/BeeneedleModule'
import { checkToken, getJson } from '../util/index'
import multipart = require('connect-multiparty')
import express = require('express')
import bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
import fs = require("fs")

var multipartMiddleware = multipart()
var urlencodedParser = bodyParser.urlencoded({ extended: false }) // 如果前台传递的类型是Form Data类型的数据

export default class Router {
    public host: Host = new Host()
    public login: Login = new Login()
    public setting: Setting = new Setting()
    public user: User = new User()
    public beeneedleModule: BeeneedleModule = new BeeneedleModule()
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
        })

        // 获取系统设置项
        this.app.post('/setting/get', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            this.setting.getData(request.body, response, next)
        })

        // 获取管理员上次登录信息
        this.app.post('/limit/lastLoginTime', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            this.setting.getLoginInfo(request.body, response, next)
        })

        // login路由
        this.app.post('/login/dologin', urlencodedParser, (request, response, next) => {
            // if(!this.login) this.login = new Login() // 判断Login对象是否存在 不存在才生成
            this.login.checkLogin(request.body, request, response, next)
        })

        // 获取文件系统信息
        this.app.post('/host/getSystems', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            this.host.getSystems(request.body, response, next)
        })

        // 主机重新部署
        this.app.post('/host/hostSetup/:ids', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            let host_ids = request.params.ids || null
            this.host.reset(host_ids, response, next)
        })

        // 获取主机
        this.app.post('/host/get', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            this.host.getData(request.body, response, next)
        })

        // 通过获取主机
        this.app.post('/host/get/:ids', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            let host_ids = request.params.ids || null
            this.host.getDataById(host_ids, response, next)
        })

        // 根据ids删除主机
        this.app.post('/host/delete/:ids', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            let host_ids = request.params.ids || null
            this.host.deleteDataById(host_ids, response, next)
        })

        // 批量删除主机
        this.app.post('/host/delete', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            let idsArr = request.body || []
            this.host.deleteDataBatch(idsArr, response, next)
        })

        // 修改主机
        this.app.post('/host/put', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            this.host.upDateData(request.body, response, next)
        })

        // 添加主机
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
                login_name: request.session.role.login_name,
                ids: request.session.role.ids
            }
            response.send(JSON.stringify(getJson('成功', 200, data)))
            // this.login.checkRole(token, response, next)
        })

        // 获取主机模块
        this.app.post('/BeeneedleModule/get', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            this.beeneedleModule.getData(request.body, response, next)
        })

        // 设置主机模块
        this.app.post('/BeeneedleModule/put', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            this.beeneedleModule.upDateData(request.body, response, next)
        })

        // 获取用户信息
        this.app.post('/user/get', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            this.user.getData(request, response, next)
        })

        // 获取单个用户信息
        this.app.post('/user/get/:ids', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            let ids = request.params.ids || null
            this.user.getDataById(ids, response, next)
        })

        // 添加用户信息 validate检查一下
        this.app.post('/user/post', [
            check('login_name')
                .trim()
                .isLength({ max: 20 }).withMessage('login_name should length <= 20')
                .not().isIn(['', undefined,null]).withMessage('you have no login_name'),
                // .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{10,24}$/).withMessage('login_name not match'),
            check('username')
                .trim()
                .not().isIn(['', undefined,null]).withMessage('you have no username'),
            check('email')
                .trim()
                .isEmail().withMessage('must be an email'),
            check('login_pwd')
                .trim()
                .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{10,24}$/).withMessage('password not match')
        ], (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            const errors = validationResult(request);
            // console.log(errors.array())
            // console.log(errors.mapped())
            if (!errors.isEmpty()) {
                let msg = errors.array()[0].msg
                //   return response.status(422).json({ errors: errors.mapped() });
                return response.send(JSON.stringify(getJson(msg, 606, null)))
            }
            this.user.addData(request, response, next)
        })

        // 修改用户信息
        this.app.post('/user/put', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            this.user.upDateData(request.body, response, next)
        })

        // 删除用户信息
        this.app.post('/user/delete/:ids', (request, response, next) => {
            if (!checkToken(request)) return response.send(JSON.stringify(getJson('用户登录失效', 611, null)))
            let ids = request.params.ids || null
            this.user.deleteDataById(ids, response, next)
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

        // 捕获所有的除了上述路由之外的post请求
        this.app.post('*', (request, response, next) => {
            console.log('post请求：' + request.url)
            next()
        })
    }
}