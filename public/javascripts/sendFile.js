/**
 * Created by flyman on 2016-8-28.
 */
$(function () {
    var files = [];
    var isUpdate = false;

    $("#file_upload_alt").on("click", function () {
        if (isUpdate) {
            cancle();
            isUpdate = false;
        }
        $("input[type='file']").trigger('click');
    });

    $("#upload").on("click", function () {
        upload(files, afterSend);
    });

    $("#cancle").on("click", cancle);

    var input = $("#file_upload");

//文件域选择文件时, 执行readFile函数
    input.on('change', readFile);

    function readFile() {
        var file = this.files[0];
        files.push(file);

        var fileSize = 0;
        if (file.size > 1024 * 1024)
            fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
        else
            fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

        var tr = $(document.createElement("tr"));
        tr.addClass("tr");

        var info = ["Name:", file.name, "|", "Size:", fileSize];

        for (var i = 0; i < 5; i++) {
            var td = $(document.createElement("td"));
            td.addClass("fileItem");
            if (i == 4) {
                td.css("text-align", "right");
            }
            td.text(info[i]);
            tr.append(td);
        }

        $("table").append(tr);
    }

//上传文件, XMLHttpRequest采用ajax形式上传
    function upload(files, callback) {
        if (files.length == 0) {
            return;
        }

        isUpdate = true;

        var fd = new FormData();

        files.forEach(function (file, index) {
            fd.append("file_id_" + index, file);
        });

        $.ajax({
            url: "/update", type: "POST", data: fd, success: afterSend, error: errorSend,
            processData: false, // 布尔值，规定通过请求发送的数据是否转换为查询字符串,POST要，否则发送失败
            contentType: false, //必须false才会自动加上正确的Content-Type
            xhr: function () {
                var xhr = new XMLHttpRequest();
                if (uploadProgress && xhr.upload) {
                    // 注册progress监听器，在接收相应期间持续不断触发
                    xhr.upload.addEventListener("progress", uploadProgress, false);
                    return xhr;
                }
            }
        });
    }

    function uploadProgress(evt) {
        if (evt.lengthComputable) {
            //evt.loaded：文件上传的大小 evt.total：文件总的大小
            var percentComplete = Math.round((evt.loaded) * 100 / evt.total);
            //加载进度条，同时显示信息
            $("#percent").html(percentComplete + '%');
            $("#progressNumber").css("width", percentComplete + "%");
        }
    }

    function cancle() {
        files = [];
        $("table").empty();
        $("#percent").html(0 + '%');
        $("#progressNumber").css("width", 0);
    }

    function afterSend(data) {
        if (data.success == 1) {
            files = [];
        }
    }

    function errorSend(xhr,status,error) {
        console.log("error: " + error.message);
        alert("Send fail!");
    }
});