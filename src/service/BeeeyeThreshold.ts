/**
 * @author zengwei
 * @since 2017/12/14
 */
import Dao from '../dao/index'
import { autoGetData } from '../filters/index'
import { getJson } from '../util/index'
import { postData, moduleObj } from '../interface/index'

export default class BeeeyeThreshold {
    public dao = new Dao()
    private tableName: string = 'beeeye_host_threshold'
    constructor() { }
    /**
     * @description 操作dao对象拿到数据
     * @param data web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    getData(ids: string, successFn?: Function, errorFn?: Function): void {
        let select = `SELECT * FROM ${this.tableName} where host_ids = ?`
        this.dao.connectDatabase(select, ids, res => {
            let list = res
            list.forEach(o => {
                switch (~~o.threshold_ids){
                    case 1:
                        o.threshold_zhname = 'CPU使用率'
                        o.threshold_name = 'CPU'
                        break
                    case 2:
                        o.threshold_zhname = '内存使用率'
                        o.threshold_name = 'MEM'
                        break
                    case 3:
                        o.threshold_zhname = '硬盘空间'
                        o.threshold_name = 'DISK'
                        break
                    case 4:
                        o.threshold_zhname = '网络占用'
                        o.threshold_name = 'NET'
                        break
                    case 5:
                        o.threshold_zhname = '漏洞数量'
                        o.threshold_name = 'VULNERABILITY'
                        break
                }
            })
            // console.log(list)
            if (successFn) successFn(list)
        }, errorFn)
    }

    /**
     * @description 操作dao对象更新数据
     * @param data  web层传递参数
     * @param successFn 成功执行回调函数
     * @param errorFn 失败执行回调函数
     */
    upDateData(data: Array<any>, successFn?: Function, errorFn?: Function): void {
        let update = `UPDATE ${this.tableName} `
        let where = ` WHERE ids IN (`
        let value = 'SET value = CASE ids '
        let idsArr = []
        data.forEach((o, i) => {
            let valueSql = i === data.length - 1 ? `WHEN '${o.ids}' THEN ${o.value} END ` : `WHEN '${o.ids}' THEN ${o.value} `
            value += valueSql
            let whereSql = i === data.length - 1 ? `?)` : `?,`
            where += whereSql
            idsArr.push(o.ids)
        })
        let sql = update + value + where
        // console.log(sql)
        this.dao.connectDatabase(sql, idsArr, res => {
            // console.log(res)
            if (successFn) successFn(res)
        }, errorFn)
    }

}