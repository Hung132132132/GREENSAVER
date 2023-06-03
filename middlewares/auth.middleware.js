module.exports = isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        // res.locals.loggedin = true;
        res.locals.session = true;
        next();
    } else {
        // res.locals.loggedin = false;
        res.locals.session = null;
        res.render('homepage', { errMess: 'Please sign in' })
    }
}