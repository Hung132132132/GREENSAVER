const bodyParser = require('body-parser');
const express = require("express");
var path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
// app.use(session({
    //     secret: 'secret-key',
    //     resave: false,
    //     saveUninitialized: false,
    // }));
    
    // var database = require('database');
    // var insert_DB = require('insert_DB.js');
    // var update_DB = require('update_DB.js');
    // var delete_DB = require('delete_DB.js');
    // var sendEmailSuccess = require("mail.js");
    
    var mysql = require('mysql');
    
const { response } = require("express");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "mydb"
});

app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});

app.get("/", function (request, response, next) {
    response.render("homePage");
});

app.get("/register", function (request, response) {
    response.render("registerPage");
});

app.post('/addMember_add', function (req, res) {
    connection.connect(function (err) {
        var sql1 = "INSERT INTO member(name,phone,email,username,password,area) VALUES ('" + req.body.name + "','" + req.body.phone + "','" 
        + req.body.email + "','" + req.body.username + "','" + req.body.password + "','" + req.body.area + "')";
        connection.query(sql1, function (err, results) {
            if (err) throw err;
        });
        res.redirect("/");
    });
});

app.get("/homePageSuccess", function (request, response) {
    sendEmailSuccess();
    app.use(function (req, res, next) {
        res.locals.email = req.session.email;
        res.locals.firstName = req.session.firstName;
        res.locals.lastName = req.session.lastName;
        next();
    });
    response.redirect("/");
});

app.get("/contact", function (request, response) {
    var sql = "SELECT * FROM member WHERE email != 'not approved' ORDER BY name";
    var input = "";
    connection.connect(function (err) {
        connection.query(sql, function (err, data, fields) {
            if (err) throw err;
            response.render("Contact", { userData: data, input: input });
        });
    });
});

app.post("/contact/search", function (req, res) {
    if (req.body.searchInput != ''){
        var sql = "SELECT * FROM member WHERE role != 'not approved' AND name = '" + req.body.searchInput + "' ORDER BY name";
        connection.connect(function (err) {
            connection.query(sql, function (err, data, fields) {
                if (err) throw err;
                res.render("Contact", { userData: data, input: req.body.searchInput });
            });
        });
    } else {
        res.redirect("/contact");
    }
});

app.post("/approve/search", function (req, res) {
    if (req.body.searchInput != ''){
        var sql = "SELECT * FROM member WHERE role = 'not approved' AND name = '" + req.body.searchInput + "' ORDER BY name";
        connection.connect(function (err) {
            connection.query(sql, function (err, data, fields) {
                if (err) throw err;
                res.render("approvePage", { userData: data, input: req.body.searchInput });
            });
        });
    } else {
        res.redirect("/approve");
    }
});

app.get("/approve", function (request, response) {
    var sql = "SELECT * FROM member WHERE role = 'not approved' ORDER BY name";
    var input = "";
    connection.connect(function (err) {
        connection.query(sql, function (err, data, fields) {
            if (err) throw err;
            response.render("approvePage", { userData: data, input: input });
        });
    });
});


app.get("/about", function (request, response) {
    response.render("About");
});

// app.get("/addMember", function (request, response) {
//     response.render("AddMember");
// });



app.get("/resetPass", function (request, response) {
    response.render("ResetPass");
});
app.get("/insert", function (request, response) {
    insert_DB();
    response.render("ResetPass");
});
app.get("/update", function (request, response) {
    update_DB();
    response.render("ResetPass");
});

app.get("/contact/delete/:email", function (request, response, next) {

    var email = request.params.email;
    var sql = "DELETE FROM member WHERE email = ?";
    connection.query(sql, [email], function (err, data) {
        if (err) throw err;
        console.log("Some records are added " + data.affectedRows);
    });

    response.redirect("/contact");
});

app.get("/contact/edit/:email", function (request, response, next) {
    var email = request.params.email;
    var sql = "SELECT * FROM member WHERE email = ?";
    connection.query(sql, [email], function (err, data) {
        if (err) throw err;
        response.render("edit", { userData: data });
    });
});

app.get("/contact/approve/:email", function (request, response, next) {
    var email = request.params.email;
    var sql = "UPDATE member SET role = 'Staff' WHERE email = ?";
    connection.query(sql, [email], function (err, data) {
        if (err) throw err;
        // response.render("edit", { userData: data });
        response.redirect("/approve");
    });
});

app.post("/edited", function (req, res) {
    var sql = "UPDATE member SET name = '" + req.body.name + "', phone = '" + req.body.phone + "', area = '" + req.body.area
    + "', role = '" + req.body.role + "' WHERE email = '" + req.body.email + "'";
    connection.query(sql, function (err, data) {
        if (err) throw err;
        console.log("A record has been changed");
    });
    res.redirect("/contact");
    
});

module.exports = app;