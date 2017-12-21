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
import BeeneedlePelf from '../web/BeeneedlePelf'
import BeeneedleProcessSubject from '../web/BeeneedleProcessSubject'
import BeeneedleProcessHost from '../web/BeeneedleProcessHost'
import { checkToken, getJson } from '../util/index'
import multipart = require('connect-multiparty')
import express = require('express')
import bodyParser = require('body-parser')
import Redis from '../util/Redis'
const { check, validationResult } = require('express-validator/check')
const { matchedData, sanitize } = require('express-validator/filter')
import fs = require("fs")


var multipartMiddleware = multipart()
var urlencodedParser = bodyParser.urlencoded({ extended: false }) // 如果前台传递的类型是Form Data类型的数据

export default class Router {
    public host: Host = new Host()
    public login: Login = new Login()
    public setting: Setting = new Setting()
    public user: User = new User()
    public beeneedleModule: BeeneedleModule = new BeeneedleModule()
    public beeneedlePelf: BeeneedlePelf = new BeeneedlePelf()
    public beeneedleProcessSubject: BeeneedleProcessSubject = new BeeneedleProcessSubject()
    public beeneedleProcessHost: BeeneedleProcessHost = new BeeneedleProcessHost()
    public app: any
    public client: any = Redis.client
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

        // 获取黑白灰名单列表
        this.app.post('/BeeneedlePelf/get', (request, response, next) => {
            checkToken(request, response, o => {
                request.checkBody({
                    row: {
                        notEmpty: true,
                        errorMessage: '参数row不能为空'
                    },
                    'row.host_ids':{
                        notEmpty: true,
                        errorMessage: '参数row的字段host_ids不能为空',
                    },
                    'row.pelfstatus': {
                        notEmpty: true,
                        errorMessage: '参数row的字段pelfstatus不能为空',
                    }
                })
                var errors = request.validationErrors()
                if (errors) {
                    let msg = errors[0].msg
                    return response.json((getJson(msg, 606, null)))
                }
                this.beeneedlePelf.getData(request.body, response, next)
            })
        })

