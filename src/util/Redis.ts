import redis = require('redis')

export default class Redis {
    public static client : any = redis.createClient()
}