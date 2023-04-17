const mysql = require('mysql');
const SqlString = require('sqlstring');
const mail = require('./mail');
const session = require('express-session');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB
});

let db = {};

db.insertUser = (name, phone, email, username, password, area) => {
    var sql = "INSERT INTO member(name,phone,email,username,password,area) VALUES ('" + name + "','" + phone + "','"
        + email + "','" + username + "','" + password + "','" + area + "')";
    pool.query(sql, function (err, results) {
        if (err) throw err;
    });
};

db.getUserContact = (req, res, session) => {
    var sql = "SELECT * FROM member WHERE role != 'not approved' ORDER BY name";
    pool.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render("Contact", { userData: data, name: session.userName, role: session.role });
    });
};

db.getUserApprove = (req, res, session) => {
    var sql = "SELECT * FROM member WHERE role = 'not approved' ORDER BY name";
    pool.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render("approvePage", { userData: data, name: session.userName , role: session.role });
    });
};

db.getUserEdit = (req, res, email) => {
    var sql = "SELECT * FROM member WHERE email = ?";
    pool.query(sql, [email], function (err, data) {
        if (err) throw err;

        res.render("edit", { userData: data });
    });
};

db.getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM member WHERE username = ?", [username], (error, users) => {
            if (error) {
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
};

db.getUserByPhone = (phone) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM member WHERE phone = ?", [phone], (error, users) => {
            if (error) {
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
};

db.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM member WHERE email = ?", [email], (error, users) => {
            if (error) {
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
};

db.sendMultipleDisapproveMail = (email) => {
    var sql = SqlString.format("SELECT * FROM member WHERE email IN (?)", [email]);
    pool.query(sql, [email], (error, users) => {
        if (error) {
            return error;
        };
        for (i = 0; i < users.length; i++) {
            mail.DisApprove(users[i].username, users[i].email);
        };
    });
};

db.sendMultipleApproveMail = (email) => {
    var sql = SqlString.format("SELECT * FROM member WHERE email IN (?)", [email]);
    pool.query(sql, [email], (error, users) => {
        if (error) {
            return error;
        };
        for (i = 0; i < users.length; i++) {
            mail.Approve(users[i].username, users[i].email);
        };
    });
};

db.deleteUser = (email) => {
    var sql = "DELETE FROM member WHERE email = '" + email + "'";
    pool.query(sql, function (err, data) {
        if (err) throw err;
        console.log("Some records are deleted " + data.affectedRows);
    });
};

db.deleteMultipleUsers = async (email) => {
    await db.sendMultipleDisapproveMail(email);
    var sql = SqlString.format("DELETE FROM member WHERE email IN (?)", [email]);
    console.log(sql);
    pool.query(sql, function (err, data) {
        if (err) throw err;
        console.log("Some records are deleted " + data.affectedRows);
    });
};

db.approveUser = (email) => {
    return new Promise((resolve,reject) => {
        var sql = "UPDATE member SET role = 'Staff' WHERE email = ?";
        pool.query(sql, [email], function (err, users) {
            if (err) {
                return reject(error);
            }
            return resolve(users[0]);
        });
    })
};

db.approveMultipleUsers = async (email) => {
    await db.sendMultipleApproveMail(email);
    var sql = SqlString.format("UPDATE member SET role = 'Staff' WHERE email IN (?)", [email]);
    console.log(sql);
    pool.query(sql, function (err, data) {
        if (err) throw err;
        console.log("Some records are changed " + data.affectedRows);
    });
};

db.editUser = (phone,area,role,email) => {
    var sql = "UPDATE member SET phone = '" + phone + "', area = '" + area 
        + "', role = '" + role + "' WHERE email = '" + email + "'";
    pool.query(sql, function (err, data) {
        if (err) throw err;
        console.log("A record has been changed");
    });
};

db.resetPass = (username, pass) => {
    var sql = "UPDATE member SET password = '" + pass + "' WHERE username = '" + username + "'";
    pool.query(sql, (err, results) => {
        if (err) throw err;

        console.log('A record has been changed');
    });
};

//IN DEVELOPMENT
db.generateOTP = (myLength) => {
    const chars =
        "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
    const randomArray = Array.from(
        { length: myLength },
        (v, k) => chars[Math.floor(Math.random() * chars.length)]
    );

    const randomString = randomArray.join("");
    return randomString;
};

db.getPosts = (req,res) => {
    var sql = "SELECT * FROM posts"
    pool.query(sql, (err,data) => {
        if(err) throw err;
        
        res.render('forum', {posts: data})
    })
}

db.publishPost = (title, content, username, date) => {
    var sql = "INSERT INTO posts(title,content,username,date) VALUES (?,?,?,?)"
    pool.query(sql, [title,content,username,date], (err,result) => {
        if(err) throw err;

        console.log(result.affectedRows + ' record has been changed')
    })
}

module.exports = db;