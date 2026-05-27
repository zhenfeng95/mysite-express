const { validate } = require('validate.js');
const {
    addMenuDao,
    findAllMenuDao,
    findOneMenuDao,
    updateMenuDao,
    deleteMenuDao,
    countChildrenDao,
    findDescendantIdsDao
} = require('../dao/menuDao');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { formatResponse } = require('../utils/tool');
const { buildMenuTree, buildMenuManageTree, buildMenuOptionsTree, toMenuRecord, toManageDetail } = require('../utils/menuUtils');

function parseOnlyParent(value) {
    if (value === undefined || value === null || value === '') {
        return true;
    }
    return value === true || value === 'true' || value === '1';
}

const menuRule = {
    name: {
        presence: { allowEmpty: false },
        type: 'string'
    }
};

function validateMenuInfo(menuInfo) {
    const result = validate.validate(menuInfo, menuRule);
    if (result) {
        throw new ValidationError('数据验证失败');
    }
}

function normalizeParentId(parentId) {
    if (parentId === '0' || parentId === 0 || parentId === null || parentId === undefined || parentId === '') {
        return null;
    }
    return Number(parentId);
}

async function getMenuOrThrow(id) {
    const menu = await findOneMenuDao(id);
    if (!menu) {
        throw new NotFoundError();
    }
    return menu.dataValues || menu;
}

module.exports.findMenuTreeService = async function () {
    const data = await findAllMenuDao();
    const tree = buildMenuTree(data);
    return formatResponse(0, '成功', tree);
};

module.exports.findMenuListService = async function () {
    const data = await findAllMenuDao();
    const tree = buildMenuManageTree(data);
    return formatResponse(0, '成功', tree);
};

module.exports.findMenuOptionsService = async function (query = {}) {
    const data = await findAllMenuDao();
    const onlyParent = parseOnlyParent(query.onlyParent);
    const tree = buildMenuOptionsTree(data, onlyParent);
    return formatResponse(0, '成功', tree);
};

module.exports.findOneMenuService = async function (id) {
    const menu = await getMenuOrThrow(id);
    return formatResponse(0, '', toManageDetail(menu));
};

module.exports.addMenuService = async function (body) {
    validateMenuInfo(body);
    const record = toMenuRecord(body);
    const data = await addMenuDao(record);
    return formatResponse(0, '', toManageDetail(data));
};

module.exports.updateMenuService = async function (id, body) {
    await getMenuOrThrow(id);
    validateMenuInfo(body);

    const parentId = normalizeParentId(body.parentId);
    if (parentId && Number(parentId) === Number(id)) {
        throw new ValidationError('父菜单不能为自身');
    }
    if (parentId) {
        const descendantIds = await findDescendantIdsDao(id);
        if (descendantIds.includes(Number(parentId))) {
            throw new ValidationError('父菜单不能为子菜单');
        }
    }

    const record = toMenuRecord(body);
    const updated = await updateMenuDao(id, record);
    const data = updated.dataValues || updated;
    return formatResponse(0, '', toManageDetail(data));
};

module.exports.deleteMenuService = async function (id) {
    await getMenuOrThrow(id);
    const childCount = await countChildrenDao(id);
    if (childCount > 0) {
        throw new ValidationError('存在子菜单，无法删除');
    }
    await deleteMenuDao(id);
    return formatResponse(0, '', null);
};
