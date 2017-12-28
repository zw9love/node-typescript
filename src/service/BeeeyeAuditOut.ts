/**
 * @author zengwei
 * @since 2017/12/14
 */
import Dao from '../dao/index'
import { autoGetData } from '../filters/index'
import { getJson, getRandomString } from '../util/index'
import { postData, moduleObj } from '../interface/index'
import os = require('os')
import fs = require('fs')
let child_process = require('child_process')
var path = require('path')
export default class BeeeyeAuditOut {
    public dao = new Dao()
    private tableName: string = 'fileinput_detail'
    // private path: string = path.join(process.cwd(),'./output/')
    private path: string = os.platform().toLowerCase().search('win') === -1 ? '/home/zengwei/audit/' : 'c:/audit/'
    constructor() { }
    /**
     * @description 操作dao对象拿到数据
     * @param ids web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    getData(ids: string, successFn?: Function, errorFn?: Function): void {
        let select = `SELECT * FROM ${this.tableName} where user_ids = ?`
        this.dao.connectDatabase(select, ids, res => {
            res.forEach(e => {
                e.time = e.create_time
                e.defaultPath = e.default_path
                e.name = e.type
                e.ids = e.filename
            })
            if (successFn) successFn(res)
        }, errorFn)
    }

    /**
     * @description 添加数据
     * @param data web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    addData(data: any, successFn?: Function, errorFn?: Function): void {
        // sql语句导出sql文件
        let path = this.path
        // console.log(path)
        // console.log(process.cwd())
        // return
        if (!fs.existsSync(path)) fs.mkdirSync(path)
        let sql = `INSERT INTO ${this.tableName} (user_ids, default_path, filename, create_time, type) VALUES `
        let userIds = data.userIds
        let time = new Date().getTime() / 1000
        let typeArr = data.type
        let queryData = []
        let defaultPath = '/usr/local/share/lpdata/import'
        let outputSql = ``
        let taskArr = []
        // let outputSql = `select * from beeeye_host into outfile 'c:/audit/beeeye_host.csv' fields terminated by ','optionally enclosed by ''lines terminated by '\\r\\n';`
        typeArr.forEach((o, i) => {
            let str = i === typeArr.length - 1 ? ' (?,?,?,?,?) ' : ' (?,?,?,?,?), '
            let tempIds = getRandomString() + '.csv'
            let arr = [userIds, '', o + tempIds, time, o]
            sql += str
            queryData = queryData.concat(arr)
            let flag = false
            let tableName = ''
            switch(o){
                case 'BeeneedlePolicyLoadAudit':
                    tableName = 'beeneedle_policy_load_audit'
                    // flag = fs.existsSync(path + `${tableName}.csv`)
                    outputSql = `select * from ${tableName} into outfile '${path + o + tempIds}' fields terminated by ','optionally enclosed by ''lines terminated by '\\r\\n';`
                    break
                case 'aud_login':
                    tableName = 'common_login_audit'
                    // flag = fs.existsSync(path + `${tableName}.csv`)
                    outputSql = `select * from ${tableName} into outfile '${path + o + tempIds}' fields terminated by ','optionally enclosed by ''lines terminated by '\\r\\n';`
                    break
                case 'BeeneedleProcessAccessAudit':
                    tableName = 'beeneedle_process_access_audit'
                    // flag = fs.existsSync(path + `${tableName}.csv`)
                    outputSql = `select * from ${tableName} into outfile '${path + o + tempIds}' fields terminated by ','optionally enclosed by ''lines terminated by '\\r\\n';`
                    break
                case 'BeeneedleConfigAudit':
                    tableName = 'beeneedle_config_audit'
                    // flag = fs.existsSync(path + `${tableName}.csv`)
                    outputSql = `select * from ${tableName} into outfile '${path + o + tempIds}' fields terminated by ','optionally enclosed by ''lines terminated by '\\r\\n';`
                    break
                case 'BeeneedleGrayFileAudit':
                    tableName = 'beeneedle_gray_file_audit'
                    // flag = fs.existsSync(path + `${tableName}.csv`)
                    outputSql = `select * from ${tableName} into outfile '${path + o + tempIds}' fields terminated by ','optionally enclosed by ''lines terminated by '\\r\\n';`
                    break
            }
            // if (!flag) taskArr.push({ sql: outputSql, dataArr: null })
            taskArr.push({ sql: outputSql, dataArr: null })
        })

        // console.log(outputSql)
        taskArr.push({ sql: sql, dataArr: queryData })

        this.dao.connectTransaction(taskArr, res => {
            if (successFn) successFn(null)
        })

        // this.dao.connectDatabase(sql, queryData, res => {
        //     if (successFn) successFn(res)
        // })

        // 命令行导出sql文件
        // let windowsCommand = 'c:/xampp/mysql/bin/mysqldump -uroot -p159357 beeeyehced'
        // let linuxCommand = 'mysqldump -uroot -proot beeeyehced'
        // let path = os.platform().toLowerCase().search('win') === -1 ? '/home/zengwei/audit/' : 'c:/audit/'
        // let command = os.platform().toLowerCase().search('win') === -1 ? linuxCommand : windowsCommand
        // let sql = `INSERT INTO ${this.tableName} (user_ids, default_path, filename, create_time, type) VALUES `
        // let userIds = data.userIds
        // let time = new Date().getTime() / 1000
        // let typeArr = data.type
        // let queryData = []
        // let defaultPath = '/usr/local/share/lpdata/import'
        // typeArr.forEach((o, i) => {
        //     // let str = i === typeArr.length - 1 ? `('${userIds}', '/usr/local/share/lpdata/import', ${o + userIds + '.csv'}, ${time}, ${o})` : `('${userIds}', '/usr/local/share/lpdata/import', ${o + userIds + '.csv'}, ${time}, ${o}),`
        //     let str = i === typeArr.length - 1 ? ' (?,?,?,?,?) ' : ' (?,?,?,?,?), '
        //     let arr = [userIds, defaultPath, o + userIds + '.csv', time, o]
        //     sql += str
        //     queryData = queryData.concat(arr)
        //     let singleCommand = ''
        //     switch(o){
        //         case 'BeeneedlePolicyLoadAudit':
        //             singleCommand = command + ` beeneedle_policy_load_audit > ${path}beeneedle_policy_load_audit.sql`
        //             break
        //         case 'aud_login':
        //             singleCommand = command + ` common_login_audit > ${path}common_login_audit.sql`
        //             break
        //         case 'BeeneedleProcessAccessAudit':
        //             singleCommand = command + ` beeneedle_process_access_audit > ${path}beeneedle_process_access_audit.sql`
        //             break
        //         case 'BeeneedleConfigAudit':
        //             singleCommand = command + ` beeneedle_config_audit > ${path}beeneedle_config_audit.sql`
        //             break
        //         case 'BeeneedleGrayFileAudit':
        //             singleCommand = command + ` beeneedle_gray_file_audit > ${path}beeneedle_gray_file_audit.sql`
        //             break
        //     }
        //     console.log(singleCommand)
        //     child_process.exec(singleCommand, (error, stdout, stderr) => {
        //         if (error) return console.log('报错了。')
        //         console.log('导出成功了。')
        //     })
        // })

        // // // 导出sql文件
        // // child_process.exec(command, (error, stdout, stderr) => {
        // //     if (error) return console.log('报错了。')
        // //     console.log('导出成功了。')
        // // })

        // this.dao.connectDatabase(sql, queryData, res => {
        //     if (successFn) successFn(res)
        // })
    }

    /**
     * @description 删除 / 批量删除
     * @param idsArr  sql语句参数
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */

