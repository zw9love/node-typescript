/**
 * @author zengwei
 * @since 2018/1/5
 */
import Dao from '../dao/index'
import { formatData } from '../filters/index'
import { getJson, getRandomString, beginTransaction } from '../util/index'
import { postData, moduleObj } from '../interface/index'
import os = require('os')
import fs = require('fs')
let child_process = require('child_process')
var path = require('path')
export default class BeeeyeReport {
    public dao = new Dao()
    private tableName: string = 'beeeye_report'
    private path: string = os.platform().toLowerCase().search('win') === -1 ? '/home/zengwei/output/' : 'c:/report/'
    constructor() { }
    /**
     * @description 操作dao对象拿到数据
     * @param ids web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    getData(postData: postData, successFn?: Function, errorFn?: Function): void {
        let { row, size, page, query, sort } = postData
        let select = `SELECT * FROM ${this.tableName} `
        let where = ` where 1 = 1 `
        beginTransaction({ self: this, successFn, errorFn, postData, dataArr: null, where })
    }

    /**
     * @description 添加数据
     * @param data web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    addData(data: any, successFn?: Function, errorFn?: Function): void {
        let path = this.path
        if (!fs.existsSync(path)) fs.mkdirSync(path)
        let sql = `INSERT INTO ${this.tableName} (ids, title, path, time, hash) VALUES ( ?, ?, ?, ?, ?) `
        let title = 'REPORT-' + formatData(new Date(), 'yyyyMMddhhmmss')
        let ids = getRandomString()
        let time = new Date().getTime() / 1000
        let arr = [ids, title, '', time, '']
        this.dao.connectDatabase(sql, arr, res => {
            if (successFn) successFn(res)
        })
    }

    /**
     * @description 单个删除
     * @param idsArr  sql语句参数
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */

    deleteDataById(ids: string, successFn?: Function, errorFn?: Function): void {
        let sql = `DELETE FROM ${this.tableName} where ids = ?`;
        // 开启事务方法
        this.dao.connectDatabase(sql, ids, res => {
            let affectedRows = res.affectedRows
            let json = affectedRows > 0 ? getJson('删除成功', 200) : getJson('删除失败', 606)
            if (successFn) successFn(json)
            // let auditPath = this.path
            // fs.unlink(auditPath + ids + '.csv', data => {
            //     let affectedRows = res.affectedRows
            //     let json = affectedRows > 0 ? getJson('删除成功', 200) : getJson('删除失败', 606)
            //     if (successFn) successFn(json)
            // })
        }, errorFn)
    }

    /**
     * @description 下载文件
     * @param fileName 文件名字
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    downFile(fileName: string, successFn?: Function, errorFn?: Function): void {

    }

}