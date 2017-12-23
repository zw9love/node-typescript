 /**
 * @author zengwei
 * @since 2017/12/14
 */
import { postData, response, moduleObj } from '../interface/index'
import { getJson } from '../util/index'
import Service from '../service/BeeeyeSafeLib'
export default class BeeeyeSafeLib {
    public service = new Service()
    constructor() { }
    /**
     * @description 获取windows安全库列表
     * @param postData 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    getWindowsData(postData: postData, response: response, next: Function): void {
        let tableName = 'beeeye_baseline_win'
        this.service.setTableName(tableName)
        this.service.getData(postData, res => {
            response.json(res)
        }, next)
    }

    /**
     * @description 获取linux安全库列表
     * @param postData 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    getLinuxData(postData: postData, response: response, next: Function): void {
        let tableName = 'beeeye_baseline_linux'
        this.service.setTableName(tableName)
        this.service.getData(postData, res => {
            response.json(res)
        }, next)
    }

    /**
     * @description 修改windows设置
     * @param postData 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    upDateWindowsDataBatch(postData: Array<any>, response: response, next: Function): void {
        let tableName = 'beeeye_baseline_win'
        this.service.setTableName(tableName)
        this.service.upDateDataBatch(postData, ({ affectedRows}) => {
            if (affectedRows === postData.length) return response.json(getJson('成功', 200, null))
            response.json(getJson('修改失败', 404, null))
        }, next)
    }

    /**
     * @description 修改Linux设置
     * @param postData 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    upDateLinuxDataBatch(postData: Array<any>, response: response, next: Function): void {
        let tableName = 'beeeye_baseline_linux'
        this.service.setTableName(tableName)
        this.service.upDateDataBatch(postData, ({ affectedRows}) => {
            if (affectedRows === postData.length) return response.json(getJson('成功', 200, null))
            response.json(getJson('修改失败', 404, null))
        }, next)
    }


    /**
     * @description 修改windows单个设置
     * @param postData 请求体body对象
     * @param response 响应体
     * @param next 向下执行方法
     */
    upDateWindowsDataById(postData: postData, response: response, next: Function): void {
        let tableName = 'beeeye_baseline_win'
        this.service.setTableName(tableName)
        this.service.upDateDataById(postData, ({ affectedRows}) => {
            if (affectedRows === 1) return response.json(getJson('成功', 200, null))
            response.json(getJson('修改失败', 606, null))
        }, next)
    }

    /**
     * @description 修改Linux单个设置
     * @param postData 请求体body对象
     * @param response 响应体
     * @param next 向下执行方法
     */
    upDateLinuxDataById(postData: postData, response: response, next: Function): void {
        let tableName = 'beeeye_baseline_linux'
        this.service.setTableName(tableName)
        this.service.upDateDataById(postData, ({ affectedRows}) => {
            if (affectedRows === 1) return response.json(getJson('成功', 200, null))
            response.json(getJson('修改失败', 606, null))
        }, next)
    }
}