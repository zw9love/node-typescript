/**
 * @author zengwei
 * @since 2018/1/4
 */
import { postData, response, moduleObj } from '../interface/index'
import { getJson } from '../util/index'
import Service from '../service/BeeneedleProtectFilePropAudit'
export default class BeeneedleProtectFilePropAudit {
    public service = new Service()
    constructor() { }
    /**
     * @description 获取列表
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
     * @description 根据ids集合删除数据
     * @param ids 记录ids
     * @param response 响应体
     * @param next 向下执行方法
     */
    deleteDataBatch(idsArr: Array<string>, response: response, next: Function): void {
        this.service.deleteDataBatch(idsArr, data => {
            response.json(data)
        }, next)
    }

}