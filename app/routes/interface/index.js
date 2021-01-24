var express = require("express");
var router = express.Router();
var passport = require("passport");
const axios = require("axios");

router.get("/", (req, res) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err || !user) res.redirect("/auth/login");
        if (user) {
            axios
                .get("/resources")
                .then((data) => {
                    res.render("index", { user: user, resources: data.data });
                })
                .catch((e) => res.render("error", { error: e }));
            //res.render("index", { title: "Home", user: user })
        }
    })(req, res);
});

router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { user } = req;

    res.render("profile", { title: "Edit Profile", user: user });
});

module.exports = router;
