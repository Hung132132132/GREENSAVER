const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/auth.middleware');
var multer = require('multer');
var path = require('path');
const crypto = require('crypto');
const mail = require('../mail');

const db = require('../db');
const { format } = require('mysql');
// const { response } = require('../Index');
var imgdate = Date.now();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}${imgdate}.${ext}`)
    }
});
// const upload = '';
upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(null, false)
            // response.redirect('/')
        }
        callback(null, true)
    },
    limits:{
        fileSize: 10000000
    }
});
// try {
// } catch (error) {
    
// }


router.use(isAuth);
router.get("/", async (req, res) => {
    db.getPosts(req, res);
});

router.post('/publish_post', upload.single('file'), (req, res) => {
    var date = new Date();
    if (!req.file) {
        db.publishPost(req.body.title, req.body.content, req.session.userName, date);
    } else {
        const ext = req.file.mimetype.split("/")[1];
        db.publishPost(req.body.title, req.body.content, req.session.userName, date, `${req.file.fieldname}${imgdate}.${ext}`);
    }
    res.redirect('/forum')
})
router.get('/personalinfo', async (req, res) => {
    db.getUserInfo(req, res, req.session.userName, null);
})
const encrypt = (string) => {
    var hash = crypto.createHash('sha256');
    return hash.update(string).digest('hex');
}
router.post('/changepass', async (req, res) => {
    var username = req.session.userName;
    var curPassCli = encrypt(req.body.curPass)
    var newPass = encrypt(req.body.newPass);
    var user = await db.getUserByUsernameChangePass(username)
    var curPassSer = user.password;
    if (curPassCli != curPassSer) {
        return db.getUserInfo(req, res, username, 'incorrect password')
    }
    db.resetPass(username, newPass)
    res.redirect('/forum')
    mail.ChangePass(username, user.email)
});

module.exports = router;