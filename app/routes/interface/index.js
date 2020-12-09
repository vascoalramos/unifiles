var express = require("express");
const axios = require("axios");
const { isAuthenticated } = require("../../middleware/auth");

var router = express.Router();

/* GET home page.*/
router.get("/", isAuthenticated, (req, res, next) => {
    res.render("login", { title: "Login" });
});

/* POST logout */
router.post("/logout", isAuthenticated, (req, res) => {
    axios
        .get("/auth/logout", {
            headers: {
                Authorization: req.cookies.token,
            },
        })
        .then(() => {
            res.clearCookie("token"); // delete cookie
            return res.status(200).redirect("/auth/login");
        })
        .catch((error) => {
            var errors = error.response.data;
            if (error.response.status) res.render("login", { title: "Login", errors: errors.error });
            else console.log(error.toString());
            return;
        });
});

module.exports = router;
