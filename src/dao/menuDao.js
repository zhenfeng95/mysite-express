const menuModel = require('./model/menuModel');

module.exports.addMenuDao = async function (menuInfo) {
    const { dataValues } = await menuModel.create(menuInfo);
    return dataValues;
};

module.exports.findAllMenuDao = async function () {
    return await menuModel.findAll({
        order: [
            ['sort', 'ASC'],
            ['id', 'ASC']
        ]
    });
};

module.exports.findOneMenuDao = async function (id) {
    return await menuModel.findByPk(id);
};

module.exports.updateMenuDao = async function (id, menuInfo) {
    await menuModel.update(menuInfo, {
        where: { id }
    });
    return await menuModel.findByPk(id);
};

module.exports.deleteMenuDao = async function (id) {
    return await menuModel.destroy({
        where: { id }
    });
};

module.exports.countChildrenDao = async function (id) {
    return await menuModel.count({
        where: { parentId: id }
    });
};

module.exports.findDescendantIdsDao = async function (rootId) {
    const all = await menuModel.findAll({
        attributes: ['id', 'parentId']
    });
    const ids = [];
    const collect = (parentId) => {
        all.forEach((item) => {
            const row = item.dataValues || item;
            if (row.parentId === parentId) {
                ids.push(row.id);
                collect(row.id);
            }
        });
    };
    collect(Number(rootId));
    return ids;
};

module.exports.bulkCreateMenuDao = async function (rows) {
    return await menuModel.bulkCreate(rows);
};
