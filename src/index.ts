import { throws } from "assert";

/**
 * @author zengwei
 * @since 2017/11/15
 * @description 入口文件
 */
// 启动node服务器
import NodeServer from './server/index'
new NodeServer()

// 异常测试
// let a = {}

// 1、异常catch
// try {
//     console.log(a['val']['val']) //触发异常
//     console.log('正常执行') //出现异常，这里就不执行了
// } catch (error) {
//     console.log('出现异常了')
//     console.log(error.message)
// } finally{
//     console.log('怎么都会进来')
// } 

// 2、异常throw
// class Test {
//     public mySum(x, y): number{
//         x=Number(x);
//         y=Number(y);
//         if(isNaN(x)||isNaN(y))
//         {
//             throw new Error("两个数相加前提两个数必须都是数字").message; // 抛出异常
//         }
//         else
//         {
//             return x+y;
//         }
//     }
// }
// new Test().mySum(1,'a1')

// uuid测试
// import uuidv1 = require('uuid/v1');  //生成随机字符串
// console.log(uuidv1())
// console.log(uuidv1(null, [], 0))
// excel文件测试
// require('./util/testXlsx')

// 命令行测试
// require('./util/testChildProcess')

// ssh连接测试
// require('./util/testSsh')

// redis测试
// require('./util/testRedis')

//发送邮件测试
// import Mail from './util/Mail'
// let mail = new Mail()
// mail.sendMail({
//     recipient:'18514075699@163.com,823334587@qq.com',
//     title:'圣诞大礼哦，点进来看看啊111', 
//     text:'圣诞快乐，有附件。111',
//     name: '你大爷'
//     // html:'<h1>Hi, weiwei,这是一封测试邮件111222333</h1>'
//     // files:[
//     //     {
//     //         filename:'config.json',
//     //         path:'./src/dao/config.json' // 当前路径是项目根路径
//     //     },
//     //     {
//     //         filename:'index.ts',
//     //         path:'./src/dao/index.ts'
//     //     }
//     // ]
// })

// 获取加密密码
// import crypto = require('crypto');
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
// console.log(aesEncrypt('admin123.com'))  // 34bb6a6094abcdff4bf6c6ef88db2cee