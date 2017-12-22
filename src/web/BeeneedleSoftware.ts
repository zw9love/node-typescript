/**
 * @author zengwei
 * @since 2017/12/14
 */
import { postData, response, moduleObj, request } from '../interface/index'
import { getJson } from '../util/index'
import Service from '../service/BeeneedleSoftware'
export default class Setting {
    public service = new Service()
    constructor() { }
    /**
     * @description 获取进程主体列表
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
        this.service.upDateData(postData, ({ affectedRows }) => {
            if (affectedRows === postData.length) return response.json(getJson('成功', 200, null))
            response.json(getJson('修改模块失败', 404, null))
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
        let file = request.files.file
        console.log(file)
        this.service.addData(json, res => {
            response.json(getJson('成功', 200, null))
        }, next)
    }

}