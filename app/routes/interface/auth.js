const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();

function isExpired(token) {
    if (token && jwt.decode(token)) {
        const expiry = jwt.decode(token).exp;
        const now = new Date();
        return now.getTime() > expiry * 1000;
    }
    return false;
}

router.get("/login", (req, res) => {
    if (req.cookies.token != undefined) {
        if (!isExpired(req.cookies.token)) {
            axios
                .get("http://localhost:3000/api/auth/user/" + req.cookies.token)
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

    axios
        .post("http://localhost:3000/api/auth/login", { username: data.username, password: data.password })
        .then((user) => {
            // Create cookie
            res.cookie("token", user.data.token);

            res.render("index", { user: user });
        })
        .catch((error) => {
            var errors = error.response.data;
            if (error.response.status) res.render("login", { title: "Login", errors: errors.error });
            else console.log(error.toString());
            return;
        });
});

module.exports = router;