    deleteData(ids: string, successFn?: Function, errorFn?: Function): void {
        let sql = `DELETE FROM ${this.tableName} where filename = ?`;
        // 开启事务方法
        this.dao.connectDatabase(sql, ids + '.csv', res => {
            let auditPath = this.path
            fs.unlink(auditPath + ids + '.csv', data => {
                let affectedRows = res.affectedRows
                let json = affectedRows > 0 ? getJson('删除成功', 200) : getJson('删除失败', 606)
                if (successFn) successFn(json)
            })
        }, errorFn)
    }

    /**
     * @description 下载文件
     * @param fileName 文件名字
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    downFile(fileName: string, successFn?: Function, errorFn?: Function): void {
        let auditPath = this.path
        let path = auditPath + fileName + '.csv'
        // let path = 'e:/photo/h19.jpg'
        if (successFn) successFn(path)
    }

    /**
     * @description 上传文件
     * @param json 上传文件信息
     * @param successFn  成功执行的回调函数
     * @param errorFn 失败执行的回调函数
     */
    uploadFile(json: any, successFn?: Function, errorFn?: Function): void {
        // console.log(json)
        let path = json.path.replace(/\\/g, "/")
        let tableName = ''

        // 表名和文件不一致的时候
        if (json.originalname.indexOf(json.ids) === -1) {
            fs.unlink(path, data => {
                if (successFn) successFn(false)
            })
            return
        }

        switch (json.ids){
            case 'BeeneedlePolicyLoadAudit':
                tableName = 'beeneedle_policy_load_audit'
                break
            case 'aud_login':
                tableName = 'common_login_audit'
                break
            case 'BeeneedleProcessAccessAudit':
                tableName = 'beeneedle_process_access_audit'
                break
            case 'BeeneedleConfigAudit':
                tableName = 'beeneedle_config_audit'
                break
            case 'BeeneedleGrayFileAudit':
                tableName = 'beeneedle_gray_file_audit'
                break
        }
        let sql = `load data local infile '${path}' into table ${tableName} fields terminated by ','lines terminated by '\\r\\n'`

        let taskArr = [
            { sql: `delete from ${tableName}`, dataArr: null},
            { sql: sql, dataArr: null}
        ]

        this.dao.connectTransaction(taskArr, res => {
            // console.log('成功向mysql导入了文件。')
            fs.unlink(path, data => {
                // console.log('成功删除了导入的文件。')
                if (successFn) successFn(true)
            })
        }, errorFn)
    }
}