var express = require('express');
// const {upload}

const { addUploadService, findAllUploadService, updateUploadService } = require('../service/uploadService');
const multer = require('multer');
const fs = require('fs');
const { UploadError, UnknownError } = require('../utils/errors');
const { uploading, formatResponse } = require('../utils/tool');
var router = express.Router();
const dir = './public/static/uploads';

async function readUploads(dir) {
    return new Promise(resolve => {
        fs.readdir(dir, (err, files) => {
            if (err) throw new UnknownError();
            resolve(files);
        });
    });
}

// 获取上传列表
router.get('/list', async function (req, res, next) {
    // const files = await readUploads(dir);
    // res.send(formatResponse(0, '', files));
    const files = await findAllUploadService();
    res.send(formatResponse(0, '', files));
});

// 上传文件
router.post('/', async function (req, res, next) {
    // single 方法里面书写上传控件的 name 值
    uploading.single('file')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            next(new UploadError('上传文件失败，请检查文件的大小，控制在 2MB 以内'));
        } else {
            const path = process.env.RESPONSE_URL + '/uploads/' + req.file.filename;
            res.send(formatResponse(0, '上传文件成功', path));
        }
    });
});

// 同步文件到数据库
router.post('/save', async function (req, res, next) {
    res.send(await addUploadService(req.body));
});

router.put('/edit/:id', async function (req, res, next) {
    res.send(await updateUploadService(req.params.id, req.body));
});

module.exports = router;
