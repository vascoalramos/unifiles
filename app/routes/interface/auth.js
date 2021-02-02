const express = require("express");
const axios = require("axios");
const router = express.Router();
const passport = require("passport");
const jwt_decode = require("jwt-decode");

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
router.get("/google/callback", (req, res) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
        if (!err || user) {
            req.login(user, { session: false }, (error) => {
                res.cookie("token", user["token"]);
                res.redirect("/");
            });
        } else res.render("register", { title: "Register", user: err });
    })(req, res);
});
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
                axios.put("auth/tokens", user, { headers: { Cookie: `token=${req.cookies.token}` } }).then(() => {
                    res.clearCookie("token");
                    return res.redirect("/");
                });
            })
            .catch((err) => {
                console.log(err);
                res.render("error", { user: user, error: err.response });
            });
    } else {
        user.accessToken = null;
        user.token = null;
        axios.put("auth/tokens", user, { headers: { Cookie: `token=${req.cookies.token}` } }).then(() => {
            res.clearCookie("token");
            return res.redirect("/");
        });
    }
});

router.get("/recoverPassword", (req, res) => {
    res.render("recover-password/recover-password");
});

router.get("/recoverPassword/:id", (req, res) => {
    var token = req.cookies.recover_token;
    var decoded = { exp: null };

    if (token != undefined) decoded = jwt_decode(token);

    if (new Date().getTime() / 1000 > decoded.exp) {
        res.clearCookie("recover_token");
        res.render("recover-password/recover-password-expired");
    } else res.render("recover-password/recover-password-form-confirm", { email: decoded.email });
});

/*****************/
/* AUX FUNCTIONS */
/*****************/
function login(req, res) {
    passport.authenticate("local", { session: false }, (err, user) => {
        if (err) {
            var error = err.response.data;
            return res.status(401).json({ error });
        }

        req.login(user, { session: false }, (error) => {
            res.cookie("token", user.token);
            res.redirect("/");
        });
    })(req, res);
}

module.exports = router;
