var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../../middleware/auth");

/* GET home page.*/
router.get("/", isAuthenticated, (req, res, next) => {
    res.render("login", { title: "Login" });
});

/* POST logout */
router.post("/logout", isAuthenticated, (req, res) => {
    res.clearCookie("token"); // delete cookie
    return res.status(200).redirect("/auth/login");
});

module.exports = router;
