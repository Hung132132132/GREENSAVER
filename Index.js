const bodyParser = require('body-parser');
const express = require("express");
var path = require('path');
const app = express();
const PORT = process.env.PORT || 3030;
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

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});

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
    response.redirect("/");
});

app.get("/contact", function(request, response){
    var sql = "SELECT * FROM member ORDER BY name";
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
	connection.connect(function(err){
		var sql = "INSERT INTO member(name,phone,email) VALUES ('"+ req.body.name +"','" +req.body.phone + "','" +req.body.email +"')";
		connection.query(sql,function(err,result){
			if(err) throw err;
			console.log("Some records are added " + result.affectedRows);
		});
        res.redirect("/addMember");
	});
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

app.get("/contact/delete/:email", function(request, response, next){

    var email = request.params.email;
	var sql = "DELETE FROM member WHERE email = ?";
	connection.query(sql, [email],function(err,data){
		if(err) throw err;
		console.log("Some records are added " + data.affectedRows);
	});

    response.redirect("/contact");
});


module.exports = app;