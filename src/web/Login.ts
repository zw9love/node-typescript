/**
 * @author zengwei
 * @since 2017/11/15
 */

import Service from '../service/Login'
import {request, response, loginData} from '../interface/index'
import Redis from '../util/Redis'

export default class Login {
    public service = new Service()
    public client = Redis.client

    constructor() {
    }

    /**
     * @description 检查登录是否成功
     * @param json 登录的信息（账号密码）
     * @param request 请求体
     * @param response 响应体
     * @param next 向下执行方法
     */
    checkLogin(json: loginData, request: request, response: response, next: Function): void {
        this.service.checkLogin(json, res => {
            if (res.status === 606) return response.json(res.data)
            this.client.get(res.role.login_name,  (err, replies) => {
                // 该用户已经之前有人登陆
                if (replies !== null){
                    this.client.del(replies)
                }
                this.client.set(res.role.login_name, res.role.token, 'EX', 3600) // 过期时间单位是秒
                this.client.set(res.role.token, res.role.login_name, 'EX', 3600) // 过期时间单位是秒
                this.client.set('role', JSON.stringify(res.role), 'EX', 3600)
            });
            response.header("token", res.role.token)
            response.json(res.data)
        }, next)
    }

    /**
     * @description 获取菜单
     * @param response 响应体
     * @param next 向下执行方法
     */
    getMenu(response: response, next: Function): void {
        this.service.getMenu(data => {
            response.json(data)
        }, next)
    }
}