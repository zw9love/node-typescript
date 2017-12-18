/**
 * @author zengwei
 * @since 2017/12/15
 */

import { postData, response, request, loginData } from '../interface/index'
import { getJson } from '../util/index'
import Service from '../service/User'

export default class User {
    private service: Service = new Service()
    constructor() { }
    /**
     * @description 获取数据
     * @param host_ids 主机ids
     * @param response 响应体
     * @param next 向下执行方法
     */
    getData(request: request, response: response, next: Function): void {
        this.service.getData(request, data => {
            response.json(data)
        }, next)
    }


    /**
     * @description 通过ids来获取单个主机
     * @param hostIds 主机ids
     * @param response 响应体
     * @param next 向下执行方法
     */
    getDataById(hostIds: string, response: response, next: Function): void {
        this.service.getDataById(hostIds, data => {
            response.json(data)
        }, next)
    }

    /**
    * @description 添加数据
    * @param request 请求体
    * @param response 响应体
    * @param next 向下执行方法
    */
    addData(request: request, response: response, next: Function): void {
        let json = request.body
        let username = request.session.role.username
        this.service.addData(json, username, res => {
            if (res.sum === 1) return response.json(getJson('用户名重复了，请更换用户名', 606, null))
            if (res.affectedRows > 0) return response.json(getJson('成功', 200, null))
            response.json(getJson('添加用户失败', 606, null))
        }, next)
    }

    /**
     * @description 更新数据
     * @param json 更新的json
     * @param response 响应体
     * @param next 向下执行方法
     */
    upDateData(json: any, response: response, next: Function): void {
        this.service.upDateData(json, data => {
            response.json(data)
        }, next)
    }

    /**
     * @description 根据ids删除数据
     * @param ids 记录ids
     * @param response 响应体
     * @param next 向下执行方法
     */
    deleteDataById(ids: string, response: response, next: Function): void {
        this.service.deleteData(ids, data => {
            response.json(data)
        }, next)
    }
}