/**
 * @author zengwei
 * @since 2017/12/08
 */

/**
 * @description 过滤值
 * @param val 穿入值
 */
function autoGetData(val: any): any {
    if (val !== undefined && val !== null) {
        return val
    } else {
        return ''
    }
}

/**
 * @description 过滤成计算单位值
 * @param data 传入需要计算的数值
 */
function countData(data: string | number): string {
    let val  = ~~data
    // 如果是KB以上
    if (val > 1024) {
        val = parseFloat((val / 1024).toFixed(2))
        // 如果是MB以上
        if (val > 1024) {
            val = parseFloat((val / 1024).toFixed(2))
            // 如果是GB以上
            if (val > 1024) {
                val = parseFloat((val / 1024).toFixed(2))
                return val + ' GB'
            } else {
                return val + ' MB'
            }
        } else {
            return val + ' KB'
        }
    } else {
        return val + ' B'
    }
}

/**
 * @description 格式化日期
 * @param date 日期对象
 * @param fmt 格式化规则
 */
function formatData(date: Date, fmt:string):string{
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export {
    autoGetData,
    countData,
    formatData
}