var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'alex.trinhquoc@gmail.com',
        pass: 'euuiinjuenchsvbd'
    }
});

let mail = {};

var emailDemo = 'alex.yasuo132132@gmail.com'

var noteMess = "Note: This is an automatically generated email. Do not reply to it."

mail.SignUp = function (username, email) {

    var mailOptions = {
        from: 'GREENSAVER<alex.trinhquoc@gmail.com>',
        to: emailDemo,
        subject: 'Thank you for your sign up, ' + username,
        html: '<p>' + username + ', you just recently registered to our community, GREENSAVER.<br>Your registration is pending an approval. This may take upto half a day. Please be patient.<br>' + noteMess + '</p>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
mail.Approve = function (username, email) {

    var mailOptions = {
        from: 'GREENSAVER<alex.trinhquoc@gmail.com>',
        to: emailDemo,
        subject: 'Your account has been approved, ' + username + '!',
        html: '<p>' + username + ', you are a now a part of the community, GREENSAVER.<br>From now on, you will receive requests from other memebers from the same area to join their journey on saving the "green" of our planet.<br>' + noteMess + '</p>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
mail.DisApprove = function (username, email) {

    var mailOptions = {
        from: 'GREENSAVER<alex.trinhquoc@gmail.com>',
        to: emailDemo,
        subject: 'Sadly to say goodbye, ' + username,
        html: '<p>' + username + ', you have just recently been removed from GREENSAVER by the adminstrator.<br>Please note that it could be a mistake so feel free to contact us for the reason of this removal.<br>'+ noteMess +'</p>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
mail.EditInfo = function (username, email) {

    var mailOptions = {
        from: 'GREENSAVER<alex.trinhquoc@gmail.com>',
        to: emailDemo,
        subject: "Changes to " + username + "'s account",
        html: '<p>' + username + ', your account information has been recently changed by the adminstrator of GREENSAVER.<br>'+ noteMess + '</p>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = mail;