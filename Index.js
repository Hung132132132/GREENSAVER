const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const express = require("express");
const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
var path = require('path');
const db = require('./db');
const isntAuth = require('./middlewares/isntauth.middleware');
const isAuth = require('./middlewares/auth.middleware');
require('dotenv').config();
const mail = require('./mail');
const app = express();
const crypto = require('crypto');


const PORT = process.env.APP_PORT || 3000;
const oneHour = 1000 * 60 * 60;
const IN_PROD = process.env.NODE_ENV === 'production';

const options = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB,
    port: process.env.DB_PORT,
    createDatabaseTable: true,
}

const sessionStore = new mysqlStore(options);

app.use(session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESS_SECRET,
    cookie: {
        httpOnly: true,
        maxAge: oneHour,
        sameSite: true,
        secure: IN_PROD
    }
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));

//Routers
var contactRoute = require('./routes/contact.route');
var approveRoute = require('./routes/approve.route');
var forumRoute = require('./routes/forum.route');
app.use('/contact', contactRoute);
app.use('/approve', approveRoute);
app.use('/forum', forumRoute);

app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});

app.post('/auth', async (req, res, next) => {
    const hash = crypto.createHash('sha256');
    var password = hash.update(req.body.password).digest('hex');
    var username = req.body.username;
    var user = await db.getUserByUsername(username);

    if (!user) {
        return res.render("homePage", { session: req.session.userName, errMess: "INVALID USERNAME" });
    };

    if (user.password !== password) {
        return res.render("homePage", { session: req.session.userName, errMess: "INVALID PASSWORD" });
    }

    if (user.role == 'not approved') {
        return res.render("homePage", { session: req.session.userName, errMess: "UNAPPROVED ACCOUNT" });
    }

    req.session.user = user.uid;
    req.session.userName = user.username;
    req.session.role = user.role;
    req.session.isAuth = true;
    return res.redirect('/forum');
});

app.get('/logout', async (req, res) => {
    req.session.destroy();
    res.locals.session = false;
    res.redirect('/');
})

app.get("/", (req, res, next) => {
    res.render("homePage", { session: req.session.userName, errMess: null });
});

app.get("/about", (req, res) => {
    res.render("About", { session: req.session.userName });
});
app.post('/subscribe', (req,res) => {
    var email = req.body.email;
    db.subscribe(email);
    return res.redirect('/')
})

const otpGenerate = () => {
    var otp = Math.floor(Math.random() * 8999) + 1000;
    return otp;
}
app.use(isntAuth);
app.get("/register", (req, response) => {
    response.render("registerPage", { errMess: null });
});
app.post('/addMember_add', async (req, res) => {
    var phone = req.body.phone;
    var email = req.body.email;
    var username = req.body.username;
    var userUsername = await db.getUserByUsername(username);
    var userPhone = await db.getUserByPhone(phone);
    var userEmail = await db.getUserByEmail(email);
    var registerOTP = await db.getRegisterByEmail(email);

    if (userUsername) {
        return res.render('registerPage', { errMess: 'Username already in use!' })
    } else if (userPhone) {
        return res.render('registerPage', { errMess: 'Phone number already in use!' })
    } else if (userEmail) {
        return res.render('registerPage', { errMess: 'Email already in use!' })
    } else {
        if (registerOTP) {
            var otp = otpGenerate();
            console.log(otp);
            db.newOTP(email, otp);
        } else {
            var otp = otpGenerate();
            console.log(otp);
            db.newOTP(email, otp);
        }
        return res.render('registerPageConfirm', { data: req.body, errMess: null })
    }
});

app.post('/register/checkOTP', async (req, res) => {
    var email = req.body.email;
    var cliOTP = req.body.OTP;
    var registerOTP = await db.getRegisterByEmail(email);
    console.log(registerOTP)
    console.log(cliOTP)
    if (cliOTP != registerOTP || !registerOTP) {
        var otp = otpGenerate();
        console.log(otp);
        db.newOTP(email, otp);
        return res.render('registerPageConfirm', { data: req.body, errMess: 'Wrong OTP, check email for new one' })
    } else {
        var name = req.body.name;
        var phone = req.body.phone;
        var username = req.body.username;
        const hash = crypto.createHash('sha256');
        var password = hash.update(req.body.password).digest('hex');
        var area = req.body.area;
        db.insertUser(name, phone, email, username, password, area);
        db.deleteOTP(email);
        db.subscribe(email)
        mail.SignUp(username, email);
        return res.redirect("/");
    }
})


app.get("/resetPass", (req, res) => {
    res.render("ResetPass", { errMess: null });
});

app.post('/resetpass/reset', async (req, res, next) => {
    var username = req.body.username;
    var phone = req.body.phone;
    const hash = crypto.createHash('sha256');
    var pass = hash.update(req.body.pass1).digest('hex');
    var user = await db.getUserByUsername(username);

    if (!user) {
        return res.render('ResetPass', { errMess: 'Username does not exist!' });
    }
    if (user.phone != phone) {
        return res.render('ResetPass', { errMess: 'Wrong phone number!' });
    }

    db.resetPass(username, pass);
    return res.redirect('/');
});

module.exports = app;
