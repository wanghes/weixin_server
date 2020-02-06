const express = require('express'); 
const crypto = require('crypto');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const Jsapi = require("./wechatApi/wechat_jsapi");
const https = require('./util/https');
const config = require('./config'); //引入配置文件
const encrypto = require('./util/encrypto.js');
const ejs = require('ejs');
// const BeaconScanner = require('node-beacon-scanner');
// var noble = require('noble');

const { aesEncode, aesDecode } = encrypto;

var user = {
    id: 1,
    name: "admin",
    password: "eba1279512c5eb143f1b75e73e6e5e9e"
};
//实例Jsapi
var jssdk = new Jsapi(config.appID, config.appScrect);


var app = express(); //实例express框架

app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded());

app.use(expressJWT({
    secret: config.secretOrPrivateKey
}).unless({
    //除了这个地址，其他的URL都需要验证
    path: [
        '/', 
        '/wxJssdk/public',
        '/wxJssdk/public/js/jquery.min.js',
        '/wxJssdk/public/js/jweixin-1.4.0.js',
        '/api/admin/login', 
        '/getAccessToken', 
        '/test.html', 
        '/jssdk', 
        '/oauth', 
        '/test2',
        '/MP_verify_yYJFWLcuKfeZ0hFY.txt'
    ]
}));

app.engine('html', ejs.__express);
app.set('view engine', 'html');
//静态文件伺服
app.use('/wxJssdk/public', express.static('public'));
app.use('/', express.static('public'));
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {   
        res.status(401).send('invalid token...');
    } else {
        res.status(500).send(err);
    }
});

const getToken = (name, password, id) =>{
	return new Promise((resolve, reject) =>{
        let data = { name, password, id };
        //登录token设置小72时过期时间
		jwt.sign(data, config.secretOrPrivateKey,  { expiresIn: 60 * 60 * 24 * 3}, (err, token) => { 
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
                message:"登录成功！",
                "data": {
                    token,
                    user:{
                        name: user.name
                    },
                }
            });
        }).catch((err) =>{
            res.send({
                "code": 1,
                "message": "err",
                "err": err.toString()
            })
        });
    }else{
        res.send({
            "code": 1,
            "message": "密码不正确！",
            "err": "err"
        });
    }
});


app.get('/test2', function(req, res) {
//     const scanner = new BeaconScanner();
//     // Set an Event handler for becons
   
// // Set an Event handler for becons
// scanner.onadvertisement = (ad) => {
//   console.log(JSON.stringify(ad, null, '  '));
// };

// // Start scanning
// scanner.startScan().then(() => {
//   console.log('Started to scan.')  ;
// }).catch((error) => {
//   console.error(error);
// });
 

    noble.on('discover', function(peripheral){
        console.log(peripheral);
    });
    res.render('index.ejs', {title: '测试页面'});
});


//用于处理所有进入get的连接请求
app.get('/', function(req, res) {
    var signature = req.query.signature,
        timestamp = req.query.timestamp,
        nonce = req.query.nonce,
        echostr = req.query.echostr;

    var array = [config.token, timestamp, nonce];
    array.sort();

    var tempStr = array.join('');
    const hashCode = crypto.createHash('sha1');
    var resultCode = hashCode.update(tempStr, 'utf8').digest('hex');

    if (resultCode === signature) {
        res.send(echostr);
    } else {
        res.send('mismatch');
    }
});

//用于请求获取access_token
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
    let url = req.query.url;
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
        res.send({
            "code": 0,
            "message": "ok",
            "data": data
        });
    }, function(err) {
        res.send({
            "code": 1,
            "message": "err",
            "err": err.toString()
        });
    });
});

app.post('/api/setMenus', (req, res) => {
    let data = req.body.data;
    var result = jssdk.setMenus(data);
    result.then(function(data) {
        res.send(data);
        res.send({
            "code": 0,
            "message": "ok",
            "data": data
        });
    }, function(err) {
        res.send({
            "code": 1,
            "message": "err",
            "err": err.toString()
        });
    });
});

app.get('/api/getFlowers', (req,res) =>{
    var result = jssdk.getFlowers(); 
    result.then(function(data) {
        res.send({
            "code": 0,
            "message": "ok",
            "data": data
        });
    }, function(err) {
        res.send({
            "code": 1,
            "message": "err",
            "err": err.toString()
        });
    });
});

app.get('/api/getUserInfo/:openId', (req,res) =>{
    var openId = req.params.openId;
    var result = jssdk.getUserInfo(openId);
    result.then(function(data) {
        res.send({
            "code": 0,
            "message": "ok",
            "data": data
        });
    }, function(err) {
        res.send({
            "code": 1,
            "message": "err",
            "err": err.toString()
        });
    });
});

app.get('/api/getShakearound', (req,res) => {
    var result = jssdk.getShakearound();
    result.then(function(data) {
        res.send({
            "code": 0,
            "message": "ok",
            "data": data
        });
    }, function(err) {
        res.send({
            "code": 1,
            "message": "err",
            "err": err.toString()
        });
    });
});

app.post('/api/getShakearoundDevices', (req, res) => {
    let data = req.body;
    var result = jssdk.getShakearoundDevices(data);
    result.then(function(data) {
        res.send({
            "code": 0,
            "message": "ok",
            "data": data
        });
    }, function(err) {
        res.send({
            "code": 1,
            "message": "err",
            "err": err.toString()
        });
    });
});




//监听3000端口
app.listen(80, '0.0.0.0', () => {
    console.log('server is running');
});