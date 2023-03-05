const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/auth.middleware');
const mail = require('mail');

const db = require('../db');

router.get("/",isAuth, function (req, res) {
    // if (!req.cookies.userID) {
    //     res.redirect("/");
    // } else {
    // }
    db.getUserContact(req,res, req.session);
});

router.get("/delete/:email/:username",isAuth, async function (req, res, next) {
    var username = req.params.username;
    var email = req.params.email;
    await db.deleteUser(email);
    mail.DisApprove(username,email);
    res.redirect('/contact');
});

router.get("/edit/:email",isAuth, function (req, res, next) {
    var email = req.params.email;
    db.getUserEdit(req,res,email);
});

router.post("/edited", async function (req, res) {
    db.editUser(req.body.phone, req.body.area, req.body.role, req.body.email);
    var user = await db.getUserByEmail(req.body.email);
    mail.EditInfo(user.username, user.email);
    res.redirect("/contact");
});

module.exports = router;