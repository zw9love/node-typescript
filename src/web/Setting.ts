/**
 * @author zengwei
 * @since 2017/12/12
 */
import { postData, response } from '../interface/index'
import { getJson } from '../util/index'
import Service  from '../service/Setting'
export default class Setting {
    public service = new Service()
    constructor(){}
    getData(postData: postData, response: response, next: Function): void {
        this.service.getData(postData, res => {
            response.send(JSON.stringify(getJson('成功',200, res)));
        },next)
    }
}