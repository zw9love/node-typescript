/**
 * @author zengwei
 * @since 2017/12/15
 */

import { postData, response, request, loginData } from '../interface/index'
import { getJson } from '../util/index'
import Redis from '../util/Redis'
import Service from '../service/BeeneedlePelf'

export default class BeeneedlePelf {
    private service: Service = new Service()
    constructor() { }
    /**
     * @description 获取数据
     * @param postData request.body数据
     * @param response 响应体
     * @param next 向下执行方法
     */
    getData(postData: postData, response: response, next: Function): void {
        this.service.getData(postData, data => {
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
        Redis.client.get("role", (err, res) => {
            let role = JSON.parse(res)
            let username = role.username
            let json = request.body
            this.service.addData(json, username, res => {
                if (res.sum === 1) return response.json(getJson('用户名重复了，请更换用户名', 606, null))
                if (res.affectedRows > 0) return response.json(getJson('成功', 200, null))
                response.json(getJson('添加用户失败', 606, null))
            }, next)
        })
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