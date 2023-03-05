module.exports = isAuthAdmin = (req,res,next) => {
    if(req.session.role == 'Admin') {
        next();
    } else {
        return res.send("<div>You have no permission for this activity <a href='/contact'>Click here to go back to member list page</a></div>");
    }
}