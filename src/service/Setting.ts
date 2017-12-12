/**
 * @author zengwei
 * @since 2017/12/12
 */
import Dao from '../dao/index'
import { autoGetData } from '../filters/index'
import { getJson } from '../util/index'
import { postData } from '../interface/index'
export default class Setting {
    public dao = new Dao()
    private tableName: string = 'common_setting'
    constructor() { }
    getData(data: postData, successFn?: Function, errorFn?: Function): void {
        let select = `SELECT * FROM ${this.tableName} `
        this.dao.connectDatabase(select, null, res => {
            // console.log(res)
            if (successFn) successFn(res)
        }, errorFn)
    }

}