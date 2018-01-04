/**
 * @author zengwei
 * @since 2018/1/4
 */
import Dao from '../dao/index'
import { autoGetData } from '../filters/index'
import { getJson, getRandomString } from '../util/index'
import { postData, moduleObj } from '../interface/index'

export default class BeeneedleApplicationAudit {
    public dao = new Dao()
    private tableName: string = 'beeneedle_gray_file_audit'
    constructor() { }
    /**
     * @description 操作dao对象拿到setting数据
     * @param data web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    getData(postData: postData, successFn?: Function, errorFn?: Function): void {
        let { row, size, page, query, sort } = postData
        let select = `SELECT * FROM ${this.tableName} `
        let where = ` where host_ids = ? and type = ? `
        let count = `SELECT count(*) as sum FROM ${this.tableName} `
        let hostIds = row.host_ids || row.hostIds
        let limit = ' '
        let search = ' '
        let sortSql = ' '
        let pageSize = 0
        let pageStart = 0
        let type = row.type
        let dataArr = [hostIds, type]

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
            { sql: count + where, dataArr: dataArr },
            { sql: select + where + search + sortSql + limit, dataArr: dataArr },
        ]

        // 开始事务（事务是必须走的，因为查询记录总数和拿到数据是两条sql语句才能解决）
        this.dao.connectTransaction(tsData, (connection, res) => {
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

        // this.dao.connectDatabase(select, [], res => {
        //     if (successFn) successFn(res)
        // }, errorFn)
    }

    /**
     * @description 单个删除
     * @param idsArr  sql语句参数
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */

    deleteData(ids: string, successFn?: Function, errorFn?: Function): void {
        let sql = `DELETE FROM ${this.tableName} where ids = ? `
        // 开启事务方法 删除主机的同时，删除主机模块数据
        this.dao.connectDatabase(sql, ids, res => {
            let affectedRows = res.affectedRows
            let json = affectedRows > 0 ? getJson('删除成功', 200) : getJson('删除失败', 606)
            if (successFn) successFn(json)
        }, errorFn)
    }

    /**
     * @description 批量删除
     * @param idsArr  sql语句参数
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */

    deleteDataBatch(idsArr: Array<string>, successFn?: Function, errorFn?: Function): void {
        let sql = `DELETE FROM ${this.tableName} where ids in (?)`
        // 开启事务方法 删除主机的同时，删除主机模块数据
        this.dao.connectDatabase(sql, idsArr, res => {
            let affectedRows = res.affectedRows
            let json = affectedRows > 0 ? getJson('删除成功', 200) : getJson('删除失败', 606)
            if (successFn) successFn(json)
        }, errorFn)
    }

}