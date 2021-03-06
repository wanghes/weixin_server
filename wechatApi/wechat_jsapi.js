//用于管理和获取微信 JSSDK 生产的access_token、jsapi_ticket和签名（signature）
let fs = require("fs");
let https = require('https');
let crypto = require('crypto');
let request = require('../util/https')

class Jsapi {
    constructor(appId, appSecret) {
        this.appId = appId;
        this.appSecret = appSecret;
    }

    //生成16位随机字符串
    _createNonceStr(length = 16) {
        let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let str = "";
        for (let i = 0; i < length; i++) {
            str += chars.charAt(Math.floor(Math.random() * 62));
        }
        return str;
    }

    // access_token 应该全局存储与更新，这里写入到文件中
    _setAccessToken(filename) {
        return new Promise((resolve, reject) => {
            let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`;
            //向微信服务器发送请求
            https.get(url, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(data) {
                    if (data) {
                        data = JSON.parse(data);

                        //如果微信返回错误
                        if (data.errcode) {
                            return reject(new Error(data.errmsg));
                        }

                        const access_token = data.access_token;

                        if (!access_token) {
                            return reject(new Error("getAccessToken 请求返回数据没有access_token"));
                        }

                        let insert_data = {
                            "expire_time": new Date().getTime() + 7000 * 1000,
                            "access_token": access_token
                        };

                        //获得的access_token写入文件
                        fs.writeFile(filename, JSON.stringify(insert_data), function(err) {
                            if (err) {
                                return reject(new Error("access_token写入文件失败"));
                            }
                            //成功后返回access_token
                            return resolve(access_token);
                        });

                    } else {
                        return reject(new Error("getAccessToken xxwxw"));
                    }

                });
            }).on("error", function(err) {
                return resolve(err);
            });
        });
    }

    //获取access_token
    getAccessToken() {
        let that = this;
        return new Promise(function(resolve, reject) {
            let filename = 'access_token.json';
            //判断access_token.json是否存在
            fs.exists(filename, async function(exist) {
                //不存在,去获取access_token
                if (!exist) {
                    try {
                        let access_token = await that._setAccessToken(filename);
                        return resolve(access_token);
                    } catch (err) {
                        return reject(err);
                    }

                } else {
                    //存在，直接读取access_token.json
                    fs.readFile(filename, async function(err, data) {
                        let access_token;
                        if (err) {
                            return reject(err);
                        }
                        try {
                            data = JSON.parse(data);
                            if (data && data.expire_time) {
                                if (data.expire_time < new Date().getTime()) {
                                    try {
                                        access_token = await that._setAccessToken(filename);
                                    } catch (err) {
                                        return reject(err);
                                    }
                                } else {
                                    access_token = data.access_token;
                                }
                            } else {
                                try {
                                    access_token = await that._setAccessToken(filename);
                                } catch (err) {
                                    return reject(err);
                                }
                            }
                        } catch (err) {
                            try {
                                access_token = await that._setAccessToken(filename);
                            } catch (err) {
                                return reject(err);
                            }
                        }
                        return resolve(access_token);
                    });
                }
            });
        });
    }

    // jsapi_ticket 应该全局存储与更新，这里写入到文件中
    _setJsApiTicket(filename) {
        let that = this;
        return new Promise(async function(resolve, reject) {
            let access_token;
            try {
                access_token = await that.getAccessToken();
            } catch (err) {
                return reject(err);
            }

            let url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;

            https.get(url, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(data) {
                    if (data) {
                        data = JSON.parse(data);

                        //如果微信返回错误
                        if (data.errcode) {
                            return reject(new Error(data.errmsg));
                        }

                        const jsapi_ticket = data.ticket;

                        if (!jsapi_ticket) {
                            return reject(new Error("getJsApiTicket 请求返回数据没有jsapi_ticket"));
                        }

                        let insert_data = {
                            "expire_time": new Date().getTime() + 7000 * 1000,
                            "jsapi_ticket": jsapi_ticket
                        };

                        //获得的access_token写入文件
                        fs.writeFile(filename, JSON.stringify(insert_data), function(err) {
                            if (err) {
                                return reject(new Error("jsapi_ticket写入文件失败"));
                            }
                            //成功后返回access_token
                            return resolve(jsapi_ticket);
                        });
                    } else {
                        return reject(new Error("getJsApiTicket 请求返回数据为空"));
                    }

                });
            }).on("error", function(err) {
                return resolve(err);
            });
        });
    }

    //获取jsapi_ticket
    getJsApiTicket() {
        let that = this;
        return new Promise(async function(resolve, reject) {
            let filename = 'jsapi_ticket.json';
            // 获取jsapi_ticket.json是否存在
            fs.exists(filename, async function(exist) {
                // 不存在,获取jsapi_ticket
                if (!exist) {
                    let jsapi_ticket;
                    try {
                        jsapi_ticket = await that._setJsApiTicket(filename);
                        return resolve(jsapi_ticket);
                    } catch (err) {
                        return reject(err);
                    }
                } else {
                    // 存在，直接读取jsapi_ticket.json 异步读取
                    fs.readFile(filename, async function(err, data) {
                        let jsapi_ticket = "";
                        if (err) {
                            return reject(err);
                        }

                        try {
                            data = JSON.parse(data);
                            if (data && data.expire_time) {
                                if (data.expire_time < new Date().getTime()) {
                                    try {
                                        jsapi_ticket = await that._setJsApiTicket(filename);
                                    } catch (err) {
                                        reject(err);
                                    }
                                } else {
                                    jsapi_ticket = data.jsapi_ticket;
                                }
                            } else {
                                try {
                                    jsapi_ticket = await that._setJsApiTicket(filename);
                                } catch (err) {
                                    reject(err);
                                }
                            }
                        } catch (err) {
                            try {
                                jsapi_ticket = await that._setJsApiTicket(filename);
                            } catch (err) {
                                reject(err);
                            }
                        }
                        return resolve(jsapi_ticket);
                    });
                }
            });
        });
    }

    // 获取签名信息
    async getSignPackage(url) {
        let jsapiTicket;

        try {
            jsapiTicket = await this.getJsApiTicket();
        } catch (err) {
            throw err;
        }

        let timestamp = Math.round(new Date().getTime() / 1000);
        let nonceStr = this._createNonceStr();

        // 这里参数的顺序要按照 key 值 ASCII 码升序排序
        let string = `jsapi_ticket=${jsapiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;

        var sha1 = crypto.createHash('sha1');
        sha1.update(string, 'utf8');
        let signature = sha1.digest('hex');

        let signPackage = {
            "appId": this.appId,
            "nonceStr": nonceStr,
            "timestamp": timestamp,
            "signature": signature
        };
        return signPackage;
    }

    async getMenus() {
        let access_token;
        try {
            access_token = await this.getAccessToken();
        } catch (err) {
            throw err;
        }

        let url = `https://api.weixin.qq.com/cgi-bin/get_current_selfmenu_info?access_token=${access_token}`;
        var result = await request.requestGet(url)
        return result;
    }

    async setMenus(data) {
        let access_token;
        try {
            access_token = await this.getAccessToken();
        } catch (err) {
            throw err;
        }
        let url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`;
        
        var result = await request.requestPost(url, data)
        return result;
    }
    
    async getFlowers() {
        let access_token;
        try {
            access_token = await this.getAccessToken();
        } catch (err) {
            throw err;
        }
        let url = `https://api.weixin.qq.com/cgi-bin/user/get?access_token=${access_token}`;
        var result = await request.requestGet(url)
        return result;

    }


    async getUserInfo(openId) {
        let access_token;
        try {
            access_token = await this.getAccessToken();
        } catch (err) {
            throw err;
        }
        let url = ` https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${openId}&lang=zh_CN`;
        var result = await request.requestGet(url)
        return result;

    }

    // 查看摇一摇周边申请情况结果
    async getShakearound() {
        let access_token;
        try {
            access_token = await this.getAccessToken();
        } catch (err) {
            throw err;
        } 
        let url = ` https://api.weixin.qq.com/shakearound/account/auditstatus?access_token=${access_token}`;
        var result = await request.requestGet(url)
        return result;
    }
    
    // 查看设备审核状态
    async getShakearoundDevices(data) {
        let access_token;
        try {
            access_token = await this.getAccessToken();
        } catch (err) {
            throw err;
        } 

        let url = `https://api.weixin.qq.com/shakearound/device/applystatus?access_token=${access_token}`;
        var result = await request.requestPostJson(url, JSON.stringify(data));

        return result;
    }

    async setBeaconsGroup(data) {
        let access_token;
        try {
            access_token = await this.getAccessToken();
        } catch (err) {
            throw err;
        } 

        let url = `https://api.weixin.qq.com/shakearound/device/group/add?access_token=${access_token}`;
        var result = await request.requestPostJson(url, JSON.stringify(data));

        return result;
    }

    async editBeaconsGroup(data) {
        let access_token;
        try {
            access_token = await this.getAccessToken();
        } catch (err) {
            throw err;
        } 

        let url = `https://api.weixin.qq.com/shakearound/device/group/update?access_token=${access_token}`;
        var result = await request.requestPostJson(url, JSON.stringify(data));

        return result;
    }

    async getBeaconsGroup(data) {
        let access_token;
        try {
            access_token = await this.getAccessToken();
        } catch (err) {
            throw err;
        } 
        let url = `https://api.weixin.qq.com/shakearound/device/group/getlist?access_token=${access_token}`;
        var result = await request.requestPostJson(url, JSON.stringify(data));

        return result;
    }

    async addH5Beacon(data) { 
        let access_token;
        try {
            access_token = await this.getAccessToken();
        } catch (err) {
            throw err;
        } 
        let url = `https://api.weixin.qq.com/shakearound/device/group/adddevice?access_token=${access_token}`;
        var result = await request.requestPostJson(url, JSON.stringify(data));

        return result;
    }

    async deleteBeaconsGroup(data) {
        let access_token;
        try {
            access_token = await this.getAccessToken();
        } catch (err) {
            throw err;
        } 
        let url = `https://api.weixin.qq.com/shakearound/device/group/delete?access_token=${access_token}`;
        var result = await request.requestPostJson(url, JSON.stringify(data));

        return result;
    }

    async getBeaconsByGroupId(data) {
        let access_token;
        try {
            access_token = await this.getAccessToken();
        } catch (err) {
            throw err;
        } 
        let url = `https://api.weixin.qq.com/shakearound/device/group/getdetail?access_token=${access_token}`;
        var result = await request.requestPostJson(url, JSON.stringify(data));

        return result;
    }

}


module.exports = Jsapi;