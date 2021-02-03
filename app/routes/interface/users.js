const express = require("express");
const router = express.Router();
const passport = require("passport");
const axios = require("axios");

router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { user } = req;

    if (user.is_admin) {
        res.render("users", { user: user });
    } else {
        res.render("403", { user: user });
    }
});

module.exports = router;
