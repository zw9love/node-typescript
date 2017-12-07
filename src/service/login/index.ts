/**
 * @author zengwei
 * @since 2017/12/7
 */

import Dao from '../../dao/index'
import { autoGetData } from '../../filters/index'
import { getJson, getToken } from '../../util/index'


interface json {
    name?: string
    ip?: string
    port?: string
    login_name?: string
    login_pwd?: string
    host_ids?: string
    os_type?: string
    os_version?: string
    os_arch?: string
}

interface loginData {
    login_name: string
    login_pwd: string
    username?: string
}

export default class Service {
    public dao = new Dao()
    private tableName: string = 'common_user'
    private role: loginData = { login_name: 'root', login_pwd: '', username: '超级管理员' }
    public token: string = 'debug'
    private userData: Array<loginData> = [
        { login_name: 'sysadmin', login_pwd: 'admin123.com', username: '系统管理员' },
        { login_name: 'audadmin', login_pwd: 'admin123.com', username: '审计管理员' },
        { login_name: 'secadmin', login_pwd: 'admin123.com', username: '安全管理员' }
    ]

    constructor() { }
    /**
     * @description 检查登录是否成功
     * @param data  登录的信息（账号密码）
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    checkLogin(data: loginData, successFn?: Function, errorFn?: Function) {
        let sql = `SELECT * FROM ${this.tableName}`
        // console.log(md5(data.login_name))
        this.dao.connectDatabase(sql, data, res => {
            let flag: boolean = false
            let userData = this.userData
            userData.forEach(e => {
                if (e.login_name === data.login_name && e.login_pwd === data.login_pwd){
                    flag = true
                    this.role = e
                }
            })
            let json: object = flag ? getJson('登录成功', 200, null) : getJson('用户名或密码错误', 606, null)
            if (successFn) successFn(json)
        }, errorFn)
    }
    /**
     * @description 查看是哪个管理员
     * @param token  每次http请求的token值
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    checkRole(token: string, successFn?: Function, errorFn?: Function) {
        if (token === this.token){
            let data = {
                zh_names: this.role.username,
                login_name: this.role.login_name
            }
            let json = getJson('成功', 200, data)
            if (successFn) successFn(json)
        }
    }
}