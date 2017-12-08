/**
 * Created by zw9love on 2017/12/08.
 */

require('shelljs/global')
var webpack = require('webpack');
var path = require('path')


module.exports = {
    target: 'node',
    // eval-source-map
    devtool: 'cheap-module-eval-source-map',//配置生成Source Maps，选择合适的选项
    // entry: __dirname + '/src/main.js',//已多次提及的唯一入口文件
    entry: __dirname + '/build/index.js',//已多次提及的唯一入口文件
    /*
     output: {
     path: path.resolve(__dirname, './webapp/static'),//打包后的文件存放的地方
     // publicPath: './static',
     filename: "js/bundle.js"//打包后输出文件的文件名
     },
     */
    output: {
        path: path.resolve(__dirname, './public'),//打包后的文件存放的地方
        // publicPath: './static',
        filename: "appServer.js"//打包后输出文件的文件名
    },
    module: {//在配置文件里添加JSON loader
        rules: [
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',//在webpack的module部分的loaders里进行配置即可
            }
        ]
    },
    plugins: [
        
    ]
}


if (process.env.NODE_ENV === 'production') {

    var assetsStatic = 'static'
    var assetsView = 'view'

    /* 拼接编译输出文件路径 */
    var root = path.resolve(__dirname, './webapp/')
    var assetsStaticPath = path.join(path.resolve(__dirname, './webapp/'), assetsStatic)
    var assetsViewPath = path.join(path.resolve(__dirname, './webapp/'), assetsView)
    // var assetsPath = path.resolve(__dirname, './webapp/')
    /* 删除这个文件夹 （递归删除） */
    rm('-rf', root)
    /* 创建此文件夹 */
    mkdir('-p', root)
    /* 复制 static 文件夹到我们的编译输出目录 */
    cp('-R', 'static', root)
    // console.log(assetsViewPath)
    cp('-R', 'view', root)

    // '#source-map'
    module.exports.devtool = false
    module.exports.output = {
        path: path.resolve(__dirname, './webapp/'),//打包后的文件存放的地方
        publicPath: './',
        // filename: "/js/bundle.js"// 打包后输出文件的文件名
        // filename: path.posix.join(assetsSubDirectory, 'node/index.js')
        filename: path.posix.join('index.js')
    }

    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ])
}