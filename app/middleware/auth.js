const jwt = require("jsonwebtoken");

module.exports.isAuthenticated = (req, res, next) => {
    if (req.cookies.token != undefined) {
        if (!this.isExpired(req.cookies.token)) {
            next();
        } else {
            res.render("401"); // 401
        }
    } else {
        res.render("401"); // 401
    }
};

module.exports.isExpired = (token) => {
    if (token && jwt.decode(token)) {
        const expiry = jwt.decode(token).exp;
        const now = new Date();
        return now.getTime() > expiry * 1000;
    }
    return false;
};
