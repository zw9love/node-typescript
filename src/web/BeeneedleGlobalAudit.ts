 /**
 * @author zengwei
 * @since 2017/12/14
 */
import { postData, response, moduleObj } from '../interface/index'
import { getJson } from '../util/index'
import Service from '../service/BeeneedleGlobalAudit'
export default class BeeneedlePolicyLoadAudit {
    public service = new Service()
    constructor() { }
    /**
     * @description 获取策略加载列表
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
     * @description 修改策略加载设置
     * @param postData 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    upDateDataBatch(postData: Array<any>, response: response, next: Function): void {
        this.service.upDateDataBatch(postData, ({ affectedRows}) => {
            if (affectedRows === postData.length) return response.json(getJson('成功', 200, null))
            response.json(getJson('修改失败', 404, null))
        }, next)
    }

    /**
     * @description 修改策略加载单个设置
     * @param postData 请求体body对象
     * @param response 响应体
     * @param next 向下执行方法
     */
    upDateDataById(postData: postData, response: response, next: Function): void {
        this.service.upDateDataById(postData, ({ affectedRows}) => {
            if (affectedRows === 1) return response.json(getJson('成功', 200, null))
            response.json(getJson('修改失败', 606, null))
        }, next)
    }
}