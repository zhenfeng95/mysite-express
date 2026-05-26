var express = require('express');
var router = express.Router();

const { getCaptchaService } = require('../service/captchaService');
const { formatResponse } = require('../utils/tool');

// 生成一个验证码（SVG base64，可直接用于 img src）
router.get('/', async function (req, res, next) {
    const captcha = await getCaptchaService();
    req.session.captcha = captcha.text;
    res.send(formatResponse(0, '', { captchaBase64: captcha.image }));
});

module.exports = router;
