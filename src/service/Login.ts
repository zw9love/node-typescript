/**
 * @author zengwei
 * @since 2017/12/07
 */

import Dao from '../dao/index'
import { getJson, getRandomString,aesEncrypt } from '../util/index'
import { loginData } from '../interface/index'

export default class Login {
    public dao = new Dao()
    private tableName: string = 'common_user'
    private userData: Array<loginData> = [
        { login_name: 'sysadmin', login_pwd: 'admin123.com', username: '系统管理员', ids: '57b2aa524a7e85b9a1a3cb0f' },
        { login_name: 'audadmin', login_pwd: 'admin123.com', username: '审计管理员', ids: '57b2aa524a7e85b9a1a3cb11' },
        { login_name: 'secadmin', login_pwd: 'admin123.com', username: '安全管理员', ids: '57b2aa524a7e85b9a1a3cb12' }
    ]

    constructor() {
    }

    /**
     * @description 检查登录是否成功
     * @param data  登录的信息（账号密码）
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    checkLogin(data: loginData, successFn?: Function, errorFn?: Function): void {
        // console.log(data)
        let login_name = data.login_name
        let login_pwd = aesEncrypt(data.login_pwd)
        let sql = `SELECT * FROM ${this.tableName} where login_name = ? and login_pwd = ? `
        let sqlData = [login_name,login_pwd]
        // console.log(sqlData)
        this.dao.connectDatabase(sql, sqlData, res => {
            let flag: boolean = false
            let role: any = {}
            if(res.length === 1){
                flag = true
                role = res[0]
                role.token = getRandomString()
            }
            // 登录成功data
            let loginSuccessData = {
                role: role,
                // token: getRandomString(),
                data: getJson('登录成功', 200, null),
                status: 200
            }

            // 登录失败data
            let loginfailData = {
                data: getJson('用户名或密码错误', 606, null),
                status: 606
            }

            let json: object = flag ? loginSuccessData : loginfailData
            if (successFn) successFn(json)
        }, errorFn)
    }

    /**
     * @description 获取菜单
     * @param token 每次http请求的token值
     * @param successFn 成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    getMenu(successFn?: Function, errorFn?: Function): void {
        let sql = `SELECT * FROM common_menu`
        this.dao.connectDatabase(sql, null, res => {
            let json = getJson('成功', 200, res)
            if (successFn) successFn(json)
        }, errorFn)
    }
}