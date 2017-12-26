/**
 * @author zengwei
 * @since 2017/12/14
 */
import { postData, response, moduleObj } from '../interface/index'
import { getJson } from '../util/index'
import Service from '../service/BeeeyeAuditOut'
export default class BeeeyeAuditOut {
    public service = new Service()
    constructor() { }
    /**
     * @description 获取数据
     * @param postData 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    getData(postData: postData, response: response, next: Function): void {
        let ids = postData.userIds
        this.service.getData(ids, res => {
            response.json(getJson('成功', 200, res))
        }, next)
    }

    /**
     * @description 添加数据
     * @param data 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    addData(data:any, response: response, next: Function):void{
        this.service.addData(data, res => {
            response.json(getJson('成功', 200, res))
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