/**
 * @author zengwei
 * @since 2017/11/15
 */

/*
    module.exports 初始值为一个空对象 {}，所以 exports 初始值也是 {}
    exports 是指向的 module.exports 的引用
    require() 返回的是 module.exports 而不是 exports
*/
import Dao from '../../dao/index'

// 1、
import {autoGetData} from '../../filters/index'
import {getJson, beginTransaction, checkPage} from '../../util/index'
import {postData} from '../../interface/index'

// 2、
// let { autoGetData } = require('../../filters/index')
// let { getJson } = require('../../util/index')

// 3、
// import util from '../../util/index'
// let { getJson} = util

/**
 * @description sql参数格式体
 */
interface json {
    name?: string
    ip?: string
    port?: string
    login_name?: string
    login_pwd?: string
    host_ids?: string
    os_type?: string
    os_version?: string
    os_arch?: string
}

export default class Service {
    public dao = new Dao()
    private tableName: string = 'beeeye_host'

    constructor() {
    }

    /**
     * @description 查询全部
     * @param data  sql语句参数
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    getData(data: postData, successFn?: Function, errorFn?: Function): void {
        let {page, row, size} = data
        let select = `SELECT * FROM ${this.tableName} `
        let count = `SELECT count(*) as sum FROM ${this.tableName} `
        let where = ''
        let limit = ''
        // 分页存在
        if (page) {
            checkPage({row, where, page, limit})
        }
        else if (size) {

        }
        // 如果分页不存在

        let tsData = [
            {sql: count + where, dataArr: null},
            {sql: select + where + limit, dataArr: null},
        ]

        // 开始事务（事务是必须走的，因为查询记录总数和拿到数据是两条sql语句才能解决）
        this.dao.connectTransaction(tsData, (connection, res) => {
            beginTransaction({connection, res, page: page ? page : {}, successFn, dao: this.dao})
        }, errorFn)
    }

    /**
     * @description 删除 / 批量删除
     * @param idsArr  sql语句参数
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */

    deleteData(idsArr: string | Array<string>, successFn?: Function, errorFn?: Function): void {
        let sql = idsArr.length >= 0 ? `DELETE FROM ${this.tableName} where host_ids in (?)` : `DELETE FROM ${this.tableName} where host_ids = ?`;
        this.dao.connectDatabase(sql, idsArr, ({affectedRows}) => {
            let json
            if (affectedRows > 0) {
                json = getJson('删除成功', 200)
            } else {
                json = getJson('删除失败', 404)
            }
            if (successFn) {
                successFn(json)
            }
        }, errorFn)
    }

    /**
     * @description 更新
     * @param json  sql语句参数
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */

    upDateData(json: json, successFn?: Function, errorFn?: Function): void {
        let sql = `UPDATE ${this.tableName} SET name = ?, ip = ?, port = ?,login_name = ?,login_pwd = ? where host_ids = ?`;
        let arr = [json.name, json.ip, json.port, json.login_name, json.login_pwd, json.host_ids]
        this.dao.connectDatabase(sql, json, ({affectedRows}) => {
            let json
            if (affectedRows > 0) {
                json = getJson('修改成功', 200)
            } else {
                json = getJson('修改失败', 404)
            }
            if (successFn) {
                successFn(json)
            }
        }, errorFn)
    }

    /**
     * @description 增加
     * @param json  sql语句参数
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */

    addData(json: json, successFn?: Function, errorFn?: Function): void {
        let sql = `INSERT INTO ${this.tableName} (host_ids, name, ip, port, os_type, os_version, os_arch, login_name, login_pwd) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let arr = [json.host_ids, autoGetData(json.name), autoGetData(json.ip), autoGetData(json.port), autoGetData(json.os_type), autoGetData(json.os_version), autoGetData(json.os_arch), autoGetData(json.login_name), autoGetData(json.login_pwd)]
        this.dao.connectDatabase(sql, json, ({affectedRows}) => {
            let json
            if (affectedRows > 0) {
                json = getJson('添加成功', 200)
            } else {
                json = getJson('添加失败', 404)
            }
            if (successFn) {
                successFn(json)
            }
        }, errorFn)
    }
}