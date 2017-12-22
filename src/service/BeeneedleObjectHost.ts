/**
 * @author zengwei
 * @since 2017/12/14
 */
import Dao from '../dao/index'
import { autoGetData } from '../filters/index'
import { getJson, getRandomString } from '../util/index'
import { postData, moduleObj } from '../interface/index'

export default class Setting {
    public dao = new Dao()
    private tableName: string = 'beeneedle_object_host'
    constructor() { }
    /**
     * @description 获取数据
     * @param process_ids ids
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    getData(object_ids: string, successFn?: Function, errorFn?: Function): void {
        let select = `SELECT * FROM beeeye_host where host_ids in (SELECT host_ids FROM ${this.tableName} where object_ids = ?)`
        let selectHost = `SELECT * FROM beeeye_host`
        this.dao.connectDatabase(select, object_ids, res1 => {
            this.dao.connectDatabase(selectHost, null, res2 => {
                let list = {
                    associated: res1,
                    conform: res2
                }
                if (successFn) successFn(list)
            }, errorFn)
        }, errorFn)
    }

    /**
     * @description 修改数据(先删后加)
     * @param data  web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    upDateData(data: any, successFn?: Function, errorFn?: Function): void {
        let object_ids = data.object_ids
        let hostIdsArr = data.host_ids
        let deletes = ` DELETE FROM ${this.tableName}`
        let where = ` WHERE object_ids = ? `
        let deleteSql = deletes + where
        this.dao.connectDatabase(deleteSql, object_ids, res => {
            if (hostIdsArr.length === 0) {
                if (successFn) successFn(res)
                return
            }
            let insertSql = `INSERT INTO ${this.tableName} (ids, object_ids, host_ids) VALUES `
            for (let i = 0; i < hostIdsArr.length; i++) {
                let str = i == hostIdsArr.length - 1 ? ` ('${getRandomString()}', '${object_ids}','${hostIdsArr[i]}') ` : ` ('${getRandomString()}','${object_ids}','${hostIdsArr[i]}'), `
                insertSql += str
            }
            this.dao.connectDatabase(insertSql, null, data => {
                if (successFn) successFn(data)
            }, errorFn)
        }, errorFn)
    }

}