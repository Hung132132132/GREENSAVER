const bodyParser = require('body-parser');
const express = require("express");
var path = require('path');
const app = express();
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));

// var database = require('database');
var insertDB = require('insert_DB');
var updateDB = require('update_DB');
var deleteDB = require('delete_DB');
var sendEmailSuccess = require("mail.js");

var mysql = require('mysql');

const { response } = require("express");
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "123456",
	database: "mydb"
	});

app.use(express.static("public"));


app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(3000);

app.get("/", function(request, response){
    response.render("homePage");
});

app.get("/register", function(request, response){
    response.render("registerPage");
});

app.get("/homePageSuccess", function(request, response){
    sendEmailSuccess();
    addMember();
    app.use(function (req, res, next) {
        res.locals.email = req.session.email;
        res.locals.firstName = req.session.firstName;
        res.locals.lastName = req.session.lastName;
        next();
    });
    response.render("homePage");
});

app.get("/contact", function(request, response){
    var sql = "SELECT * FROM member";
    connection.connect(function(err){
    connection.query(sql, function(err, data,fields){
        if(err) throw err;
        response.render("Contact", {userData: data});
    });
});
});


app.get("/about", function(request, response){
    response.render("About");
});

app.get("/addMember", function(request, response){
    response.render("AddMember");
});
app.post('/addMember_add',function(req, res){
    // res.send(req.body.name);
	connection.connect(function(err){
		var sql = "INSERT INTO member(name,phone,email) VALUES ('"+ req.body.name +"','" +req.body.phone + "','" +req.body.email +"')";
		connection.query(sql,function(err,result){
			if(err) throw err;
			console.log("Some records are added " + result.affectedRows);
		});
        res.render("AddMember");
	});
//     var sql = "SELECT * FROM member";
//     connection.connect(function(err){
//     connection.query(sql, function(err, data,fields){
//         if(err) throw err;
//         response.render("Contact", {userData: data});
//     });
// });
});

app.get("/resetPass", function(request, response){
    response.render("ResetPass");
});
app.get("/insert", function(request, response){
    insert_DB();
    response.render("ResetPass");
});
app.get("/update", function(request, response){
    update_DB();
    response.render("ResetPass");
});

app.get("/delete", function(request, response){
    var mysql = require('mysql');
	var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "123456",
	database: "mydb"
	});

	connection.connect(function(err){
		if(err) throw err;
		console.log("Connected");
		request.get
		var sql = "DELETE FROM member WHERE name = '${req.body.name}'";
		connection.query(sql,function(err,result){
			if(err) throw err;
			console.log("Some records are added " + result.affectedRows);
		});
	});
    response.render("Contact");
});


module.exports = app;