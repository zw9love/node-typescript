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
        process_ids?: string
        object_ids?: string
        pelfstatus?: string
        platformIds?: string
        type?: string | number
        labelType?: string
    }
    size?: any,
    query?: any,
    sort?: any,
    username?:string
    email?:string
    login_name?:string
    ids?:string,
    type?:string | number
    userIds?:string
}


/**
 * @description response响应体格式
 */
interface response {
    send: Function
    header: Function
    json: Function
    download: Function
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
        role?: loginData
        count?: number,
        userData?: Array<{
            token?: string
            role?: object
            count?: number,
        }>
        id?:String
        store?:any
    },
    body: postData
    params: {
        type?: string | number
    }
    files?: any
    file?: any
    store?:any
}

/**
 * @description 登录数据格式体
 */
interface loginData {
    login_name?: string
    login_pwd?: string
    username?: string
    ids?: string
    email?: string
}

/**
 * @description 主机模块数据格式
 */
interface moduleObj {
    host_ids: string
    ids: string
    type: number
    status: number
}



export {
    postData,
    response,
    request,
    loginData,
    moduleObj
}