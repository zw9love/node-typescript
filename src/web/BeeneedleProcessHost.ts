/**
 * @author zengwei
 * @since 2017/12/14
 */
import { postData, response, moduleObj } from '../interface/index'
import { getJson } from '../util/index'
import Service from '../service/BeeneedleProcessHost'
export default class Setting {
    public service = new Service()
    constructor() { }
    /**
     * @description 获取数据
     * @param postData 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    getData(postData: postData, response: response, next: Function): void {
        let process_ids = postData.row.process_ids
        this.service.getData(process_ids, res => {
            response.json(getJson('成功', 200, res))
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
            response.json(getJson('成功', 200, null))
        }, next)
    }
}