        // 删除黑白灰名单
        this.app.post('/BeeneedlePelf/delete/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                let ids = request.params.ids
                this.beeneedlePelf.deleteDataById(ids, response, next)
            })
        })

        // 设置黑白灰名单
        this.app.post('/BeeneedlePelf/put', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedlePelf.upDateData(request.body, response, next)
            })
        })

        // 获取进程主体列表
        this.app.post('/BeeneedleProcessSubject/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProcessSubject.getData(request.body, response, next)
            })
        })

        // 获取单个进程主体
        this.app.post('/BeeneedleProcessSubject/get/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                let host_ids = request.params.ids
                this.beeneedleProcessSubject.getDataById(host_ids, response, next)
            })
        })

        // 删除单个进程主体
        this.app.post('/BeeneedleProcessSubject/delete/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                let host_ids = request.params.ids
                this.beeneedleProcessSubject.deleteDataById(host_ids, response, next)
            })
        })

        // 添加进程主体
        this.app.post('/BeeneedleProcessSubject/post', (request, response, next) => {
            checkToken(request, response, o => {
                request.checkBody({
                    name: {
                        notEmpty: true,
                        errorMessage: '进程主体名不能为空'
                    },
                    path: {
                        notEmpty: true,
                        errorMessage: '进程路径不能为空',
                    }
                })
                var errors = request.validationErrors()
                if (errors) {
                    let msg = errors[0].msg
                    return response.json((getJson(msg, 606, null)))
                }
                this.beeneedleProcessSubject.addData(request.body, response, next)
            })
        })

        // 修改进程主体
        this.app.post('/BeeneedleProcessSubject/put', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProcessSubject.upDateData(request.body, response, next)
            })
        })

        // 获取进程主体关联的主机
        this.app.post('/BeeneedleProcessHost/get', (request, response, next) => {
            checkToken(request, response, o => {
                request.checkBody({
                    row: {
                        notEmpty: true,
                        errorMessage: '参数row不能为空'
                    },
                    'row.process_ids': {
                        notEmpty: true,
                        errorMessage: '参数row的字段process_ids不能为空'
                    }
                })
                var errors = request.validationErrors()
                if (errors) {
                    let msg = errors[0].msg
                    return response.json((getJson(msg, 606, null)))
                }
                this.beeneedleProcessHost.getData(request.body, response, next)
            })
        })

        // 修改进程主体关联的主机
        this.app.post('/BeeneedleProcessHost/post', (request, response, next) => {
            checkToken(request, response, o => {
                request.checkBody({
                    process_ids: {
                        notEmpty: true,
                        errorMessage: '参数process_ids不能为空'
                    }
                })
                var errors = request.validationErrors()
                if (errors) {
                    let msg = errors[0].msg
                    return response.json((getJson(msg, 606, null)))
                }
                this.beeneedleProcessHost.upDateData(request.body, response, next)
            })
        })

        // 获取系统设置项
        this.app.post('/setting/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.setting.getData(request.body, response, next)
            })
        })

        // 获取管理员上次登录信息
        this.app.post('/limit/lastLoginTime', (request, response, next) => {
            checkToken(request, response, o => {
                this.setting.getLoginInfo(request.body, response, next)
            })
        })

        // login路由
        // this.app.post('/login/dologin', urlencodedParser, [
        this.app.post('/login/dologin', [
            check('login_name')
                .trim()
                .not().isIn(['', undefined, null]).withMessage('请填写登录名！'),
            // .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{10,24}$/).withMessage('login_name not match'),
            check('login_pwd')
                .trim()
                .not().isIn(['', undefined, null]).withMessage('请填写密码！')
                .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{10,24}$/).withMessage('设置的密码不符合要求！，请重新填写！')
        ], (request, response, next) => {
            // if(!this.login) this.login = new Login() // 判断Login对象是否存在 不存在才生成
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                let msg = errors.array()[0].msg
                return response.json((getJson(msg, 606, null)))
            }
            this.login.checkLogin(request.body, request, response, next)
        })

        // 获取文件系统信息
        this.app.post('/host/getSystems', (request, response, next) => {
            checkToken(request, response, o => {
                this.host.getSystems(request.body, response, next)
            })
        })

        // 主机重新部署
        this.app.post('/host/hostSetup/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                let host_ids = request.params.ids || null
                this.host.reset(host_ids, response, next)
            })
        })

        // 获取主机
        this.app.post('/host/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.host.getData(request.body, response, next)
            })
        })

        // 通过获取主机
        this.app.post('/host/get/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                let host_ids = request.params.ids || null
                this.host.getDataById(host_ids, response, next)
            })
        })

        // 根据ids删除主机
        this.app.post('/host/delete/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                let host_ids = request.params.ids || null
                this.host.deleteDataById(host_ids, response, next)
            })
        })

        // 批量删除主机
        this.app.post('/host/delete', (request, response, next) => {
            checkToken(request, response, o => {
                let idsArr = request.body || []
                this.host.deleteDataBatch(idsArr, response, next)
            })
        })

        // 修改主机
        this.app.post('/host/put', (request, response, next) => {
            checkToken(request, response, o => {
                this.host.upDateData(request.body, response, next)
            })
        })

        // 添加主机
        this.app.post('/host/post', [
            check('name')
                .trim()
                .not().isIn(['', undefined, null]).withMessage('请填写主机名！')
                .isLength({ max: 32 }).withMessage('主机名不能大于32位字符！'),
            check('ip')
                .trim()
                .not().isIn(['', undefined, null]).withMessage('请填写您的主机IP！')
                .matches(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/).withMessage('请填写一个合法的IP地址！'),
            check('port')
                .trim()
                .not().isIn(['', undefined, null]).withMessage('请填写您的主机端口！'),
            check('login_name')
                .trim()
                .not().isIn(['', undefined, null]).withMessage('请填写登录名！')
                .isLength({ max: 32 }).withMessage('登录名不能大于32位字符！'),
            check('login_pwd')
                .trim()
                .not().isIn(['', undefined, null]).withMessage('请填写登录密码！')
                .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{10,24}$/).withMessage('设置的密码不符合要求！，请重新填写！')
        ], (request, response, next) => {
            checkToken(request, response, o => {
                // console.log(request.body)
                const errors = validationResult(request);
                if (!errors.isEmpty()) {
                    let msg = errors.array()[0].msg
                    return response.json((getJson(msg, 606, null)))
                }
                this.host.addData(request.body, response, next)
            })
        })

        // 拿到FormData上传的参数
        this.app.post('/upload', multipartMiddleware, function (request, response, next) {
            checkToken(request, response, o => {
                console.log(request.body, request.files)
            })
        })

        // 获取菜单
        this.app.post('/menu/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.login.getMenu(response, next)
            })
        })

        // 获取权限
        this.app.post('/role/getCur', (request, response, next) => {
            checkToken(request, response, o => {
                if (request.headers.token === 'debug') return response.json(getJson('成功', 200, { login_name: 'root', zh_names: '超级管理员', ids: 0 }))
                this.client.get("role", function (err, res) {
                    if (err) return false
                    let role = JSON.parse(res)
                    let data = {
                        zh_names: role.username,
                        login_name: role.login_name,
                        ids: role.ids
                    }
                    response.json((getJson('成功', 200, data)))
                })
            })
        })

        // 获取主机模块
        this.app.post('/BeeneedleModule/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleModule.getData(request.body, response, next)
            })
        })

        // 设置主机模块
        this.app.post('/BeeneedleModule/put', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleModule.upDateData(request.body, response, next)
            })
        })

        // 获取用户信息
        this.app.post('/user/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.user.getData(request, response, next)
            })
        })

        // 获取单个用户信息
        this.app.post('/user/get/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                let ids = request.params.ids || null
                this.user.getDataById(ids, response, next)
            })
        })

        // 添加用户信息 validate检查一下
        this.app.post('/user/post', [
            check('login_name')
                .trim()
                .not().isIn(['', undefined, null]).withMessage('请填写登录名！')
                .isLength({ max: 32 }).withMessage('登录名不能大于32位字符！'),
            // .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{10,24}$/).withMessage('login_name not match'),
            check('username')
                .trim()
                .not().isIn(['', undefined, null]).withMessage('请填写用户名！')
                .isLength({ max: 32 }).withMessage('用户名不能大于32位字符！'),
            check('email')
                .trim()
                .not().isIn(['', undefined, null]).withMessage('请填写您的邮箱！')
                .isEmail().withMessage('请输入一个正确的邮箱！'),
            check('login_pwd')
                .trim()
                .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{10,24}$/).withMessage('设置的密码不符合要求！，请重新填写！')
        ], (request, response, next) => {
            checkToken(request, response, o => {
                const errors = validationResult(request);
                // console.log(errors.array())
                // console.log(errors.mapped())
                if (!errors.isEmpty()) {
                    let msg = errors.array()[0].msg
                    //   return response.status(422).json({ errors: errors.mapped() });
                    return response.json((getJson(msg, 606, null)))
                }
                this.user.addData(request, response, next)
            })
        })

        // 修改用户信息
        this.app.post('/user/put', (request, response, next) => {
            checkToken(request, response, o => {
                this.user.upDateData(request.body, response, next)
            })
        })

        // 删除用户信息
        this.app.post('/user/delete/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                let ids = request.params.ids || null
                this.user.deleteDataById(ids, response, next)
            })
        })


        // 判断到底是登录蜂眼还是重定向到登录页
        this.app.post('/', (request, response, next) => {
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
        this.app.post('/login/loged', (request, response, next) => {
            this.loginActive = true
            this.client.get("role", function (err, res) {
                if (err) return false
                let role = JSON.parse(res)
                response.json((getJson('成功', 200, { role: role })))
            })

            // 老版本登录
            // this.loginActive = true
            // response.writeHead(302, { 'Location': '/' })
            // response.end()
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
            // console.log(request.url)
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