/**
 * @author zengwei
 * @since 2017/12/12
 */
import Dao from '../dao/index'
import { autoGetData } from '../filters/index'
import { getJson } from '../util/index'
import { postData } from '../interface/index'
export default class Setting {
    public dao = new Dao()
    private tableName: string = 'common_setting'
    constructor() { }
    /**
     * @description 操作dao对象拿到setting数据
     * @param data web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    getData(data: postData, successFn?: Function, errorFn?: Function): void {
        let select = `SELECT * FROM ${this.tableName} `
        this.dao.connectDatabase(select, null, res => {
            if (successFn) successFn(res)
        }, errorFn)
    }

    /**
     * @description 操作dao对象拿到管理员登录信息
     * @param data  web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    getLoginInfo(data: postData, successFn?: Function, errorFn?: Function): void {
        let select = `SELECT cycle FROM ${this.tableName} `
        this.dao.connectDatabase(select, null, res => {
            if (successFn) successFn(res)
        }, errorFn)
    }

}