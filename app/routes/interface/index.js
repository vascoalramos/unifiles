var express = require("express");
var router = express.Router();
var passport = require("passport");
const axios = require("axios");

router.get("/", (req, res) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err || !user) res.redirect("/auth/login");
        if (user) res.render("index", { user: user });
    })(req, res);
});

/* POST logout */
router.get("/logout", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { user } = req;

    if (user.accessToken != null) {
        axios
            .post("https://accounts.google.com/o/oauth2/revoke?token=" + user.accessToken)
            .then(() => {
                user.accessToken = null;
                user.token = null;
                axios.put("http://localhost:3000/api/auth/updateAccessToken", { dados: user }).then(() => {
                    res.clearCookie("token");
                    return res.status(200).redirect("/auth/login");
                });
            })
            .catch(() => res.render("index", { user: user }));
    } else {
        res.clearCookie("token");
        return res.status(200).redirect("/auth/login");
    }
});
module.exports = router;
