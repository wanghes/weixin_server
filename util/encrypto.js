const crypto = require('crypto');
const encryptoKey = "map_weixin";

const encryptoSha1 = (pass) =>{
	const sha1 = crypto.createHash('sha1');
	sha1.update(pass);
	return sha1.digest('hex')
}

// 创建对称加密 加密算法
const aesEncode = (data, key = encryptoKey) => {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
// 创建对称加密 解密算法
const aesDecode = (encrypted, key = encryptoKey) => {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = {
    encryptoSha1,
    aesEncode,
    aesDecode
}