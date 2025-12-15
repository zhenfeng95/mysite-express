const { validate } = require('validate.js');
const { findAllUploadDao, addUploadDao, updateUploadDao } = require('../dao/uploadDao');
const { ValidationError } = require('../utils/errors');
const { formatResponse, handleDataPattern } = require('../utils/tool');

// 新增文件
module.exports.addUploadService = async function (newUploadInfo) {
    // 定义验证规则
    const uploadRule = {
        name: {
            presence: {
                allowEmpty: false
            },
            type: 'string'
        },
        description: {
            presence: {
                allowEmpty: false
            },
            type: 'string'
        },
        url: {
            presence: {
                allowEmpty: false
            },
            type: 'string'
        }
    };

    // 进行数据验证
    const validateResult = validate.validate(newUploadInfo, uploadRule);
    if (!validateResult) {
        const data = await addUploadDao(newUploadInfo);
        return formatResponse(0, '', data);
    } else {
        throw new ValidationError('数据验证失败');
    }
};

// 查询所有文件
module.exports.findAllUploadService = async function () {
    const data = await findAllUploadDao();
    const obj = handleDataPattern(data);
    return formatResponse(0, '', obj);
};

// 修改文件
module.exports.updateUploadService = async function (id, newUploadInfo) {
    const { dataValues } = await updateUploadDao(id, newUploadInfo);
    return formatResponse(0, '', dataValues);
};
