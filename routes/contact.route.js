const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/auth.middleware');
const isAuthAdmin = require('../middlewares/admin.middleware');
const mail = require('../mail');
const session = require('express-session');

const db = require('../db');

router.use(isAuth);
router.get("/", (req, res) => {
    // if (!req.cookies.userID) {
    //     res.redirect("/");
    // } else {
    // }
    db.getUserContact(req, res, req.session, null);
});

router.get("/delete/:email/:username", isAuthAdmin, async (req, res, next) => {
    var username = req.params.username;
    var email = req.params.email;
    if (req.session.userName == username) {
        return db.getUserContact(req, res, req.session, 'cannot remove yourself');
    } else if (req.session.userName != username) {
        db.deleteUser(email);
        mail.DisApprove(username, email);
        return res.redirect('/contact');
    }
});

router.post("/mutipleDelete", isAuthAdmin, async (req, res, next) => {
    var checkboxs = req.body.checkBox;
    db.deleteMultipleUsers(checkboxs);
    res.redirect('/contact');
});

router.get("/edit/:email", isAuthAdmin, (req, res, next) => {
    var email = req.params.email;
    db.getUserEdit(req, res, email);
});

router.post("/edited", isAuthAdmin, async (req, res) => {
    db.editUser(req.body.phone, req.body.area, req.body.role, req.body.email);
    var user = await db.getUserByEmail(req.body.email);
    mail.EditInfo(user.username, user.email);
    res.redirect("/contact");
});

module.exports = router;