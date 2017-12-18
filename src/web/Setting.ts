/**
 * @author zengwei
 * @since 2017/12/12
 */
import { postData, response } from '../interface/index'
import { getJson } from '../util/index'
import Service  from '../service/Setting'
export default class Setting {
    public service = new Service()
    constructor(){}
    /**
     * @description 获取系统设置项
     * @param postData 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    getData(postData: postData, response: response, next: Function): void {
        this.service.getData(postData, res => {
            if (res[0]) return response.send(JSON.stringify(getJson('成功', 200, res[0])));
            response.json(getJson('成功', 200, null))
        },next)
    }
    /**
     * @description 获取管理员登录信息
     * @param postData 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    getLoginInfo(postData: postData, response: response, next: Function): void {
        this.service.getLoginInfo(postData, res => {
            if (res[0]) return response.send(JSON.stringify(getJson('成功', 200, res[0])));
            response.json(getJson('成功', 200, null))
        }, next)
    }
}