/**
 * @author zengwei
 * @since 2018/1/3
 */
import { postData, response, moduleObj } from '../interface/index'
import { getJson } from '../util/index'
import Service from '../service/BeeneedleProtect'
export default class BeeneedleProtect {
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
     * @description 修改数据
     * @param postData 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    upDateData(postData: any, response: response, next: Function): void {
        this.service.upDateData(postData, ({ affectedRows }) => {
            if (affectedRows === postData.length) return response.json(getJson('成功', 200, null))
            response.json(getJson('修改进程保护失败', 404, null))
        }, next)
    }

    /**
    * @description 添加数据
    * @param request 请求体
    * @param response 响应体
    * @param next 向下执行方法
    */
    addData(json: any, response: response, next: Function): void {
        // let json = request.body
        this.service.addData(json, res => {
            if (res.sum === 1) return response.json(getJson('进程名重复了，请更换进程名', 606, null))
            if (res.affectedRows > 0) return response.json(getJson('成功', 200, null))
            response.json(getJson('添加进程保护失败', 606, null))
        }, next)
    }

}