/**
 * @description 分页格式
 */
interface postData {
    page?: {
        pageNumber?: number | string
        pageSize?: number | string
    }
    row?: {
        host_ids?: string
        hostIds?: string
    }
    size?: {}
}


/**
 * @description response响应体格式
 */
interface response {
    send: Function
    header: Function
}


/**
 * @description request请求体格式
 */
interface request {
    headers?: {
        token?: string
    }
    session?: {
        token?: string
        role?: object
        count?: number,
        userData?: Array<{
            token?: string
            role?: object
            count?: number,
        }>
    }
}

/**
 * @description 登录数据格式体
 */
interface loginData {
    login_name: string
    login_pwd: string
    username?: string
}



export {
    postData,
    response,
    request,
    loginData,
}