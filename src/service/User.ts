/**
 * @author zengwei
 * @since 2017/12/15
 */
import Dao from '../dao/index'
import { response, request, loginData } from '../interface/index'
import { getJson, beginTransaction, getRandomString, aesEncrypt } from '../util/index'
import Redis from '../util/Redis'


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
        Redis.client.get("role",  (err, res) => {
            if (err) return false
            let select = `SELECT * FROM ${this.tableName} `
            let where = ` where username = ? `
            let count = `SELECT count(*) as sum FROM ${this.tableName}`
            let limit = ' '
            let search = ' '
            let sortSql = ' '
            let pageSize = 0
            let pageStart = 0
            let role = JSON.parse(res)
            let username = role.username
            let { row, size, page, query, sort } = request.body

            if (sort) {
                let { col, order } = sort[0]
                sortSql = `order by ${col} ${order}`
            }

            if (query) {
                for (let i in query) {
                    if (query[i].trim() === '') continue
                    where += ` and ${i} LIKE '%${query[i]}%' `
                }
            }

            // page分页存在
            if (page) {
                pageSize = ~~page.pageSize
                pageStart = (~~page.pageNumber - 1) * pageSize
                limit = ` limit ${pageStart}, ${pageSize}`
            }
            // size存在（排序查找功能）
            else if (size) {
                pageSize = ~~size.size
                pageStart = ~~size.beforeId
                limit = ` limit ${pageStart}, ${pageSize}`
                // 如果都不是，返回全部给你们
            } else {
                limit = ' '
            }

            let tsData = [
                { sql: count + where, dataArr: username },
                { sql: select + where + search + sortSql + limit, dataArr: username },
            ]

            // 开始事务（事务是必须走的，因为查询记录总数和拿到数据是两条sql语句才能解决）111
            this.dao.connectTransaction(tsData, (connection, res) => {
                // beginTransaction({ connection, res, page: page ? page : {}, successFn, dao: this.dao })
                let totalRow = res[0][0].sum
                let list = res[1]
                let postData: any = {}
                if (page) {
                    postData = {
                        list: list,
                        totalRow: totalRow,
                        totalPage: totalRow / ~~page.pageSize,
                        pageNumber: ~~page.pageNumber,
                        pageSize: ~~page.pageSize,
                        firstPage: ~~page.pageNumber === 1 ? true : false,
                        lastPage: ~~page.pageNumber === (totalRow / ~~page.pageSize) ? true : false
                    }
                } else if (size) {
                    postData = {
                        list: list,
                        totalRow: totalRow,
                        size: { beforeId: pageStart + pageSize, size: pageSize, offset: pageStart + pageSize }
                    }
                }
                this.dao.commitActive = true
                let json = getJson('成功', 200, postData)
                if (successFn) successFn(json)
            }, errorFn)

        })
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
            // console.log('没return')
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