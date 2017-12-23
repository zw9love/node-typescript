/**
 * @author zengwei
 * @since 2017/12/14
 */
import { postData, response, moduleObj, request } from '../interface/index'
import { getJson } from '../util/index'
import Service from '../service/BeeneedleComplete'
export default class Setting {
    public service = new Service()
    constructor() { }
    /**
     * @description 获取进程主体列表
     * @param postData 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    getData(request: request, response: response, next: Function): void {
        let postData = {type: ~~request.params.type, ...request.body}
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
        this.service.upDateData(postData, ({ affectedRows }) => {
            if (affectedRows === postData.length) return response.json(getJson('成功', 200, null))
            response.json(getJson('修改模块失败', 404, null))
        }, next)
    }

    /**
    * @description 添加数据
    * @param json post数据
    * @param response 响应体
    * @param next 向下执行方法
    */
    addData(json: any, response: response, next: Function): void {
        this.service.addData(json, res => {
            response.json(getJson('成功', 200, null))
        }, next)
    }

  /**
    * @description 检查完整性
    * @param json post数据
    * @param response 响应体
    * @param next 向下执行方法
    */
    check(json: any, response: response, next: Function): void {
        this.service.check(json, res => {
            response.json(res)
        }, next)
    }
}