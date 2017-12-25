/**
 * @author zengwei
 * @since 2017/12/14
 */
import Dao from '../dao/index'
import { autoGetData } from '../filters/index'
import { getJson } from '../util/index'
import { postData, moduleObj } from '../interface/index'

export default class BeeneedleModule {
    public dao = new Dao()
    private tableName: string = 'beeneedle_module'
    constructor() { }
    /**
     * @description 操作dao对象拿到setting数据
     * @param data web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    getData(ids: string, successFn?: Function, errorFn?: Function): void {
        let select = `SELECT * FROM ${this.tableName} where host_ids = ?`
        this.dao.connectDatabase(select, ids, res => {
            if (successFn) successFn(res)
        }, errorFn)
    }

    /**
     * @description 操作dao对象拿到管理员登录信息
     * @param data  web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    upDateData(data: Array<moduleObj>, successFn?: Function, errorFn?: Function): void {
        let update = `UPDATE ${this.tableName} `
        let where = ` WHERE ids IN (`
        let type = 'SET type = CASE ids '
        let status = 'status = CASE ids '
        let hostIdsArr = []
        data.forEach((o, i) => {
            let typeSql = i === data.length - 1 ? `WHEN '${o.ids}' THEN ${o.type} END,` : `WHEN '${o.ids}' THEN ${o.type} `
            type += typeSql
            let statusSql = i === data.length - 1 ? `WHEN '${o.ids}' THEN ${o.status} END` : `WHEN '${o.ids}' THEN ${o.status} `
            status += statusSql
            let whereSql = i === data.length - 1 ? `?)` : `?,`
            where += whereSql
            hostIdsArr.push(o.ids)
        })
        let sql = update + type + status + where
        // console.log(sql)
        // console.log(hostIdsArr)
        this.dao.connectDatabase(sql, hostIdsArr, res => {
            // console.log(res)
            if (successFn) successFn(res)
        }, errorFn)
    }

}