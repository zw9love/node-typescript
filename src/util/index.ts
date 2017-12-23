/**
 * @author zengwei
 * @since 2017/11/15
 */

import crypto = require('crypto');  //加载加密文件
import uuidv1 = require('uuid/v1');  //生成随机字符串
import { request, response } from "../interface/index";
import Redis from '../util/Redis'
const client = Redis.client
const expired = Redis.expired
const key = 'zengwei'

/**
 * @description checkPage方法体参数格式
 */
interface rowPage {
    where: string
    limit: string
    page?: {
        pageNumber?: number | string
        pageSize?: number | string
    }
    row?: {
        host_ids?: string
        hostIds?: string
    }
}


/**
 * @description 获取返回前台的json
 * @param msg 前台弹框信息
 * @param status 状态码
 * @param data json数据
 * @returns {json} 返回告诉前台的json
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
 * @param str 需要加密数据
 * @returns {string} 返回加密字符串
 */

function aesEncrypt(str: string): string {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(str, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
    // var md5 = crypto.createHash('md5', key);
    // md5.update(str);
    // str = md5.digest('hex');
    // return str;
}

/**
 * @description md5解密
 * @param data 需要解密md5数据
 * @returns {string} 返回解密字符串
 */
function aesDecrypt(md5: string): string {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(md5, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted
}



/**
 * @description 获得随机字符串
 * @returns {string} 返回随机字符串
 */
function getRandomString(): string {
    return uuidv1()
}

/**
 * @description 检查token是否失效
 * @param request 请求体
 */
function checkToken(request: request, response: response, successFn: Function): void {
    if (successFn) successFn()
    // let headerToken = request.headers.token
    // if (headerToken === 'debug') {
    //     if (successFn) successFn()
    //     return
    // }
    // client.get(headerToken, function (err, replies) {
    //     if (replies === null) return response.json(getJson('用户登录失效', 611, null))
    //     // 能进到这就说明token存在且没过期
    //     let login_name = replies
    //     // console.log('login_name：' + login_name)
    //     client.set(login_name, headerToken, 'EX', expired) // 过期时间单位是秒
    //     client.set(headerToken, login_name, 'EX', expired) // 过期时间单位是秒
    //     if (successFn) successFn()
    // });
    // let sessionToken = request.session.token
    // // console.log(request.session.store)
    // // console.log('sessionid：' + request.session.id)
    // // console.log('sessionID：' + request.sessionID)
    // // console.log('seessionToken：' + seessionToken)
    // if (headerToken === 'debug') return true
    // let flag = ( headerToken === sessionToken )
    // if (flag){
    //     request.session.count++
    //     if (successFn) successFn(flag)
    // }else{
    //     response.json(getJson('用户登录失效', 611, null))
    // }
    // // return flag
}

/**
 * @description  transaction事务操作
 * @param connection 数据库连接对象
 * @param res 事务结果
 * @param page page参数
 * @param successFn 成功回调函数
 * @param dao dao对象
 */

function beginTransaction({ self, postData, where, dataArr, successFn, errorFn }: any): void {
    let { row, size, page, query, sort } = postData
    // let platformIds = row.platformIds
    let select = `SELECT * FROM ${self.tableName} `
    // let where = ` where platform_ids = ? `
    let count = `SELECT count(*) as sum FROM ${self.tableName} `
    let limit = ' '
    let search = ' '
    let sortSql = ' '
    let pageSize = 0
    let pageStart = 0

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
    self.dao.connectTransaction(tsData, (connection, res) => {
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
        self.dao.commitActive = true
        let json = getJson('成功', 200, postData)
        if (successFn) successFn(json)

        // 事务失败,手动回滚(例如受影响的条数为0)
        // dao.commitActive = false
        // connection.rollback(o => {
        //     console.log('出现错误,回滚!');
        //     //释放资源
        //     connection.end();
        // });

    }, errorFn)
}


export {
    getJson,
    getRandomString,
    checkToken,
    aesEncrypt,
    aesDecrypt,
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