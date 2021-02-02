const express = require("express");
const router = express.Router();
const passport = require("passport");
const axios = require("axios");

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

router.get("/", (req, res) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err || !user) res.redirect("/auth/login");
        if (user) {
            axios
                .get("resources/tags", { headers: { Cookie: `token=${req.cookies.token}` } })
                .then((data) => {
                    res.render("index", { user: user, tags: data.data });
                })
                .catch((e) => res.render("error", { user: user, error: e.response }));
        }
    })(req, res);
});

router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { user } = req;

    res.render("profile", { title: "Edit Profile", user: user });
});

router.get("/myResources", (req, res) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err || !user) res.redirect("/auth/login");
        axios
            .get("resources/tags", { headers: { Cookie: `token=${req.cookies.token}` } })
            .then((data) => {
                res.render("myResources", { user: user, tags: data.data });
            })
            .catch((e) => res.render("error", { user: user, error: e.response }));
    })(req, res);
});

module.exports = router;
