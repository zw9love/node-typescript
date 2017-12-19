var redis = require("redis"),
    client = redis.createClient();

// console.log(client)
// 每次服务器启动会产生一个session，而这个sessionID是在服务器运行期间是不会再发生变化的
// if (!req.session) {
//     return next(new Error('oh no')) // handle error
// }
// // console.log(req)
// let id = req.session.id

// let client = req.sessionStore.client
// // redis.flushdb()
// let store = req.sessionStore
// // console.log(store)
// store.get(id, (error, session)=>{
//     if(error) return
//     // console.log(session)
// })

// this key will expire after 10 seconds
// client.set('key', 'value!', 'EX', 10);
// client.set('string key', 'value!', 'EX', 10);
// client.set('hash key', 'value!', 'EX', 10);

// console.log(req.sessionStore.client)

// 设置键值
// client.set("Testing", "hellow redis100", 'EX', 10);

// // // 取值
// client.get("Testing", function (err, replies) {
//     console.log(replies)
// });

// console.log(client.get("dsadsadsadsadsad"))

// client.del('aaa', function (err, reply) {
//     if (err) return false;
//     console.log(reply);     // 删除成功，返回1，否则返回0(对于不存在的键进行删除操作，同样返回0)
// });


// 枚举趣出数据库中的所有键
client.keys('*', function (err, keys) {
    keys.forEach(e => {
        client.del(e)
    })
    console.log(keys)
});