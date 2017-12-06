/**
 * @author zengwei
 * @since 2017/11/15
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