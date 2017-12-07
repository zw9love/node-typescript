/**
 * @author zengwei
 * @since 2017/11/15
 */

// let service = require('../../service/host/index')
import Service from '../../service/login/index'
import { getToken } from '../../util/index'

interface response {
    send: Function
    header: Function
}

interface loginData {
    login_name: string
    login_pwd: string
}

export default class Login {
    public service = new Service()
    constructor() { }
    /**
     * @description 检查登录是否成功
     * @param json 登录的信息（账号密码）
     * @param response 响应体
     * @param next 向下执行方法
     */
    checkLogin(json: loginData, response: response, next: Function): void {
        this.service.checkLogin(json, data => {
            if (data.status === 200){
                let token = getToken()
                this.service.token = token
                response.header("token", token)
            }
            response.send(JSON.stringify(data));
        }, next)
    }
    /**
     * @description 查看是哪个管理员
     * @param token 每次http请求的token值
     * @param response 响应体
     * @param next 向下执行方法
     */
    checkRole(token: string, response: response, next: Function): void {
        this.service.checkRole(token, data => {
            response.send(JSON.stringify(data));
        }, next)
    }
}