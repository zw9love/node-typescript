import uuidv1 = require('uuid/v1');  //生成随机字符串
import { setTimeout } from 'timers';

interface loginData {
    login_name: string
    login_pwd: string
    username?: string
}

export default class Role {
    public static token: string = 'debug'
    public static role: loginData = { login_name: 'root', login_pwd: '', username: '超级管理员' }
    public static timer:any = null
    constructor() {
        console.log('创建了token')
        this.createToken()
        Role.timer = setTimeout(o => { Role.token = null;console.log('token已经失效咯')}, 1 * 60 * 1000)
    }

    createToken() {
        Role.token = uuidv1()
    }

    public static checkToken(token: string) {
        if (token === Role.token) return true
        return false
    }

    public static refreshToken(){
        clearTimeout(Role.timer)
        Role.timer = setTimeout(o => { Role.token = null; console.log('token已经失效咯') }, 1 * 60 * 1000)
    }
}