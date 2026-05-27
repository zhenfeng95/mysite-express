var express = require('express');
var router = express.Router();
var { formatResponse, analysisToken } = require('../utils/tool');

const { loginService, updateAdminService, logoutService } = require('../service/adminService');
const { ValidationError } = require('../utils/errors');

const { wxGetUserInfo } = require('../common/WxUtils');

router.post('/login', async function (req, res, next) {
    // 首先应该有一个验证码的验证
    if (req.body.captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
        // 说明是有问题的，用户输入的验证码不正确
        throw new ValidationError('验证码错误');
    }

    const result = await loginService(req.body);
    if (result.token) {
        res.setHeader('authentication', result.token);
        result.data.accessToken = result.token;
    }
    if (result.data) {
        res.send(formatResponse(0, '登录成功', result.data));
    } else {
        res.send(formatResponse(1, '登录失败', result.data));
    }
});

// 退出登录
router.delete('/logout', async function (req, res, next) {
    await new Promise((resolve, reject) => {
        req.session.destroy((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
    res.setHeader('authentication', '');
    res.send(logoutService());
});

// 恢复登录状态
router.get('/whoami', async function (req, res, next) {
    // 1. 从客户端的请求拿到 token，然后解析 token，还原成有用的信息
    const token = analysisToken(req.get('Authorization'));
    // 2. 返回给客户端
    res.send(
        formatResponse(0, '', {
            loginId: token.loginId,
            name: token.name,
            id: token.id,
            roles: ['ADMIN'],
            perms: [
                'sys:tenant-plan:update',
                'sys:dept:update',
                'sys:tenant-plan:list',
                'sys:user:create',
                'sys:config:refresh',
                'sys:user:export',
                'sys:dept:delete',
                'sys:config:update',
                'sys:tenant-plan:delete',
                'sys:tenant:delete',
                'sys:dict:create',
                'sys:notice:revoke',
                'sys:notice:list',
                'sys:dept:list',
                'sys:tenant:update',
                'sys:role:list',
                'sys:dict-item:create',
                'sys:notice:update',
                'sys:notice:delete',
                'sys:tenant:switch',
                'sys:role:create',
                'sys:role:update',
                'sys:dict-item:update',
                'sys:tenant:create',
                'sys:menu:update',
                'sys:menu:delete',
                'sys:config:create',
                'sys:dict:delete',
                'sys:menu:list',
                'sys:user:import',
                'sys:user:delete',
                'sys:config:list',
                'sys:user:update',
                'sys:tenant:list',
                'sys:tenant:plan-assign',
                'sys:role:assign',
                'sys:dict:list',
                'sys:tenant-plan:create',
                'sys:notice:publish',
                'sys:user:list',
                'sys:dict-item:list',
                'sys:tenant:change-status',
                'sys:menu:create',
                'sys:notice:create',
                'sys:user:reset-password',
                'sys:dept:create',
                'sys:config:delete',
                'sys:dict-item:delete',
                'sys:role:delete',
                'sys:tenant-plan:assign',
                'sys:dict:update',
            ],
        })
    );
});

// 修改用户信息
router.put('/', async function (req, res, next) {
    res.send(await updateAdminService(req.body));
});

// 微信登录
router.post('/wxlogin', async function (req, res, next) {
    console.log(req.body);
    const { user, code } = req.body;
    const result = await wxGetUserInfo(user, code);
    console.log(result);

    res.send(formatResponse(0, '', result));
    //     {
    //   session_key: 'JpzOkI/otV1XXCz0HnqAPA==',
    //   expires_in: 7200,
    //   openid: 'o9_T90LriBX3KmE-nZiN2sPnncZE'
    // }
});

module.exports = router;
