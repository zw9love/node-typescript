// child_process 执行命令行的工具
let child_process = require('child_process')
// var workerProcess = child_process.exec('node -v', // 查看node版本
// var workerProcess = child_process.exec('pm2 flush', // 刷新pm2日志
var workerProcess = child_process.exec('node ../test.js', // 运行文件，路径是项目根路径
    function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
        }
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
    });

workerProcess.on('exit', function (code) {
    console.log('子进程已退出，退出码 ' + code);
});