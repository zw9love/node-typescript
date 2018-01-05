/**
 * @author zengwei
 * @since 2018/1/5
 */
import { postData, response, moduleObj } from '../interface/index'
import { getJson } from '../util/index'
import Service from '../service/BeeneedleStoragespace'
export default class BeeneedleStoragespace {
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
      * @description 修改
      * @param postData 传递的参数
      * @param response 响应体
      * @param next 向下执行方法
      */
    upDateData(postData: Array<any>, response: response, next: Function): void {
        this.service.upDateData(postData, ({affectedRows}) => {
            if (affectedRows === postData.length) return response.json(getJson('成功', 200, null))
            response.json(getJson('修改失败', 404, null))
        }, next)
    }

    /**
     * @description 手动检测存储空间
     * @param response 响应体
     * @param next 向下执行方法
     */
    manualCheckSpace(response: response, next: Function): void {
        this.service.manualCheckSpace(res => {
            response.json(res)
        }, next)
    }

}