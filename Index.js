const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const express = require("express");
const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
var path = require('path');
const db = require('./db');
const isAuth = require('./middlewares/auth.middleware');
const isntAuth = require('./middlewares/isntauth.middleware');
require('dotenv').config();
const mail = require('./mail');
const app = express();


const PORT = process.env.PORT || 3000;
const oneDay = 1000 * 60 * 60 * 24;
const IN_PROD = process.env.NODE_ENV === 'production';

const options ={
    connectionLimit: 10,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    createDatabaseTable: true
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
        maxAge: oneDay,
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
app.use('/contact', contactRoute);
app.use('/approve', approveRoute);

app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});

app.get("/", function (req, response, next) {
    response.render("homePage", {session : req.session.userName, errMess: null});
});

app.post('/auth', async function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var user = await db.getUserByUsername(username);

    if(!user) {
        return res.render("homePage", {session : req.session.userName, errMess: "INVALID USERNAME"});
    };

    if(user.role == 'not approved') {
        return res.render("homePage", {session : req.session.userName, errMess: "UNAPPROVED ACCOUNT"});
    }

    if(user.password !== password) {
        return res.render("homePage", {session : req.session.userName, errMess: "INVALID PASSWORD"});
    }

    req.session.user = user.uid;
    req.session.userName = user.username;
    req.session.role = user.role;
    req.session.isAuth = true;
    return res.redirect('/contact');
});

app.get('/logout', (req,res) => {
    req.session.destroy();
    res.render("homePage", {session : null, errMess: null});
})

app.get("/register",isntAuth, function (req, response) {
    response.render("registerPage", {errMess: null});
});

app.post('/addMember_add',isntAuth, async function (req, res) {
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var area = req.body.area;
    var userUsername = await db.getUserByUsername(username);
    var userPhone = await db.getUserByPhone(phone);
    var userEmail = await db.getUserByEmail(email);

    console.log(userUsername);

    if(userUsername) {
        return res.render('registerPage', {errMess: 'Username already in use!'})
    } else if(userPhone) {
        return res.render('registerPage', {errMess: 'Phone number already in use!'})
    } else if(userEmail) {
        return res.render('registerPage', {errMess: 'Email already in use!'})
    } else {
        db.insertUser(name, phone, email, username, password, area);
        mail.SignUp(username, email);
        return res.redirect("/");
    }
});

app.get("/about", function (req, res) {
    res.render("About");
});

app.get("/resetPass",isntAuth, function (req, res) {
    res.render("ResetPass", {errMess: null});
});

app.post('/resetpass/reset',isntAuth, async function (req,res,next) {
    // var otp = req.body.otp;
    var username = req.body.username;
    var phone = req.body.phone;
    var pass = req.body.pass1;
    var user = await db.getUserByUsername(username);

    if(!user) {
        return res.render('ResetPass', {errMess: 'Username does not exist!'});
    }
    if(user.phone != phone) {
        return res.render('ResetPass', {errMess: 'Wrong phone number!'});
    }

    db.resetPass(username, pass);
    return res.redirect('/');
});

module.exports = app;
