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


/* express 框架*/
// let express = require('express');
// let bodyParser = require('body-parser');
// let treeify = require('treeify');
// let route = require('./router/index')
// let opn = require('opn') // 一个可以强制打开浏览器并跳转到指定 url 的插件
// let app = express();
// app.use(bodyParser.json());

// // 初始化路由
// routeInit(app);

// let server = app.listen(9090, function () {
//     let host = server.address().address
//     let port = server.address().port
//     let uri = 'http://localhost:' + port
//     console.log("Listening at: http://localhost:" + port)
//     // opn(uri)
// })

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
        this.app.use(bodyParser.json());
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