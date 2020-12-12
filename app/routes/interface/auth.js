const express = require("express");
const axios = require("axios");

const { isExpired } = require("../../middleware/auth");

const router = express.Router();

/*********/
/* LOGIN */
/*********/
router.get("/login", (req, res) => {
    if (req.cookies.token != undefined) {
        if (!isExpired(req.cookies.token)) {
            axios
                .get(`/auth/user/${req.cookies.token}`)
                .then((user) => {
                    res.render("index", { user: user });
                })
                .catch((error) => {
                    var errors = error.response.data;
                    if (error.response.status) res.render("login", { title: "Login", errors: errors.error });
                    else console.log(error.toString());
                    return;
                });
        } else res.render("login", { title: "Login" });
    } else res.render("login", { title: "Login" });
});

router.post("/login", (req, res) => {
    let data = req.body;

    login(req, res, data); // process login
});

/************/
/* REGISTER */
/************/
router.get("/register", (req, res) => {
    res.render("register");
});

/*****************/
/* AUX FUNCTIONS */
/*****************/
function login(res, data) {
    axios
        .post("/auth/login", { username: data.username, password: data.password })
        .then((user) => {
            // Create cookie
            res.cookie("token", user.data.token);
            res.render("index", { user: user.data });
        })
        .catch((error) => {
            var errors = error.response.data;
            if (error.response.status) res.render("login", { title: "Login", errors_login: errors.error });
            else console.log(error.toString());
            return;
        });
}

module.exports = router;
