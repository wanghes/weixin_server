let fs = require("fs");
let https = require('https');
let crypto = require('crypto');
let request = require('../util/https')


class Jsapi {
    constructor(appId, appSecret) {
        this.appId = appId;
        this.appSecret = appSecret;
    }

     // 查看摇一摇周边申请情况结果
    async getOpenIdByCode(code) {
    	let JSCODE = code;
       
        let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${this.appId}&secret=${this.appSecret}&js_code=${JSCODE}&grant_type=authorization_code?`;
        var result = await request.requestGet(url)
        return result;
    }
    
}


module.exports = Jsapi;