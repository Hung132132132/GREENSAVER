const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/auth.middleware');
const isAuthAdmin = require('../middlewares/admin.middleware');
const mail = require('../mail');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

const db = require('../db');

router.use(isAuth);
router.get("/", isAuthAdmin, (req, res) => {
    data = db.getUserApprove(req, res, req.session);
});

router.get("/delete/:email/:username", isAuthAdmin, async (req, res, next) => {
    var email = req.params.email;
    var username = req.params.username;
    await db.deleteUser(email);
    mail.DisApprove(username, email);
    res.redirect('/approve');
});

router.get("/approved/:email/:username", async (req, res, next) => {
    var email = req.params.email;
    var username = req.params.username;
    await db.approveUser(email);
    mail.Approve(username, email);
    res.redirect("/approve");
});

router.post("/mutipleApprove", isAuthAdmin, async (req, res, next) => {
    var checkboxes = req.body.checkBox;
    var approve = await db.approveMultipleUsers(checkboxes);
    res.redirect('/contact');
});

router.post("/mutipleDelete", isAuthAdmin, async (req, res, next) => {
    var checkboxes = req.body.checkBox;
    var deleteuser = await db.deleteMultipleUsers(checkboxes);
    res.redirect('/contact');
});

module.exports = router;