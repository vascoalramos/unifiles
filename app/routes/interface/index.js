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


module.exports = router;
