const crypto = require('crypto');
const encryptoKey = "map_weixin";

const encryptoSha1 = (pass) =>{
	const sha1 = crypto.createHash('sha1');
	sha1.update(pass);
	return sha1.digest('hex')
}

const key = Buffer.from('9vApxLk5G3PAsJrM', 'utf8');
const iv = Buffer.from('FnJL7EDzjqWjcaY9', 'utf8');

// 加密
function aesEncode(src) {
    let sign = '';
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    sign += cipher.update(src, 'utf8', 'hex');
    sign += cipher.final('hex');
    return sign;
}

// 解密
function aesDecode(sign) {
    let src = '';
    const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    src += cipher.update(sign, 'hex', 'utf8');
    src += cipher.final('utf8');
    return src;
}


module.exports = {
    encryptoSha1,
    aesEncode,
    aesDecode
}