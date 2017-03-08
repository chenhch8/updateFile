var express = require('express');
var file = require("../moduels/file");
var router = express.Router();
var path = require("path");
var user = require("../moduels/user");

/* GET home page. */
router.get("/update", checkLogin);
router.get('/update', function (req, res, next) {
    console.log("get ----> update/");
    res.render('update', {title: "Update file"});
});

router.post('/update', function (req, res, next) {
    console.log("POST ----> update/");
    console.log("files: " + req.body.file_id_0);
    file.upload(req, res, next);
    res.json({success: 1});
});

router.get('/download', checkLogin);
router.get('/download', function (req, res, next) {
    res.render("list", {title: "Download files", list: file.getlist()});
});

router.get('/download/:id', checkLogin);
router.get('/download/:id', function (req, res, next) {
    console.log("------>>>>>>>>>>download: " + req.params.id);
    file.download(req, res);
});

router.get("/", checkNoLogin);
router.get('/', function (req, res, next) {
    console.log("------>>>>>>>>>>home");
    res.render("login", {title: "Login"});
});

router.post('/login', function (req, res, next) {
    console.log("------>>>>>>>>>>login");

    if (user.check(req)) {
        req.session.user = {
            username: req.body.username,
            password: req.body.password
        };
        res.redirect("/update");
    } else {
        res.redirect("/");
    }
});

router.get('/logout', checkLogin);
router.get('/logout', function (req, res, next) {
    console.log("------>>>>>>>>>>logout");
    if (!user.check(req)) {
        delete req.session.user;
    }
    res.render("login", {title: "Login"});
});

function checkLogin(req, res, next) {

    console.log("--------->>>>>>>>>>>>req.session.user(1): " + req.session.user);

    if (!req.session.user) {
        res.redirect("/");
    }
    next();
}

function checkNoLogin(req, res, next) {

    console.log("--------->>>>>>>>>>>>req.session.user(2): " + req.session.user);

    if (req.session.user) {
        res.redirect("update");
    }
    next();
}


module.exports = router;
