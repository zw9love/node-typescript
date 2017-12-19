import redis = require('redis')

export default class Redis {
    public static client : any = redis.createClient()
    public static expired : string | number = 3600
}