/**
 * @author zengwei
 * @since 2017/11/15
 */

import crypto = require('crypto');  //加载加密文件
import uuidv1 = require('uuid/v1');  //生成随机字符串

/**
 * @description 获取返回前台的json
 * @param msg 
 * @param status 
 * @param data 
 */
function getJson(msg: string = '', status: number, data: any = null) :object{
    let json = {
        data: data,
        msg: msg,
        status: status
    }
    return json
}

/**
 * @description 随机生成token值
 */
function getToken(): string {
    return uuidv1()
}

/**
 * @description md5加密
 * @param str
 */

function md5(str:string){
    var md5 = crypto.createHash('md5');
    md5.update(str);
    str = md5.digest('hex');
    return str;
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

export {
    getJson,
    getToken,
    md5
}