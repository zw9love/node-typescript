/**
 * @author zengwei
 * @since 2017/12/14
 */
import Dao from '../dao/index'
import { autoGetData } from '../filters/index'
import { getJson } from '../util/index'
import { postData, moduleObj } from '../interface/index'

export default class BeeeyeReportTemplate {
    public dao = new Dao()
    private tableName: string = 'beeeye_report_template'
    constructor() { }
    /**
     * @description 操作dao对象拿到数据
     * @param data web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    getData(ids: string, successFn?: Function, errorFn?: Function): void {
        let select = `SELECT * FROM ${this.tableName}`
        this.dao.connectDatabase(select, ids, res => {
            res.forEach( o => {
                o.flag = o.flag === 1 ? true : false
            })
            if (successFn) successFn(res)
        }, errorFn)
    }

    /**
     * @description 操作dao对象修改数据
     * @param data  web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    upDateData(data: Array<any>, successFn?: Function, errorFn?: Function): void {
        let update = `UPDATE ${this.tableName} `
        let where = ` WHERE ids IN (`
        let flag = 'SET flag = CASE ids '
        let hostIdsArr = []
        data.forEach((o, i) => {
            let flagVal = o.flag === true ? 1 : 0
            let flagSql = i === data.length - 1 ? `WHEN '${o.ids}' THEN ${flagVal} END` : `WHEN '${o.ids}' THEN ${flagVal} `
            flag += flagSql
            let whereSql = i === data.length - 1 ? `?)` : `?,`
            where += whereSql
            hostIdsArr.push(o.ids)
        })
        let sql = update + flag + where
        // console.log(sql)
        // console.log(hostIdsArr)
        this.dao.connectDatabase(sql, hostIdsArr, res => {
            // console.log(res)
            if (successFn) successFn(res)
        }, errorFn)
    }

}