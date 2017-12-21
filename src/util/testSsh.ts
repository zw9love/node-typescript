// import os = require('os')
// let os = require('os')
// console.log(os.platform()) // 操作系统类型
// console.log(os.EOL) // 操作系统相关的行末标志
// console.log(os.arch()) // 操作系统CPU架构
// console.log(os.constants) // 操作系统错误代码、处理信号灯常用的常量对象
// console.log(os.cpus()) // 操作系统包含安装的每个CPU和CPU核信息
// console.log(os.freemem()) // 空闲系统内存的字节数

const Client = require('ssh2').Client;
const conn = new Client();
const fs = require('fs')
conn.on('ready', function () {
    // console.log('Client :: ready');
    console.log('进入了ready钩子函数')

    // 读取局域网系统文件
    // conn.sftp(function (err, sftp) {
    //     if (err) throw err;
    //     let start = new Date().getTime()
    //     fs.createReadStream('C:/files/xmind-3.7.5.201709290120.exe').pipe(sftp.createWriteStream('/demo/xmind-3.7.5.hehe12.exe'))
    //     // fs.createReadStream('C:/files/xmind-3.7.5.201709290120.exe').pipe(fs.createWriteStream('C:/files/xmind-3.7.5.hehe111.exe'))
    //     let end = new Date().getTime()
    //     console.log((end - start) + '毫秒')
    //     conn.end()
        // 创建目录
        // sftp.mkdir('/demo/files', err => {
        //     if(err) console.log(err)
        //     console.log('目录创建成功')
        //     conn.end()
        // })

        // 把本地文件写入局域网系统里面
        // fs.readFile('C:/files/xmind-3.7.5.201709290120.exe', function (err, data) {
        //     if (err) return console.error(err);
        //     // console.log("异步读取文件数据: " + data.toString());
        //     sftp.writeFile('/demo/xmind-3.7.5.201709290120.exe', data.toString(), function (err, data) {
        //         if (err) return console.error(err);
        //         console.log("数据写入成功！");
        //         conn.end()
        //     })
        // });

        // sftp.readFile('/demo/1.txt', function (err, data) {
        //     if (err) return console.error(err);
        //     console.log("异步读取: " + data.toString());
        //     conn.end();
        // })
        // sftp.stat('/demo/1.txt', (err, stats)=>{
        //     console.log(stats.isFile());
        //     conn.end();
        // })
        // sftp.readdir('/demo', function (err, list) {
        //     if (err) throw err;
        //     console.dir(list);
        //     conn.end();
        // })
    // });

    // 进入正常执行
    conn.exec('uptime', function (err, stream) {
        if (err) throw err;
        stream.on('close', function (code, signal) {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            console.log('连接关闭')
            conn.end();
        }).on('data', function (data) {
            console.log('STDOUT: ' + data);
            console.log('拿到数据')
        }).stderr.on('data', function (data) {
            console.log('STDERR: ' + data);
            console.log('出现错误')
        });
    });
}).on('error', function (err) {
    console.log('连接失败')
}).connect({
    host: '192.168.0.140',
    port: '22',
    username: 'root',
    // privateKey: '6350238ll'
    password: '6350238ll'
});


// let start = new Date().getTime()
// // fs.writeFileSync('C:/files/web-learn2.txt', fs.readFileSync('C:/files/web-learn.txt'));
// fs.createReadStream('C:/files/xmind-3.7.5.201709290120.exe').pipe(fs.createWriteStream('C:/files/xmind-3.7.5.hehe.exe'))
// let end = new Date().getTime()
// console.log((end - start) / 1000 + '秒')