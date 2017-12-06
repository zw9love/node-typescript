/**
 * @author zengwei
 * @since 2017/11/15
 */

function getJson(msg: string = '', status: number, data: string = null) :object{
    let json = {
        data: data,
        msg: msg,
        status: status
    }
    return json
}

// export default {
//     getJson
// }

// exports = module.exports =  {
//     getJson
// }

// export = {
//     getJson
// }

export {
    getJson
}