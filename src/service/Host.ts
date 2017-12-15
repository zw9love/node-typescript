/**
 * @author zengwei
 * @since 2017/11/15
 */

/*
    module.exports 初始值为一个空对象 {}，所以 exports 初始值也是 {}
    exports 是指向的 module.exports 的引用
    require() 返回的是 module.exports 而不是 exports
*/
import Dao from '../dao/index'
// 1、
import { autoGetData } from '../filters/index'
import { getJson, beginTransaction, checkPage, getRandomString, aesEncrypt } from '../util/index'
import { postData } from '../interface/index'
import os = require('os')
import fs = require('fs')
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
        let { page, row, size } = data
        let select = `SELECT * FROM ${this.tableName} `
        let count = `SELECT count(*) as sum FROM ${this.tableName} `
        let where = ''
        let limit = ''
        // 分页存在
        if (page) {
            checkPage({ row, where, page, limit })
        }
        else if (size) {

        }
        // 如果分页不存在

        let tsData = [
            { sql: count + where, dataArr: null },
            { sql: select + where + limit, dataArr: null },
        ]

        // 开始事务（事务是必须走的，因为查询记录总数和拿到数据是两条sql语句才能解决）
        this.dao.connectTransaction(tsData, (connection, res) => {
            beginTransaction({ connection, res, page: page ? page : {}, successFn, dao: this.dao })
        }, errorFn)
    }

    /**
     * @description 通过ids来获取单个主机
     * @param hostIds 主机ids
     * @param successFn 成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    getDataById(hostIds: string, successFn?: Function, errorFn?: Function): void {
        let select = `SELECT * FROM ${this.tableName} `
        let where = `where host_ids = ? `
        let sql = select + where
        this.dao.connectDatabase(sql, hostIds, res => {
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
        let sql = idsArr.length >= 0 ? `DELETE FROM ${this.tableName} where host_ids in (?)` : `DELETE FROM ${this.tableName} where host_ids = ?`;
        let moduleSql = 'DELETE FROM beeneedle_module where host_ids = ?'

        let taskArr = [
            { sql: sql, dataArr: idsArr },
            { sql: moduleSql, dataArr: idsArr },
        ]
        // 开启事务方法 删除主机的同时，删除主机模块数据
        this.dao.connectTransaction(taskArr, (connection, res) => {
            let affectedRows = res[0].affectedRows
            let json = affectedRows > 0 ? getJson('删除成功', 200) : getJson('删除失败', 404)
            if (successFn) successFn(json)
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
        let arr = [json.name, json.ip, json.port, json.login_name, aesEncrypt(json.login_pwd), json.host_ids]
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

    addData(json: json, successFn?: Function, errorFn?: Function): void {
        let sql = `INSERT INTO ${this.tableName} (host_ids, name, ip, port, os_type, os_version, os_arch, login_name, login_pwd, status) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let host_ids = getRandomString()
        let arr = [host_ids, autoGetData(json.name), autoGetData(json.ip), autoGetData(json.port), autoGetData(json.os_type), autoGetData(json.os_version), autoGetData(json.os_arch), autoGetData(json.login_name), aesEncrypt(json.login_pwd), 1]
        // console.log(sql)
        let moduleSql = `INSERT INTO beeneedle_module (ids, host_ids, type, status) VALUES `
        for (let i = 0; i <= 6; i++) {
            let str = i == 6 ? `('${getRandomString()}', '${host_ids}', ${i}, 0)` : `('${getRandomString()}', '${host_ids}', ${i}, 0),`
            moduleSql += str
        }
        let taskArr = [
            { sql: sql, dataArr: arr },
            { sql: moduleSql, dataArr: null },
        ]
        // 开启事务方法 添加主机的同时初始化主机模块数据
        this.dao.connectTransaction(taskArr, (connection, res) => {
            let affectedRows = res[0].affectedRows
            let json = affectedRows > 0 ? getJson('添加成功', 200) : getJson('添加失败', 404)
            if (successFn) successFn(json)
        }, errorFn)
    }

    /**
     * @description 处理数据，本类私有方法
     * @param fileData 读取文件夹系统数组
     */
    private handleData(fileData: Array<string>): object {
        let postData = [
            { name: 'linux', version: [] },
            { name: 'windows', version: [] },
        ]
        fileData.forEach(o => {
            let arr = o.split('-').slice(1)
            postData.forEach(e => {
                if (arr[0] === e.name) {
                    if (e.version.length === 0) {
                        let obj = {
                            value: arr[1],
                            arch: [arr[2]]
                        }
                        e.version.push(obj)
                    } else {
                        let flag = true
                        for (let val of e.version) {
                            if (arr[1] === val.value) {
                                val.arch.push(arr[2])
                                flag = false
                            }
                        }

                        if (flag) {
                            let obj = {
                                value: arr[1],
                                arch: [arr[2]]
                            }
                            e.version.push(obj)
                        }
                    }
                }
            })
        })
        return postData
    }

    /**
     * @description 获取操作系统数据
     * @param json  sql语句参数
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    getSystems(data: object, successFn?: Function, errorFn?: Function): void {
        // 根据操作系统的不同拿到不同的路径
        let path = os.platform().toLowerCase().search('win') === -1 ? '/usr/local/share/lpdata/client/' : 'C:/systems'
        fs.readdir(path, (err, data) => {
            if (err) return console.error(err);
            // console.log("异步读取: " + data.toString());
            let postData = this.handleData(data)
            if (successFn) successFn(postData)
        })
    }

    /**
     * @description 主机重新部署
     * @param hostIds 主机ids
     * @param successFn 成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    reset(hostIds: string, successFn?: Function, errorFn?: Function): void {
        let select = `SELECT * FROM ${this.tableName} where host_ids = ?`
        this.dao.connectDatabase(select, hostIds, res => {
            // console.log(res[0])
            // if (errorFn) errorFn()
            if (successFn) successFn(res[0])
        })
    }

}