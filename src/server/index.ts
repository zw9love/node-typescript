/**
 * @author zengwei
 * @since 2017/11/15
 */

/* 原生起 */
// let http = require("http"); 
// http.createServer(function(request, response) { 
//     response.writeHead(200, {"Content-Type": "application/json;charset=UTF-8", "Access-Control-Allow-Origin": "*"}); 
//     let json = {
//         "name": "大熊",
//         "sex": "男",
//         "age": 20
//     }
//     response.write(JSON.stringify(json)); 
//     response.end(); 
// }).listen(9090);

// import opn from 'opn'
// let express = require('express');
// let bodyParser = require('body-parser');
// let treeify = require('treeify');
// let opn = require('opn') // 一个可以强制打开浏览器并跳转到指定 url 的插件
import express = require('express')
import bodyParser = require('body-parser')
import session = require('express-session');
import cookieParser = require('cookie-parser');
import expressValidator = require('express-validator');
let RedisStore = require('connect-redis')(session);
// let MemcachedStore = require('connect-memcached')(session);
import Router from '../router/index'
import { getRandomString } from '../util/index'
import Redis from '../util/Redis'
let app = express();

// let router = new Router()
export default class NodeServer {
    public app = app
    public router = new Router(this.app)
    public storeOption: object = {
        host: 'localhost',
        port: 6379,
        logErrors: true
    }

    constructor() {
        this.init()
    }

    init(): void {
        // console.log('this.app初始化了')
        this.app.use(express.static("static"));
        // this.app.use(express.static("view"));
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(expressValidator());
        // 不用express-session了，太虎
        // this.app.use(session({
        //     secret: '123456',
        //     name: 'node',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
        //     cookie: {maxAge: 30 * 60 * 1000 },  //设置过期时间，session和相应的cookie失效过期
        //     resave: true, // 关键配置，让每个用户的session互不干扰
        //     saveUninitialized: true,
        //     store: new RedisStore(this.storeOption)
        // }));
        this.router.init()
        let server = this.app.listen(9090, function () {
            let host = server.address().address
            let port = server.address().port
            let uri = 'http://localhost:' + port
            console.log("Listening at: http://localhost:" + port)
            // opn(uri)
        })

        // 服务器重启，清空redis键值对
        Redis.client.keys('*', function (err, keys) {
            keys.forEach(e => { Redis.client.del(e) })
            console.log('redis数据库键值对已被清除。')
        });

        // 能捕获到进程的代码错误异常退出、process.exit()方法退出
        process.on('exit', (code) => {
            console.log('进程退出。')
            // console.log(`About to exit with code: ${code}`);
            // 异步操作将不会执行，被强制丢弃
            Redis.client.keys('*', function (err, keys) {
                keys.forEach(e => { Redis.client.del(e) })
                console.log(keys)
                console.log('redis数据库键值对已被清除。')
            });
        });

        // 捕获到操作者ctrl+c退出
        process.on('SIGINT', function () {
            // 调用强制退出
            process.exit(100)
        });

        // 监听进程异常
        process.on('uncaughtException', function (err) {
            //打印出错误
            console.log(err)
            //打印出错误的调用栈方便调试
            console.log(err.stack)
        });

        // this.app.close(function () {
        //     console.log(‘stop listening’);
        // })

    }
}