/**
 * @author zengwei
 * @since 2017/11/15
 */

import crypto = require('crypto');  //加载加密文件
import uuidv1 = require('uuid/v1');  //生成随机字符串
import { rowPage } from "../interface/index";
import Dao from "../dao/index";
const dao = new Dao()

/**
 * @description 获取返回前台的json
 * @param msg 
 * @param status 
 * @param data 
 */
function getJson(msg: string = '', status: number, data: any = null): object {
    let json = {
        data: data,
        msg: msg,
        status: status
    }
    return json
}

/**
 * @description md5加密
 * @param str
 */

function md5(str: string) {
    var md5 = crypto.createHash('md5');
    md5.update(str);
    str = md5.digest('hex');
    return str;
}

/**
 * @description 检查分页参数
 * @param row 分页row参数
 * @param page 分页page参数
 * @param where where sql语句
 * @param limit limit sql语句
 */
function checkPage({ row, where, page, limit }: rowPage){
    if (row) {
        if (row.hostIds || row.host_ids) {
            let ids = row.hostIds || row.host_ids
            where = `where host_ids = ${ids} `
        }
    }
    if (page) {
        if (page.pageNumber && page.pageSize) {
            limit = `limit ${(~~page.pageNumber - 1) * ~~page.pageSize},${~~page.pageSize}`;
        }
    }
}

/**
 * @description  transaction事务操作
 * @param connection 数据库连接对象
 * @param res 事务结果
 * @param page page参数
 * @param successFn 成功回调函数
 * @param dao dao对象
 */

function beginTransaction({ connection, res, page, successFn, dao }) :void{
    let totalRow = res[0][0].sum
    let list = res[1]
    let postData = {
        list: list,
        totalRow: totalRow,
        totalPage: totalRow / ~~page.pageSize,
        pageNumber: ~~page.pageNumber,
        pageSize: ~~page.pageSize,
        firstPage: ~~page.pageNumber === 1 ? true : false,
        lastPage: ~~page.pageNumber === (totalRow / ~~page.pageSize) ? true : false
    }
    let json = getJson('成功', 200, postData)
    // if (successFn) successFn(json)

    // 事务成功
    dao.commitActive = true
    if (successFn) successFn(json)

    // 事务失败
    // dao.commitActive = false
    // connection.rollback(o => {
    //     console.log('出现错误,回滚!');
    //     //释放资源
    //     connection.end();
    // });
}


export {
    getJson,
    md5,
    checkPage,
    beginTransaction
}

// export default {
//     getJson
// }

// exports = module.exports =  {
//     getJson
// }

// export = {
//     getJson
// }