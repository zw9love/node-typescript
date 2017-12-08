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


export {
    postData,
    rowPage
}