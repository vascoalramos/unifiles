const express = require("express");
const passport = require("passport");

const { isAdmin } = require("../../middleware/authorization");
const Users = require("../../controllers/users");
const Resources = require("../../controllers/resources");

const router = express.Router();

router.get("/top/tags", passport.authenticate("jwt", { session: false }), isAdmin, (req, res) => {
    Resources.getTop10Tags()
        .then((tags) => res.status(200).jsonp(tags))
        .catch((err) => res.status(400).jsonp(err));
});

router.get("/top/users", passport.authenticate("jwt", { session: false }), isAdmin, (req, res) => {
    Resources.getTop10Users()
        .then((tags) => res.status(200).jsonp(tags))
        .catch((err) => res.status(400).jsonp(err));
});

router.get("/total/activeUsers", passport.authenticate("jwt", { session: false }), isAdmin, (req, res) => {
    Users.getTotalActiveUsers()
        .then((count) => res.status(200).jsonp(count))
        .catch((err) => res.status(400).jsonp(err));
});

module.exports = router;
