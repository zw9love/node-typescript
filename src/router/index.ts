/**
 * @author zengwei
 * @since 2017/11/15
 */

// ./不能忽略
// let host = require('../web/host/index')
// var multipart = require('connect-multiparty');
import Host from '../web/host/index'
import multipart = require('connect-multiparty')
import express = require('express')
import bodyParser = require('body-parser')
var multipartMiddleware = multipart()


export default class Router{
    public host = new Host()
    public app:any
    constructor(app:any){
        this.app = app
    }
    /**
     * @description 初始化方法
     */
    init():void{
        // 相当于拦截器
        this.app.all("*", (req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*"); //设置允许客户端跨域请求
            res.header("Content-Type", "application/json;charset=UTF-8"); //设置响应头数据类型
            next();
        });

       /**
        * 路由块
        */

        // host路由
        this.app.get('/host/delete/:ids',  (request, response, next)=> {
            let host_ids = request.params.ids || null
            this.host.deleteDataById(host_ids, response, next)
        })

        this.app.post('/host/get',  (request, response, next) =>{
            let host_ids = request.body.host_ids || null
            this.host.getData(host_ids, response, next)
        })

        this.app.post('/host/delete', (request, response, next) =>{
            let idsArr = request.body || []
            this.host.deleteDataBatch(idsArr, response, next)
        })

        this.app.post('/host/put', (request, response, next) =>{
            this.host.upDateData(request.body, response, next)
        })

        this.app.post('/host/post', (request, response, next) => {
            console.log(request.body)
            this.host.addData(request.body, response, next)
        })

        /**
         * @description 拿到FormData上传的参数
         * @author zengwei
         */

        this.app.post('/upload', multipartMiddleware, function (request, response, next) {
            console.log(request.body, request.files)
        })
    }
}