/**
 * @author zengwei
 * @since 2018/1/5
 */
import { postData, request, response, moduleObj } from '../interface/index'
import { getJson } from '../util/index'
import Service from '../service/BeeeyeReport'
export default class BeeeyeReport {
    public service = new Service()
    constructor() { }
    /**
     * @description 获取数据
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
     * @description 添加数据
     * @param data 传递的参数
     * @param response 响应体
     * @param next 向下执行方法
     */
    addData(data: any, response: response, next: Function): void {
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
        this.service.deleteDataById(ids, data => {
            response.json(data)
        }, next)
    }

    /**
     * @description 下载文件
     * @param fileName 文件名字
     * @param response 响应体
     * @param next 向下执行方法
     */
    downFile(fileName: string, response: response, next: Function): void {
        this.service.downFile(fileName, path => {
            response.download(path)
        }, next)
    }

}