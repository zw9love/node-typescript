/**
 * @author zengwei
 * @since 2017/12/14
 */
import Dao from '../dao/index'
import { autoGetData } from '../filters/index'
import { getJson, getRandomString, beginTransaction } from '../util/index'
import { postData, moduleObj } from '../interface/index'

export default class Setting {
    public dao = new Dao()
    private tableName: string = 'beeneedle_mac'
    constructor() { }
    /**
     * @description 操作dao对象拿到setting数据
     * @param postData web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    getData(postData: postData, successFn?: Function, errorFn?: Function): void {
        let { row, size, page, query, sort } = postData
        let type = row.type
        let labelType = row.labelType
        let hostIds = row.host_ids || row.hostIds
        let where = ` where type = ? and host_ids = ? `
        beginTransaction({ self: this, successFn, errorFn, postData, dataArr: [type, hostIds], where })
    }

    /**
     * @description 通过ids来获取单个数据
     * @param ids ids
     * @param successFn 成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    getDataById(ids: string, successFn?: Function, errorFn?: Function): void {
        let select = `SELECT * FROM ${this.tableName} `
        let where = `where ids = ? `
        let sql = select + where
        this.dao.connectDatabase(sql, ids, res => {
            let json = getJson('成功', 200, res[0])
            if (successFn) successFn(json)
        }, errorFn)
    }

    /**
     * @description 删除 / 批量删除
     * @param idsArr  sql语句参数
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */

    deleteData(idsArr: string | Array<string>, successFn?: Function, errorFn?: Function): void {
        let sql = idsArr.length >= 0 ? `DELETE FROM ${this.tableName} where ids in (?)` : `DELETE FROM ${this.tableName} where ids = ?`;
        // 开启事务方法 删除主机的同时，删除主机模块数据
        this.dao.connectDatabase(sql, idsArr, res => {
            let affectedRows = res.affectedRows
            let json = affectedRows > 0 ? getJson('删除成功', 200) : getJson('删除失败', 606)
            if (successFn) successFn(json)
        }, errorFn)
    }


    /**
     * @description 修改
     * @param data  web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    upDateData(json: any, successFn?: Function, errorFn?: Function): void {
        let sql = `UPDATE ${this.tableName} SET name = ?, path = ?, type = ?,sens_value = ?,reli_value = ? where ids = ?`;
        let arr = [json.name, json.path, json.type, json.sens_value, json.reli_value, json.ids]
        this.dao.connectDatabase(sql, arr, ({ affectedRows }) => {
            let json = affectedRows > 0 ? getJson('修改成功', 200) : getJson('修改失败', 404)
            if (successFn) successFn(json)
        }, errorFn)
    }

    /**
    * @description 增加
    * @param json  sql语句参数
    * @param successFn  成功执行的回调函数
    * @param errorFn 失败执行的回调函数
    */

    addData(json: any, successFn?: Function, errorFn?: Function): void {
        let sql = `INSERT INTO ${this.tableName} (ids, group_name, version, platform_ids) VALUES ( ?, ?, ?, ?) `
        let ids = getRandomString()
        let arr = [ids, json.group_name, json.version, json.platform_ids]
        this.dao.connectDatabase(sql, arr, res => {
            if (successFn) successFn(res)
        })
    }
}