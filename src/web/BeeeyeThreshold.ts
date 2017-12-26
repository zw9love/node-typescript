/**
 * @author zengwei
 * @since 2017/12/14
 */
import { postData, response, moduleObj } from '../interface/index'
import { getJson } from '../util/index'
import Service from '../service/BeeeyeThreshold'
export default class BeeeyeThreshold {
    public service = new Service()
    constructor() { }
    /**
     * @description 获取阈值设置项
     * @param postData 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    getData(ids: string, response: response, next: Function): void {
        this.service.getData(ids, res => {
            response.json(getJson('成功', 200, res))
        }, next)
    }
    /**
     * @description 修改阈值设置
     * @param postData 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    upDateData(postData: Array<any>, response: response, next: Function): void {
        this.service.upDateData(postData, ({ affectedRows }) => {
            if (affectedRows === postData.length) return response.json(getJson('成功', 200, null))
            response.json(getJson('修改模块失败', 404, null))
        }, next)
    }
}