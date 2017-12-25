/**
 * @author zengwei
 * @since 2017/12/14
 */
import { postData, response, moduleObj, request } from '../interface/index'
import { getJson } from '../util/index'
import Service from '../service/BeeneedleMac'
export default class BeeneedleMac {
    public service = new Service()
    constructor() { }
    /**
     * @description 获取数据列表
     * @param postData 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    getData(postData: postData, response: response, next: Function): void {
        this.service.getData(postData, res => {
            response.json(res)
        }, next)
    }

    /**
     * @description 通过ids来获取单个数据
     * @param ids ids
     * @param response 响应体
     * @param next 向下执行方法
     */
    getDataById(ids: string, response: response, next: Function): void {
        this.service.getDataById(ids, data => {
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

    /**
     * @description 修改
     * @param postData 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    upDateData(postData: any, response: response, next: Function): void {
        this.service.upDateData(postData, res => {
            response.json(res)
        }, next)
    }

    /**
    * @description 添加数据
    * @param request 请求体
    * @param response 响应体
    * @param next 向下执行方法
    */
    addData(json:any, response: response, next: Function): void {
        this.service.addData(json, res => {
            response.json(getJson('成功', 200, null))
        }, next)
    }

}