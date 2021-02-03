const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/users", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { user } = req;

    if (user.is_admin) {
        res.render("admin/users", { user: user });
    } else {
        res.render("403", { user: user });
    }
});

router.get("/resources", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { user } = req;

    if (user.is_admin) {
        res.render("admin/all-resources", { user: user });
    } else {
        res.render("403", { user: user });
    }
});

router.get("/dashboard", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { user } = req;

    if (user.is_admin) {
        res.render("admin/dashboard", { user: user });
    } else {
        res.render("403", { user: user });
    }
});

module.exports = router;
