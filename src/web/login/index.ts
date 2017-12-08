/**
 * @author zengwei
 * @since 2017/11/15
 */

import Service from '../../service/login/index'
import Role from '../../util/role'
import { getJson} from '../../util/index'

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
                new Role() // 登录成功才生成Role对象
                response.header("token", Role.token)
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
        if (!Role.checkToken(token)) return response.send(JSON.stringify(getJson('用户登录失效', 611)));
        this.service.checkRole(token, data => {
            response.send(JSON.stringify(data));
        }, next)
    }

    /**
     * @description 获取菜单
     * @param token 每次http请求的token值
     * @param response 响应体
     * @param next 向下执行方法
     */
    getMenu(token: string, response: response, next: Function): void {
        if (!Role.checkToken(token)) return response.send(JSON.stringify(getJson('用户登录失效', 611)));
        this.service.getMenu(data => {
            response.send(JSON.stringify(data));
        }, next)
    }
}