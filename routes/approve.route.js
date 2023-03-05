const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/auth.middleware');
const isAuthAdmin = require('../middlewares/admin.middleware');
const mail = require('../mail');

const db = require('../db');

router.get("/",isAuth, isAuthAdmin, function (req, res) {
    data = db.getUserApprove(req,res, req.session.userName);
});

router.get("/delete/:email/:username",isAuth,isAuthAdmin, async function (req, res, next) {
    var email = req.params.email;
    var username = req.params.username;
    await db.deleteUser(email);
    mail.DisApprove(username,email);
    res.redirect('/approve');
});

router.get("/approved/:email/:username",isAuth,async function (req, res, next) {
    var email = req.params.email;
    var username = req.params.username;
    await db.approveUser(email);
    mail.Approve(username,email);
    res.redirect("/approve");
});

module.exports = router;