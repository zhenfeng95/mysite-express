var express = require('express');
var router = express.Router();

const {
    findMenuTreeService,
    findMenuListService,
    findMenuOptionsService,
    findOneMenuService,
    addMenuService,
    updateMenuService,
    deleteMenuService
} = require('../service/menuService');

// 树形菜单（动态路由）
router.get('/routes', async function (req, res, next) {
    res.send(await findMenuTreeService());
});

// 菜单列表（扁平，管理页）
router.get('/list', async function (req, res, next) {
    res.send(await findMenuListService());
});

// 父级菜单下拉选项
router.get('/options', async function (req, res, next) {
    res.send(await findMenuOptionsService(req.query));
});

// 树形菜单（同 routes，兼容 GET /）
router.get('/', async function (req, res, next) {
    res.send(await findMenuTreeService());
});

router.get('/:id', async function (req, res, next) {
    res.send(await findOneMenuService(req.params.id));
});

router.post('/', async function (req, res, next) {
    res.send(await addMenuService(req.body));
});

router.put('/:id', async function (req, res, next) {
    res.send(await updateMenuService(req.params.id, req.body));
});

router.delete('/:id', async function (req, res, next) {
    res.send(await deleteMenuService(req.params.id));
});

module.exports = router;
