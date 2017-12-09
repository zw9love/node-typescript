/**
 * @author zengwei
 * @since 2017/11/15
 */

import Service from '../../service/login/index'
import { getJson } from '../../util/index'
import { request,response } from '../../interface/index'

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
     * @param request 请求体
     * @param response 响应体
     * @param next 向下执行方法
     */
    checkLogin(json: loginData, request: request, response: response, next: Function): void {
        this.service.checkLogin(json, res => {
            if (res.status === 606) return response.send(JSON.stringify(res.data))
            request.session.token = res.token
            request.session.role = res.role
            request.session.count = 1
            response.header("token", res.token)
            response.send(JSON.stringify(res.data))
        }, next)
    }

    /**
     * @description 获取菜单
     * @param response 响应体
     * @param next 向下执行方法
     */
    getMenu(response: response, next: Function): void {
        // if (!Role.checkToken(token)) return response.send(JSON.stringify(getJson('用户登录失效', 611)));
        this.service.getMenu(data => {
            response.send(JSON.stringify(data));
        }, next)
    }
}