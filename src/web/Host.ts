/**
 * @author zengwei
 * @since 2017/11/15
 */

// let service = require('../../service/host/index')
import Service from '../service/Host'
import { postData, response } from '../interface/index'
import { getJson } from '../util/index'


export default class Host {
    public service = new Service()
    constructor() {
    }
    /**
     * @description 获取数据
     * @param host_ids 主机ids
     * @param response 响应体
     * @param next 向下执行方法
     */
    getData(postData: postData, response: response, next: Function): void {
        this.service.getData(postData, data => {
            // console.log(data)
            response.send(JSON.stringify(data));
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
            response.send(JSON.stringify(data));
        }, next)
    }

    /**
     * @description 根据主机ids删除数据
     * @param host_ids 主机ids
     * @param response 响应体
     * @param next 向下执行方法
     */
    deleteDataById(host_ids: string, response: response, next: Function): void {
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
    deleteDataBatch(idsArr: Array<string>, response: response, next: Function): void {
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
    upDateData(json: object, response: response, next: Function): void {
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
    addData(json: object, response: response, next: Function): void {
        this.service.addData(json, data => {
            response.send(JSON.stringify(data));
        }, next)
    }

    /**
     * @description 获取操作系统数据
     * @param data web层传递数据
     * @param response 响应体
     * @param next 向下执行方法
     */
    getSystems(data: object, response: response, next: Function): void {
        this.service.getSystems(data, res => {
            response.send(JSON.stringify(getJson('成功', 200, res)))
        }, next)
    }

}