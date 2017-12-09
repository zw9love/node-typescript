interface postData {
    page?: {
        pageNumber?: number | string
        pageSize?: number | string
    }
    row?: {
        host_ids?: string
        hostIds?: string
    }
}

interface rowPage {
    where: string
    limit: string
    page?: {
        pageNumber?: number | string
        pageSize?: number | string
    }
    row?: {
        host_ids?: string
        hostIds?: string
    }
}

interface response {
    send: Function
    header: Function
}

interface request {
    headers?:{
        token?:string
    }
    session?: {
        token?: string
        role?: object
        count?: number,
        userData?:Array<{
            token?: string
            role?: object
            count?: number,
        }>
    }
}


export {
    postData,
    rowPage,
    response,
    request,
}