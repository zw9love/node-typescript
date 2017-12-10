/**
 * @author zengwei
 * @since 2017/12/08
 */

 /**
  * @description 过滤值
  * @param val 穿入值
  */
function autoGetData(val: any): any{
    if (val !== undefined && val !== null) {
        return val
    } else {
        return ''
    }
}

export {
    autoGetData
}