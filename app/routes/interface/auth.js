const express = require("express");
const axios = require("axios");
const router = express.Router();
var passport = require("passport");
const { token } = require("morgan");

/*********/
/* LOGIN */
/*********/
router.get("/login", (req, res) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err || !user) res.render("login", { title: "Login" });
        if (user) res.redirect("/");
    })(req, res);
});
// Interface routes

//Login Google
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/auth/register" }),
    (req, res) => {
        const { user } = req;

        req.login(user, { session: false }, (error) => {
            res.cookie("token", user.token);
            res.redirect("/");
        });
    },
);
router.get("/google", (req, res) => {
    passport.authenticate("google", { session: false, scope: ["profile", "email"] }, (err, user) => {})(req, res);
});

router.post("/login", (req, res) => {
    login(req, res); // process login
});

/************/
/* REGISTER */
/************/
router.get("/register", (req, res) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err || !user) res.render("register", { title: "Register" });
        if (user) res.render("index", { title: "Home", user: user });
    })(req, res);
});

/**********/
/* LOGOUT */
/*********/
router.get("/logout", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { user } = req;

    if (user.accessToken != null) {
        axios
            .post("https://accounts.google.com/o/oauth2/revoke?token=" + user.accessToken)
            .then(() => {
                user.accessToken = null;
                user.token = null;
                axios.put("http://localhost:3000/api/auth/tokens", user).then(() => {
                    res.clearCookie("token");
                    return res.redirect("/");
                });
            })
            .catch(() => res.render("index", { user: user }));
    } else {
        user.accessToken = null;
        user.token = null;
        axios.put("http://localhost:3000/api/auth/tokens", user).then(() => {
            res.clearCookie("token");
            return res.redirect("/");
        });
    }
});

/*****************/
/* AUX FUNCTIONS */
/*****************/
function login(req, res) {
    passport.authenticate("local", { session: false }, (err, user) => {
        if (err) {
            return res.render("login", { error_login: err.response.data.error });
        }

        req.login(user, { session: false }, (error) => {
            res.cookie("token", user.token);
            res.redirect("/");
        });
    })(req, res);
}

module.exports = router;
