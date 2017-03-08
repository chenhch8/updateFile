/**
 * Created by flyman on 16-8-29.
 */
var fs = require("fs");
var formidable = require("formidable");
var path = require('path');

exports.upload = function (req, res, next) {
    var fileInfo = [];
    var form = new formidable.IncomingForm(); // 创建form，用于解析客户端上传的表单文件

    form.encoding = 'utf-8';
    form.uploadDir = "./storeFiles";
    form.keepExtensions = true;  // 保留文件扩展名
    form.maxFieldsSize = 2 * 1024 * 1024; // 设置上传文件大小
    form.multiples = true;  // 同时保存多个文件

    form.parse(req, function(err, fields, files) {
        if (err) {
            console.log("---------->>>>>>>>>>>>>error： " + err.message);
        } else {
            for (var index in files) {
                var file = files[index];
                var oldPath = file.path.substring(0, file.path.lastIndexOf('/')) +  '/' + file.name;

                console.log("----------->>>>>>>>>>>>>>>olename: " + oldPath);

                var array = oldPath.split(".");

                var sum = parseInt(Math.random() * 1000);

                var newPath = array[array.length - 2] + sum + "." + array[array.length - 1];

                console.log("----------->>>>>>>>>>>>>>>olename: " + newPath);

                var fileSize = file.size;
                if (file.size > 1024 * 1024)
                    fileSize = (Math.round(fileSize * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                else
                    fileSize = (Math.round(fileSize * 100 / 1024) / 100).toString() + 'KB';

                var date = new Date();

                var temp = {
                    name: file.name.split('.')[0] + sum,
                    type: array[array.length - 1].toUpperCase(),
                    size: fileSize,
                    date: date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + '/' + date.getHours() + ':' + date.getMinutes(),
                    download_time: 0
                };

                fileInfo.push(temp);

                fs.rename(file.path, newPath, function (err, file) {
                    if (err) {
                        console.log(err);
                    }
                });
            }

            console.log("---------->>>>>>>>>>>>>>fileInfo: " + JSON.stringify(fileInfo));

            var data = fs.readFileSync("./files.json");
            if (!data.toString()) {
                fs.writeFileSync("./files.json", JSON.stringify(fileInfo));
            } else {
                data = JSON.parse(data);

                // console.log(data.constructor);

                data = data.concat(fileInfo);

                // console.log(JSON.stringify(data));

                fs.writeFileSync("./files.json", JSON.stringify(data));
            }
        }
    });
};

exports.getlist = function () {
    var files = fs.readFileSync('./files.json');
    return JSON.parse(files);
};

exports.download = function (req, res) {
    var path = './storeFiles/' + req.params.id;

    var data = fs.readFileSync("./files.json");
    data = JSON.parse(data);
    for (var i in data) {
        if (data[i].name == req.params.id.split('.')[0]) {
            data[i].download_time += 1;
            fs.writeFileSync("./files.json", JSON.stringify(data));
            break;
        }
    }

    res.download(path, function (err) {
        if (err) {
            console.log("----------->>>>>>>>>>>>error: " + err.message);
        } else {
            console.log("----------->>>>>>>>>>>>download");
            res.end();
        }
    });
};