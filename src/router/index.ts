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
import BeeneedleObjectLabel from '../web/BeeneedleObjectLabel'
import BeeneedleObjectHost from '../web/BeeneedleObjectHost'
import BeeneedleSoftware from '../web/BeeneedleSoftware'
import BeeneedleMac from '../web/BeeneedleMac'
import BeeneedleComplete from '../web/BeeneedleComplete'
import BeeneedleProtect from '../web/BeeneedleProtect'
import BeeneedleProtectFileProp from '../web/BeeneedleProtectFileProp'
import BeeneedleProcessAccessAudit from '../web/BeeneedleProcessAccessAudit'
import BeeneedleSensesAccessAudit from '../web/BeeneedleSensesAccessAudit'
import BeeneedleProtectFilePropAudit from '../web/BeeneedleProtectFilePropAudit'
import BeeneedleApplicationAudit from '../web/BeeneedleApplicationAudit'
import BeeneedlePolicyLoadAudit from '../web/BeeneedlePolicyLoadAudit'
import BeeneedleSafeConfigAudit from '../web/BeeneedleSafeConfigAudit'
import BeeeyeUserLoginAudit from '../web/BeeeyeUserLoginAudit'
import BeeeyeUserConfigAudit from '../web/BeeeyeUserConfigAudit'
import BeeeyeSafeLib from '../web/BeeeyeSafeLib'
import BeeneedleGlobalAudit from '../web/BeeneedleGlobalAudit'
import BeeeyeThreshold from '../web/BeeeyeThreshold'
import BeeeyeAuditOut from '../web/BeeeyeAuditOut'
import { checkToken, getJson } from '../util/index'
import multipart = require('connect-multiparty')
import express = require('express')
import bodyParser = require('body-parser')
import Redis from '../util/Redis'
const { check, validationResult } = require('express-validator/check')
const { matchedData, sanitize } = require('express-validator/filter')
import fs = require("fs")
import multer = require('multer')
var storage = multer.diskStorage({
    // //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
        cb(null, './upload')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        // console.log(file)
        // cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
        cb(null, file.originalname)
    }
});  
let uploadInfo = multer({storage})

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
    public beeneedleObjectLabel: BeeneedleObjectLabel = new BeeneedleObjectLabel()
    public beeneedleObjectHost: BeeneedleObjectHost = new BeeneedleObjectHost()
    public beeneedleSoftware: BeeneedleSoftware = new BeeneedleSoftware()
    public beeneedleMac: BeeneedleMac = new BeeneedleMac()
    public beeneedleComplete: BeeneedleComplete = new BeeneedleComplete()
    public beeneedleProtect: BeeneedleProtect = new BeeneedleProtect()
    public beeneedleProtectFileProp: BeeneedleProtectFileProp = new BeeneedleProtectFileProp()
    public beeneedleProcessAccessAudit: BeeneedleProcessAccessAudit = new BeeneedleProcessAccessAudit()
    public beeneedleSensesAccessAudit: BeeneedleSensesAccessAudit = new BeeneedleSensesAccessAudit()
    public beeneedleProtectFilePropAudit: BeeneedleProtectFilePropAudit = new BeeneedleProtectFilePropAudit()
    public beeneedleApplicationAudit: BeeneedleApplicationAudit = new BeeneedleApplicationAudit()
    public beeneedlePolicyLoadAudit: BeeneedlePolicyLoadAudit = new BeeneedlePolicyLoadAudit()
    public beeneedleSafeConfigAudit: BeeneedleSafeConfigAudit = new BeeneedleSafeConfigAudit()
    public beeeyeUserLoginAudit: BeeeyeUserLoginAudit = new BeeeyeUserLoginAudit()
    public beeeyeUserConfigAudit: BeeeyeUserConfigAudit = new BeeeyeUserConfigAudit()
    public beeeyeSafeLib: BeeeyeSafeLib = new BeeeyeSafeLib()
    public beeneedleGlobalAudit: BeeneedleGlobalAudit = new BeeneedleGlobalAudit()
    public beeeyeThreshold: BeeeyeThreshold = new BeeeyeThreshold()
    public beeeyeAuditOut: BeeeyeAuditOut = new BeeeyeAuditOut()
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

        // 获取进程访控审计
        this.app.post('/BeeneedleProcessAccessAudit/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProcessAccessAudit.getData(request.body, response, next)
            })
        })

        // 单个删除进程访控审计
        this.app.post('/BeeneedleProcessAccessAudit/delete/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProcessAccessAudit.deleteDataById(request.params.ids, response, next)
            })
        })

        // 批量删除进程访控审计
        this.app.post('/BeeneedleProcessAccessAudit/delete', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProcessAccessAudit.deleteDataBatch(request.body, response, next)
            })
        })

        // 获取敏感资源访控审计
        this.app.post('/BeeneedleSensesAccessAudit/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleSensesAccessAudit.getData(request.body, response, next)
            })
        })

        // 单个删除敏感资源访控审计
        this.app.post('/BeeneedleSensesAccessAudit/delete/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleSensesAccessAudit.deleteDataById(request.params.ids, response, next)
            })
        })

        // 批量删除敏感资源访控审计
        this.app.post('/BeeneedleSensesAccessAudit/delete', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleSensesAccessAudit.deleteDataBatch(request.body, response, next)
            })
        })

        // 获取文件属性保护审计
        this.app.post('/BeeneedleFileProtectAudit/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProtectFilePropAudit.getData(request.body, response, next)
            })
        })

        // 单个删除文件属性保护审计
        this.app.post('/BeeneedleFileProtectAudit/delete/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProtectFilePropAudit.deleteDataById(request.params.ids, response, next)
            })
        })

        // 批量删除文件属性保护审计
        this.app.post('/BeeneedleFileProtectAudit/delete', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProtectFilePropAudit.deleteDataBatch(request.body, response, next)
            })
        })

        // 获取应用程序审计
        this.app.post('/BeeneedleGrayFileAudit/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleApplicationAudit.getData(request.body, response, next)
            })
        })

        // 单个删除应用程序审计
        this.app.post('/BeeneedleGrayFileAudit/delete/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleApplicationAudit.deleteDataById(request.params.ids, response, next)
            })
        })

        // 批量删除应用程序审计
        this.app.post('/BeeneedleGrayFileAudit/delete', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleApplicationAudit.deleteDataBatch(request.body, response, next)
            })
        })

        // 获取策略加载审计
        this.app.post('/BeeneedlePolicyLoadAudit/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedlePolicyLoadAudit.getData(request.body, response, next)
            })
        })

        // 删除单个策略加载审计
        this.app.post('/BeeneedlePolicyLoadAudit/delete/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedlePolicyLoadAudit.deleteDataById(request.params.ids, response, next)
            })
        })

        // 批量删除策略加载审计
        this.app.post('/BeeneedlePolicyLoadAudit/delete', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedlePolicyLoadAudit.deleteDataBatch(request.body, response, next)
            })
        })

        // 获取安全配置审计
        this.app.post('/BeeneedleConfigAudit/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleSafeConfigAudit.getData(request.body, response, next)
            })
        })

        // 删除单个安全配置审计
        this.app.post('/BeeneedleConfigAudit/delete/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleSafeConfigAudit.deleteDataById(request.params.ids, response, next)
            })
        })

        // 批量删除安全配置审计
        this.app.post('/BeeneedleConfigAudit/delete', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleSafeConfigAudit.deleteDataBatch(request.body, response, next)
            })
        })

        // 清空安全配置审计
        this.app.post('/BeeneedleConfigAudit/clearAll', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleSafeConfigAudit.clearAll(response, next)
            })
        })

        // 获取用户登录审计
        this.app.post('/audit/login/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeUserLoginAudit.getData(request.body, response, next)
            })
        })

        // 删除单个用户登录审计
        this.app.post('/audit/login/delete/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeUserLoginAudit.deleteDataById(request.params.ids, response, next)
            })
        })

        // 批量删除用户登录审计
        this.app.post('/audit/login/delete', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeUserLoginAudit.deleteDataBatch(request.body, response, next)
            })
        })

        // 清空用户登录审计
        this.app.post('/audit/login/clearAll', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeUserLoginAudit.clearAll(response, next)
            })
        })

        // 获取用户配置审计
        this.app.post('/user/getAudit', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeUserConfigAudit.getData(request.body, response, next)
            })
        })

        // 获取进程保护列表
        this.app.post('/BeeneedleProtected/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProtect.getData(request.body, response, next)
            })
        })


        //  添加进程保护
        this.app.post('/BeeneedleProtected/post', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProtect.addData(request.body, response, next)
            })
        })


        //  获取单个进程保护
        this.app.post('/BeeneedleProtected/get/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProtect.getDataById(request.params.ids, response, next)
            })
        })

        //  修改进程保护
        this.app.post('/BeeneedleProtected/put', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProtect.upDateData(request.body, response, next)
            })
        })

        //  删除单个进程保护
        this.app.post('/BeeneedleProtected/delete/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProtect.deleteDataById(request.params.ids, response, next)
            })
        })

        // 获取文件属性保护列表
        this.app.post('/FileAttribute/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProtectFileProp.getData(request.body, response, next)
            })
        })


        //  添加文件属性保护
        this.app.post('/FileAttribute/post', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProtectFileProp.addData(request.body, response, next)
            })
        })


        //  获取单个文件属性保护
        this.app.post('/FileAttribute/get/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProtectFileProp.getDataById(request.params.ids, response, next)
            })
        })

        //  修改文件属性保护
        this.app.post('/FileAttribute/put', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProtectFileProp.upDateData(request.body, response, next)
            })
        })

        //  删除单个文件属性保护
        this.app.post('/FileAttribute/delete/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleProtectFileProp.deleteDataById(request.params.ids, response, next)
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

        // 获取客体列表
        this.app.post('/BeeneedleObjectLabel/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleObjectLabel.getData(request.body, response, next)
            })
        })

        // 获取单个客体
        this.app.post('/BeeneedleObjectLabel/get/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleObjectLabel.getDataById(request.params.ids, response, next)
            })
        })

        // 修改单个客体
        this.app.post('/BeeneedleObjectLabel/put', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleObjectLabel.upDateData(request.body, response, next)
            })
        })

        // 删除单个客体
        this.app.post('/BeeneedleObjectLabel/delete/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleObjectLabel.deleteDataById(request.params.ids, response, next)
            })
        })

        // 添加客体
        this.app.post('/BeeneedleObjectLabel/post', (request, response, next) => {
            checkToken(request, response, o => {
                request.checkBody({
                    type: {
                        notEmpty: true,
                        errorMessage: '参数type不能为空'
                    },
                    name: {
                        notEmpty: true,
                        errorMessage: '参数name不能为空'
                    },
                    path: {
                        notEmpty: true,
                        errorMessage: '参数path不能为空'
                    }
                })
                var errors = request.validationErrors()
                if (errors) {
                    let msg = errors[0].msg
                    return response.json((getJson(msg, 606, null)))
                }
                this.beeneedleObjectLabel.addData(request.body, response, next)
            })
        })


        // 获取客体关联的主机
        this.app.post('/BeeneedleObjectLabel/getHost', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleObjectHost.getData(request.body, response, next)
            })
        })

        // 修改客体关联的主机
        this.app.post('/BeeneedleObjectHost/post', (request, response, next) => {
            checkToken(request, response, o => {
                request.checkBody({
                    object_ids: {
                        notEmpty: true,
                        errorMessage: '参数object_ids不能为空'
                    }
                })
                var errors = request.validationErrors()
                if (errors) {
                    let msg = errors[0].msg
                    return response.json((getJson(msg, 606, null)))
                }
                this.beeneedleObjectHost.upDateData(request.body, response, next)
            })
        })

        // 获取软件安装列表
        this.app.post('/SoftWare_SPEC/updown/get', (request, response, next) => {
            checkToken(request, response, o => {
                request.checkBody({
                    row: {
                        notEmpty: true,
                        errorMessage: '参数row不能为空'
                    },
                    'row.platformIds': {
                        notEmpty: true,
                        errorMessage: '参数row的字段platformIds不能为空'
                    }
                })
                var errors = request.validationErrors()
                if (errors) {
                    let msg = errors[0].msg
                    return response.json((getJson(msg, 606, null)))
                }
                this.beeneedleSoftware.getData(request.body, response, next)
            })
        })

        // 添加软件安装
        this.app.post('/SoftWare_SPEC/updown/post', multipartMiddleware, (request, response, next) => {
            checkToken(request, response, o => {
                request.checkBody({
                    platform_ids: {
                        notEmpty: true,
                        errorMessage: '参数platform_ids不能为空'
                    },
                    group_name: {
                        notEmpty: true,
                        errorMessage: '参数group_name不能为空'
                    },
                    version: {
                        notEmpty: true,
                        errorMessage: '参数version不能为空'
                    }
                })
                var errors = request.validationErrors()
                if (errors) {
                    let msg = errors[0].msg
                    return response.json((getJson(msg, 606, null)))
                }
                this.beeneedleSoftware.addData(request, response, next)
            })
        })

        // 删除软件安装
        this.app.post('/SoftWare_SPEC/updown/delete/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleSoftware.deleteDataById(request.params.ids, response, next)
            })
        })

        // 获取强制访问列表
        this.app.post('/BeeneedleMac/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleMac.getData(request.body, response, next)
            })
        })

        // 获取单个敏感资源访控
        this.app.post('/BeeneedleMac/get/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleMac.getDataById(request.params.ids, response, next)
            })
        })

        // 增加敏感资源访控
        this.app.post('/BeeneedleMac/post', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleMac.addData(request.body, response, next)
            })
        })

        // 修改敏感资源访控
        this.app.post('/BeeneedleMac/put', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleMac.upDateData(request.body, response, next)
            })
        })

        // 删除敏感资源访控
        this.app.post('/BeeneedleMac/delete/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleMac.deleteDataById(request.params.ids, response, next)
            })
        })

        // 获取完整性列表
        this.app.post('/BeeneedleIntegrity/get/:type', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleComplete.getData(request, response, next)
            })
        })

        // 删除完整性
        this.app.post('/BeeneedleIntegrity/delete/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleComplete.deleteDataById(request.params.ids, response, next)
            })
        })

        // 增加完整性
        this.app.post('/BeeneedleIntegrity/post', (request, response, next) => {
            checkToken(request, response, o => {
                request.checkBody({
                    host_ids: {
                        notEmpty: true,
                        errorMessage: '参数host_ids不能为空'
                    },
                    type: {
                        notEmpty: true,
                        errorMessage: '参数type不能为空'
                    },
                    file_type: {
                        notEmpty: true,
                        errorMessage: '参数file_type不能为空'
                    },
                    name: {
                        notEmpty: true,
                        errorMessage: '名称不能为空'
                    },
                    full_path: {
                        notEmpty: true,
                        errorMessage: '路径不能为空'
                    }
                })
                var errors = request.validationErrors()
                if (errors) {
                    let msg = errors[0].msg
                    return response.json((getJson(msg, 606, null)))
                }
                this.beeneedleComplete.addData(request.body, response, next)
            })
        })

        // 检查完整性
        this.app.post('/BeeneedleIntegrity/check', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleComplete.check(request.body, response, next)
            })
        })

        // 获取windows安全库列表
        this.app.post('/bl/win/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeSafeLib.getWindowsData(request.body, response, next)
            })
        })

        // 获取linux安全库列表
        this.app.post('/bl/linux/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeSafeLib.getLinuxData(request.body, response, next)
            })
        })

        // 修改单个windows安全库列表
        this.app.post('/bl/win/put/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeSafeLib.upDateWindowsDataById(request.body, response, next)
            })
        })

        // 修改单个linux安全库列表
        this.app.post('/bl/linux/put/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeSafeLib.upDateLinuxDataById(request.body, response, next)
            })
        })

        // 批量修改windows安全库列表
        this.app.post('/bl/win/put/', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeSafeLib.upDateWindowsDataBatch(request.body, response, next)
            })
        })

        // 批量修改linux安全库列表
        this.app.post('/bl/linux/put/', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeSafeLib.upDateLinuxDataBatch(request.body, response, next)
            })
        })

        // 获取策略加载审计列表
        this.app.post('/BeeneedleGlobalAudit/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleGlobalAudit.getData(request.body, response, next)
            })
        })

        // 修改单个策略加载审计
        this.app.post('/BeeneedleGlobalAudit/put', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleGlobalAudit.upDateDataById(request.body, response, next)
            })
        })

        // 批量修改打开策略加载审计
        this.app.post('/BeeneedleGlobalAudit/enableAll', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleGlobalAudit.upDateDataBatch(request.body, response, next)
            })
        })

        // 批量修改关闭策略加载审计
        this.app.post('/BeeneedleGlobalAudit/disableAll', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeneedleGlobalAudit.upDateDataBatch(request.body, response, next)
            })
        })

        // 获取阈值配置数据
        this.app.post('/hostTh/get/:ids', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeThreshold.getData(request.params.ids, response, next)
            })
        })

        // 修改阈值配置数据
        this.app.post('/hostTh/put', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeThreshold.upDateData(request.body, response, next)
            })
        })

        // 获取数据导出数据
        this.app.post('/audit/output/get', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeAuditOut.getData(request.body, response, next)
            })
        })

        // 添加数据导出数据
        this.app.post('/storagespace/post', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeAuditOut.addData(request.body, response, next)
            })
        })

        // 删除数据导出数据
        this.app.post('/storagespace/delete/:fileName', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeAuditOut.deleteDataById(request.params.fileName, response, next)
            })
        })

        // 下载数据导出数据
        this.app.get('/storagespace/download/:fileName', (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeAuditOut.downFile(request.params.fileName, response, next)
            })
        })

        // 上传数据导出数据
        this.app.post('/storagespace/upload/', uploadInfo.single('file'), (request, response, next) => {
            checkToken(request, response, o => {
                this.beeeyeAuditOut.uploadFile(request, response, next)
            })
        })

        // 获取管理员设置信息
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
            // console.log('666')
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

        // 测试下载链接
        this.app.get('/testdownload', (request, response, next) => {
            console.log('下载美女来了')
            let path = 'c:/mv.jpg'
            response.download(path)
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