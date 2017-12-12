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


// import express = require('express')
// import bodyParser = require('body-parser')
// import Router from '../router/index'
// import treeify from 'treeify'
// import opn from 'opn'
// let express = require('express');
// let bodyParser = require('body-parser');
// let treeify = require('treeify');
// let opn = require('opn') // 一个可以强制打开浏览器并跳转到指定 url 的插件
import express = require('express')
import bodyParser = require('body-parser')
import session = require('express-session');
import cookieParser = require('cookie-parser');
import Router from '../router/index'
let app = express();

// let router = new Router()
export default class NodeServer{
    public app = express()
    public router = new Router(this.app)

    constructor(){
        this.init()
    }

    init(): void {
        console.log('this.app初始化了')
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(session({
            secret: '12345',
            name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
            // cookie: {maxAge: 5 * 60 * 1000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
            cookie: {maxAge: 30 * 1000 },  //设置maxAge是30000ms，即30s后session和相应的cookie失效过期
            resave: false, // 关键配置，让每个用户的session互不干扰
            saveUninitialized: true
        }));
        this.app.use(express.static("static"));
        // this.app.use(express.static("view"));
        this.router.init()
        let server = this.app.listen(9090, function () {
            let host = server.address().address
            let port = server.address().port
            let uri = 'http://localhost:' + port
            console.log("Listening at: http://localhost:" + port)
            // opn(uri)
        })
    }
}