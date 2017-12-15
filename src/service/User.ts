/**
 * @author zengwei
 * @since 2017/12/15
 */
import Dao from '../dao/index'
import { response, request, loginData } from '../interface/index'
import { getJson, checkPage, beginTransaction, getRandomString, aesEncrypt } from '../util/index'


export default class User {
    private dao: Dao = new Dao()
    private tableName: string = 'common_user'
    constructor() { }
    /**
     * @description 查询用户
     * @param data  sql语句参数
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    getData(request: request, successFn?: Function, errorFn?: Function): void {
        let select = `SELECT * FROM ${this.tableName} `
        let where = ` where username = ? `
        let count = `SELECT count(*) as sum FROM ${this.tableName}`
        let limit = ''
        let username = request.session.role.username
        let { row, page } = request.body
        if (page) {
            checkPage({ row, where, page, limit })
        }

        let tsData = [
            { sql: count + where, dataArr: username },
            { sql: select + where + limit, dataArr: username },
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
        let where = `where ids = ? `
        let sql = select + where
        this.dao.connectDatabase(sql, hostIds, res => {
            let json = getJson('成功', 200, res[0])
            if (successFn) successFn(json)
        }, errorFn)
    }

    /**
     * @description 增加
     * @param json  sql语句参数
     * @param username  管理员类型中文名
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */

    addData(json: loginData, username:string, successFn?: Function, errorFn?: Function): void {
        let sql = `INSERT INTO ${this.tableName} (ids, login_name, login_pwd, username, email) VALUES ( ?, ?, ?, ?, ?) `
        let ids = getRandomString()
        let arr = [ids, json.login_name, aesEncrypt(json.login_pwd), username, json.email]
        let checkSql = `SELECT count(*) as sum FROM ${this.tableName} where login_name = ?`

        this.dao.connectDatabase(checkSql, json.login_name, res => {
            if (res[0].sum > 0){
                if (successFn) successFn(res[0])
                return
            } 
            console.log('没return')
            this.dao.connectDatabase(sql, arr, res => {
                if (successFn) successFn(res)
            })
        })
    }

    /**
     * @description 更新
     * @param json  sql语句参数
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */

    upDateData(json: any, successFn?: Function, errorFn?: Function): void {
        let sql = `UPDATE ${this.tableName} SET email = ? where ids = ?`;
        let arr = [json.email, json.ids]
        this.dao.connectDatabase(sql, arr, ({ affectedRows }) => {
            let json = affectedRows > 0 ? getJson('修改成功', 200) : getJson('修改失败', 606)
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
}