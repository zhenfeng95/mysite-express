const uploadModel = require('./model/uploadModel');

// 新增文件
module.exports.addUploadDao = async function (newUploadInfo) {
    const { dataValues } = await uploadModel.create(newUploadInfo);
    return dataValues;
};

// 查询所有的文件
module.exports.findAllUploadDao = async function () {
    return await uploadModel.findAll();
};

// 修改文件
module.exports.updateUploadDao = async function (id, newUploadInfo) {
    await uploadModel.update(newUploadInfo, {
        where: {
            id
        }
    });
    return await uploadModel.findByPk(id);
};
