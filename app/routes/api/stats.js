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

router.get("/total/resources", passport.authenticate("jwt", { session: false }), isAdmin, (req, res) => {
    let groupBy = req.query.groupBy;

    if (!groupBy) {
        return res.status(400).jsonp("Missing 'groupBy' query string parameter!");
    }

    if (!["hour", "day", "month"].includes(groupBy)) {
        return res.status(400).jsonp("Invalid 'groupBy' query string parameter: must be 'hour, 'day' or 'month'!");
    }

    Resources.getTotalResourcesGroupByTime(groupBy)
        .then((data) => res.status(200).jsonp(data))
        .catch((err) => res.status(400).jsonp(err));
});

module.exports = router;
