/**
 * @author zengwei
 * @since 2017/12/14
 */
import Dao from '../dao/index'
import { autoGetData } from '../filters/index'
import { getJson, beginTransaction } from '../util/index'
import { postData, moduleObj } from '../interface/index'

export default class BeeneedlePolicyLoadAudit {
    public dao = new Dao()
    public tableName: string = 'beeneedle_global_audit'
    constructor() { }
    /**
     * @description 操作dao对象拿到数据
     * @param data web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    getData(postData: postData, successFn?: Function, errorFn?: Function): void {
        let select = `SELECT * FROM ${this.tableName}`
        let hostIds = postData.row.host_ids
        let where = ' where host_ids = ? '
        beginTransaction({ self: this, successFn, errorFn, postData, dataArr: [hostIds], where })
        // this.dao.connectDatabase(select, ids, res => {
        //     if (successFn) successFn(res)
        // }, errorFn)
    }

    /**
     * @description 操作dao对象更新信息
     * @param data  web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    upDateDataBatch(data: Array<any>, successFn?: Function, errorFn?: Function): void {
        let resVal = data[0].result
        let update = `UPDATE ${this.tableName} `
        let where = ` WHERE ids IN ( `
        // let type = 'SET type = CASE ids '
        let result = ' set result = CASE ids '
        let hostIdsArr = []
        data.forEach((o, i) => {
            // let typeSql = i === data.length - 1 ? `WHEN '${o.ids}' THEN ${o.type} END,` : `WHEN '${o.ids}' THEN ${o.type} `
            // type += typeSql
            let resultSql = i === data.length - 1 ? `WHEN '${o.ids}' THEN ${resVal} END` : `WHEN '${o.ids}' THEN ${resVal} `
            result += resultSql
            let whereSql = i === data.length - 1 ? `?)` : `?,`
            where += whereSql
            hostIdsArr.push(o.ids)
        })
        let sql = update + result + where
        // console.log(sql)
        // console.log(hostIdsArr)
        this.dao.connectDatabase(sql, hostIdsArr, res => {
            if (successFn) successFn(res)
        }, errorFn)
    }

    /**
     * @description 操作dao对象更新信息
     * @param ids  web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    upDateDataById(json: any, successFn?: Function, errorFn?: Function): void {
        let update = ` UPDATE ${this.tableName} set result = ? `
        let where = ` WHERE ids = ? `
        let hostIdsArr = [json.result, json.ids]
        let sql = update + where
        this.dao.connectDatabase(sql, hostIdsArr, res => {
            if (successFn) successFn(res)
        }, errorFn)
    }

}