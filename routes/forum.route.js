const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/auth.middleware');
const isAuthAdmin = require('../middlewares/admin.middleware');
const mail = require('../mail');
const bodyParser = require('body-parser');

const db = require('../db');

router.get("/",isAuth, async function (req, res) {
    var data = await db.getPosts(req,res);
});

router.post('/publish_post', (req,res) => {
    var date = new Date();
    db.publishPost(req.body.title, req.body.content, req.session.userName, date);
    res.redirect('/forum')
})

module.exports = router;