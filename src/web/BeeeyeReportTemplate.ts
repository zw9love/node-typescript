/**
 * @author zengwei
 * @since 2017/12/14
 */
import { postData, response, moduleObj } from '../interface/index'
import { getJson } from '../util/index'
import Service from '../service/BeeeyeReportTemplate'
export default class BeeeyeReportTemplate {
    public service = new Service()
    constructor() { }
    /**
     * @description 获取数据
     * @param postData 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    getData(postData: postData, response: response, next: Function): void {
        let host_ids = postData.row.host_ids
        this.service.getData(host_ids, res => {
            response.json(getJson('成功', 200, res))
        }, next)
    }
    /**
     * @description 修改数据
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