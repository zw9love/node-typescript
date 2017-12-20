/**
 * @author zengwei
 * @since 2017/11/15
 * @description 入口文件
 */
import NodeServer from './server/index'
new NodeServer()
// require('./util/testSsh')
// require('./util/testRedis')

// import crypto = require('crypto');  //加载加密文件
// const key = 'zengwei'
// function aesEncrypt(str: string): string {
//     const cipher = crypto.createCipher('aes192', key);
//     var crypted = cipher.update(str, 'utf8', 'hex');
//     crypted += cipher.final('hex');
//     return crypted;

//     // var md5 = crypto.createHash('md5', key);
//     // md5.update(str);
//     // str = md5.digest('hex');
//     // return str;
// }
// console.log(aesEncrypt('admin123.com'))