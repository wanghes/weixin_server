const express = require('express'), //express 框架 
    crypto = require('crypto'), //引入加密模块
    Jsapi = require("./wechatApi/wechat_jsapi"), //Wechat JS-API接口
    https = require('./util/https'),
    config = require('./config'); //引入配置文件
const cors = require('cors');
const bodyParser = require('body-parser');
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');

const encrypto = require('./util/encrypto.js');
const { aesEncode,aesDecode } = encrypto;

var user = {
    id: 1,
    name: "admin",
    password: "eba1279512c5eb143f1b75e73e6e5e9e"
}

var secretOrPrivateKey = "map_weixin";

var app = express(); //实例express框架

//实例Jsapi
var jssdk = new Jsapi(config.appID, config.appScrect);

app.use(cors());
// 解析 application/json
app.use(bodyParser.json()); 
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

app.use(expressJWT({
    secret: secretOrPrivateKey
}).unless({
    path: ['/', '/wxJssdk/public','/api/admin/login', '/getAccessToken','/jssdk','/oauth']  //除了这个地址，其他的URL都需要验证
}));

//静态文件伺服
app.use('/wxJssdk/public', express.static('public'));

app.use(function (err, req, res, next) {
    console.log(err)
    if (err.name === 'UnauthorizedError') {   
        //  这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
        res.status(401).send('invalid token...');
    } else {
        res.status(500).send(err);
    }
});

const getToken = (name, password, id) =>{
	return new Promise((resolve, reject) =>{
		let data = { name, password, id };
		jwt.sign(data, secretOrPrivateKey,  { expiresIn: 60 * 60 * 24 * 3}, (err, token) => { //登录token设置24小时过期时间
			if(err) {
				reject(err);
			}else{
				resolve(token);
			}
		});
	})
}

app.post('/api/admin/login', function(req,res) {
    let name = req.body.name;
	let password = req.body.password;
    let db_pass = aesDecode(user.password);
    if(db_pass == password){
        getToken(name, password, user.id).then((token) => {
            res.send({
                code:0,
                token,
                user:{
                    name: user.name
                },
                msg:"登录成功！"
            });
        }).catch((err)=>{
            console.log(err)
        });
    }else{
        res.send({
            code:1,
            msg:"密码不正确！"
        });
    }
});

//用于处理所有进入 3000 端口 get 的连接请求
app.get('/', function(req, res) {
    //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
    var signature = req.query.signature, //微信加密签名
        timestamp = req.query.timestamp, //时间戳
        nonce = req.query.nonce, //随机数
        echostr = req.query.echostr; //随机字符串

    //2.将token、timestamp、nonce三个参数进行字典序排序
    var array = [config.token, timestamp, nonce];
    array.sort();

    //3.将三个参数字符串拼接成一个字符串进行sha1加密
    var tempStr = array.join('');
    const hashCode = crypto.createHash('sha1'); //创建加密类型 
    var resultCode = hashCode.update(tempStr, 'utf8').digest('hex'); //对传入的字符串进行加密

    //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if (resultCode === signature) {
        res.send(echostr);
    } else {
        res.send('mismatch');
    }
});

//用于请求获取 access_token
app.get('/getAccessToken', function(req, res) {
    jssdk.getAccessToken().then(
        re => res.send({
            "code": 0,
            "message": "ok",
            "data": {
                "access-token": re
            }
        })
    ).catch(
        err => res.send({
            "code": 1,
            "message": "err",
            "err": err
        }));
});

//用于JS-SDK使用权限签名算法
app.get('/jssdk', function(req, res) {
    //获取传入的url
    let url = req.query.url;
    //使用签名算法计算出signature
    jssdk.getSignPackage(url).then(
        re => {
            return res.send({
                "code": 0,
                "message": "ok",
                "data": re
            })
        }
    ).catch(err => res.send({
        "code": 1,
        "message": "err",
        "err": err
    }));
});

//微信网页授权
app.get("/oauth", (req, res) => {
    //没有code就跳转去授权
    if (!req.query.code) {
        let redirect_uri = `http://${req.hostname}${req.path}`;
        res.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appID}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect`)
        return;
    }
    //获取code值
    let code = req.query.code;
    //通过code换取网页授权access_token
    https.requestGet(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.appID}&secret=${config.appScrect}&code=${code}&grant_type=authorization_code`).then(function(data) {
        let {
            access_token,
            openid
        } = JSON.parse(data);
        //拉取用户信息
        https.requestGet(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`).then(result => {
            res.send(result);
        });
    })
});

app.get('/api/getMenus', (req, res) => {
    var result = jssdk.getMenus(); 
    result.then(function(data) {
        res.send(data);
    }, function(err) {
        console.log(err);
        res.send({
            "code": 1,
            "message": "err",
            "err": err
        });
    });
});

app.post('/api/setMenus', (req, res) => {
    let data = req.body.data;
    // var data = {
    //     'button': [{
    //             'type': 'view',
    //             'name': '智慧巡店',
    //             'key': 'V1001_WISDOM_FIND_SHOP',
    //             "url": "http://www.soso.com/"
    //         },
    //         {
    //             'type': 'view',
    //             'name': '帮你寻车',
    //             'key': 'V1001_HELP_YOU_FIND_CAR',
    //             "url": "http://www.soso.com/"
    //         }
    //     ]
    // };

    // data = JSON.stringify(data);
    var result = jssdk.setMenus(data);
    result.then(function(data) {
        res.send(data);
    }, function(err) {
        res.send(err);
    });
});


//监听3000端口
app.listen(3000);