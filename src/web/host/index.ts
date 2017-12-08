/**
 * @author zengwei
 * @since 2017/11/15
 */

// let service = require('../../service/host/index')
import Service from '../../service/host/index'
import { postData } from '../../interface/index'
import Role from '../../util/role'
import { getJson } from '../../util/index'

interface response {
    send:Function
}

export default class Host {
    public service = new Service()
    constructor() { }
    /**
     * @description 获取数据
     * @param host_ids 主机ids
     * @param response 响应体
     * @param next 向下执行方法
     */
    getData(token:string, postData: postData, response: response, next: Function): void{
        if (!Role.checkToken(token)) return response.send(JSON.stringify(getJson('用户登录失效', 611)));
        this.service.getData(postData, data => {
            response.send(JSON.stringify(data));
        }, next)
    }
    /**
     * @description 根据主机ids删除数据
     * @param host_ids 主机ids
     * @param response 响应体
     * @param next 向下执行方法
     */
    deleteDataById(token: string, host_ids: string, response: response, next: Function): void {
        if (!Role.checkToken(token)) return response.send(JSON.stringify(getJson('用户登录失效', 611)));
        this.service.deleteData(host_ids, data => {
            response.send(JSON.stringify(data));
        }, next)
    }
    /**
     * @description 批量删除主机
     * @param idsArr 主机ids数组
     * @param response 响应体
     * @param next 向下执行方法
     */
    deleteDataBatch(token: string, idsArr: Array<string>, response: response, next: Function): void{
        if (!Role.checkToken(token)) return response.send(JSON.stringify(getJson('用户登录失效', 611)));
        this.service.deleteData(idsArr, data => {
            response.send(JSON.stringify(data));
        }, next)
    }
    /**
     * @description 更新数据
     * @param json 更新的json
     * @param response 响应体
     * @param next 向下执行方法
     */
    upDateData(token: string, json, response: response, next: Function) :void{
        if (!Role.checkToken(token)) return response.send(JSON.stringify(getJson('用户登录失效', 611)));
        this.service.upDateData(json, data => {
            response.send(JSON.stringify(data));
        }, next)
    }
    /**
     * @description 添加数据
     * @param json 添加的json
     * @param response 响应体
     * @param next 向下执行方法
     */
    addData(token: string, json, response: response, next: Function): void {
        if (!Role.checkToken(token)) return response.send(JSON.stringify(getJson('用户登录失效', 611)));
        this.service.addData(json, data => {
            response.send(JSON.stringify(data));
        }, next)
    }

}