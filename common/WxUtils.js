const axios = require('axios');
const crypto = require('crypto');
const { AppID, AppSecret } = require('../config');
const WXBizDataCrypt = require('./WXBizDataCrypt');

const instance = axios.create({
    timeout: 30000
});

// 获取session_key，openid等
const wxGetOpenData = async code => {
    const obj = await instance.get(
        `https://api.weixin.qq.com/sns/jscode2session?appid=${AppID}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`
    );
    return obj.data;
};
// module.exports.wxGetOpenData = wxGetOpenData;

// 获取用户信息
module.exports.wxGetUserInfo = async (user, code) => {
    // 1.获取用户的openData -> session_key
    const data = await wxGetOpenData(code);
    // 说明微信API请求成功，返回用户session_key
    const { session_key: sessionKey } = data;
    if (sessionKey) {
        // setValue(obj.data.openId, sessionKey)
        // 2.用户数据进行签名校验
        const { rawData, signature, encryptedData, iv } = user;
        const sha1 = crypto.createHash('sha1');
        sha1.update(rawData);
        sha1.update(sessionKey);
        if (sha1.digest('hex') !== signature) {
            return Promise.reject(
                new Error({
                    code: 500,
                    msg: '签名校验失败，请检查 '
                })
            );
        }
        const wxBizDataCrypt = new WXBizDataCrypt(AppID, sessionKey);
        // 3.解密用户数据
        const userInfo = wxBizDataCrypt.decryptData(encryptedData, iv);
        return { ...userInfo, ...data, errcode: 0 };
    } else {
        return data;
    }
};
