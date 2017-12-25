/**
 *
 * @description 邮件对象
 * @author zengwei
 * @since 2017/12/23
 */

let nodemailer = require('nodemailer')

export default class Mail {
    private configQQ = {
        // service: config.email.service,
        host: 'smtp.qq.com', // qq
        secureConnection: true, // ssl连接
        port: 465, //smtp的端口
        secure: true, // smtp的端口必须安全
        auth: {
            user: '823334587@qq.com', // 823334587@qq.com
            pass: 'yxvhhhnmhhnebdgf' // yxvhhhnmhhnebdgf
        }
    }
        
    
    private config163 = {
        // service: config.email.service,
        host: 'smtp.163.com', // 163
        secureConnection: true, // ssl连接
        port: 465, //smtp的端口
        secure: true, // smtp的端口必须安全
        auth: {
            user: '18514075699@163.com', // 823334587@qq.com
            pass: 'dhsqj1992' // yxvhhhnmhhnebdgf
        }
    }
    private transport :any
    constructor() { 
        // console.log(this.config163)
        this.transport = nodemailer.createTransport(this.configQQ)
    }

    /**
     * @description 发送邮件
     * @param param0 发送邮件的信息
     */
    sendMail({ recipient, title, html, text, files, name }: any): void {
        let mailOption = {
            from: `${name}<${this.configQQ.auth.user}>`, // i am weiwei作为发送者名字
            to: recipient, // 多个接受者用逗号,隔开
            subject: title, // 标题
            text: text, // 内容
            html: html,
            attachments: files
        }

        this.transport.sendMail(mailOption, (error, response) => {
            if (error) {
                console.log('失败')
                this.transport.close()
                return console.log(error);
            }
            console.log('成功')
            // console.log(response)
            this.transport.close()
        });
    }

}
