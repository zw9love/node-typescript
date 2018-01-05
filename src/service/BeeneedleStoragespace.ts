/**
 * @author zengwei
 * @since 2018/1/5
 */
import Dao from '../dao/index'
import { countData } from '../filters/index'
import { getJson, getRandomString } from '../util/index'
import { postData, moduleObj } from '../interface/index'

export default class BeeneedleStoragespace {
    public dao = new Dao()
    private tableName: string = 'beeeye_storage_space_alarm'
    constructor() { }
    /**
     * @description 操作dao对象拿到setting数据
     * @param data web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    getData(postData: postData, successFn?: Function, errorFn?: Function): void {
        let { row, size, page, query, sort } = postData
        let select = ` SELECT * FROM ${this.tableName} `

        this.dao.connectDatabase(select, null, res => {
            let json = getJson('成功', 200, res)
            if (successFn) successFn(json)
        }, errorFn)

        // let where = ` where 1 = 1 `
        // let count = `SELECT count(*) as sum FROM ${this.tableName} `
        // let limit = ' '
        // let search = ' '
        // let sortSql = ' '
        // let pageSize = 0
        // let pageStart = 0
        // let dataArr = []

        // if (sort) {
        //     let { col, order } = sort[0]
        //     sortSql = `order by ${col} ${order}`
        // }

        // if (query) {
        //     for (let i in query) {
        //         if (query[i].trim() === '') continue
        //         where += ` and ${i} LIKE '%${query[i]}%' `
        //     }
        // }

        // // page分页存在
        // if (page) {
        //     pageSize = ~~page.pageSize
        //     pageStart = (~~page.pageNumber - 1) * pageSize
        //     limit = ` limit ${pageStart}, ${pageSize}`
        // }
        // // size存在（排序查找功能）
        // else if (size) {
        //     pageSize = ~~size.size
        //     pageStart = ~~size.beforeId
        //     limit = ` limit ${pageStart}, ${pageSize}`
        //     // 如果都不是，返回全部给你们
        // } else {
        //     limit = ' '
        // }

        // let tsData = [
        //     { sql: count + where, dataArr: dataArr },
        //     { sql: select + where + search + sortSql + limit, dataArr: dataArr },
        // ]

        // // 开始事务（事务是必须走的，因为查询记录总数和拿到数据是两条sql语句才能解决）
        // this.dao.connectTransaction(tsData, (connection, res) => {
        //     let totalRow = res[0][0].sum
        //     let list = res[1]
        //     let postData: any = {}
        //     if (page) {
        //         postData = {
        //             list: list,
        //             totalRow: totalRow,
        //             totalPage: totalRow / ~~page.pageSize,
        //             pageNumber: ~~page.pageNumber,
        //             pageSize: ~~page.pageSize,
        //             firstPage: ~~page.pageNumber === 1 ? true : false,
        //             lastPage: ~~page.pageNumber === (totalRow / ~~page.pageSize) ? true : false
        //         }
        //     } else if (size) {
        //         postData = {
        //             list: list,
        //             totalRow: totalRow,
        //             size: { beforeId: pageStart + pageSize, size: pageSize, offset: pageStart + pageSize }
        //         }
        //     }
        //     this.dao.commitActive = true
        //     let json = getJson('成功', 200, postData)
        //     if (successFn) successFn(json)
        // }, errorFn)


    }

    /**
     * @description 修改
     * @param data  web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    upDateData(data: Array<any>, successFn?: Function, errorFn?: Function): void {
        // console.log(data)
        // let sql = `UPDATE ${this.tableName} SET space_stroge_name = ?, space_stroge_type = ?, value =? where ids = ?`;
        // let arr = [json.space_stroge_name, json.space_stroge_type, json.value, json.ids]
        // this.dao.connectDatabase(sql, arr, ({ affectedRows }) => {
        //     let json = affectedRows === 1 ? getJson('修改成功', 200) : getJson('修改失败', 404)
        //     if (successFn) successFn(json)
        // }, errorFn)

        let update = `UPDATE ${this.tableName} `
        let where = ` WHERE ids IN (`
        // let type = 'SET space_stroge_type = CASE ids '
        let value = 'SET value = CASE ids '
        let hostIdsArr = []
        data.forEach((o, i) => {
            // let typeSql = i === data.length - 1 ? `WHEN '${o.ids}' THEN ${o.space_stroge_type} END,` : `WHEN '${o.ids}' THEN ${o.space_stroge_type} `
            // type += typeSql
            let valueSql = i === data.length - 1 ? `WHEN '${o.ids}' THEN ${o.value} END` : `WHEN '${o.ids}' THEN ${o.value} `
            value += valueSql
            let whereSql = i === data.length - 1 ? `?)` : `?,`
            where += whereSql
            hostIdsArr.push(o.ids)
        })
        let sql = update + value + where
        // console.log(sql)
        this.dao.connectDatabase(sql, hostIdsArr, res => {
            if (successFn) successFn(res)
        }, errorFn)
    }

    /**
     * @description 手动检测存储空间
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    manualCheckSpace(successFn?: Function, errorFn?: Function): void {
        let sql = ` select sum(data_length) as 'total' from information_schema.tables where table_schema = 'beeeyehced' ` // 单位字节B
        this.dao.connectDatabase(sql, null, res => {
            let total = res[0].total
            let maxTotal = 200 * 1024 * 1024 * 1024 // 单位KB
            let usage = (total / maxTotal * 100 ).toFixed(2) + '%'
            let data = {
                list:[{
                    max_space: '200G',
                    advice_space: '160G',
                    real_space: countData(total),
                    real_usage: usage
                }],
                warning: false
            }
            let json = getJson('成功', 200, data)
            if (successFn) successFn(json)
        }, errorFn)
    }
}