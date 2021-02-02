const express = require("express");
const router = express.Router();
const passport = require("passport");
const axios = require("axios");

router.get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    var id = req.params.id;
    const { user } = req;

    axios
        .get("/resources/" + id, { headers: { Cookie: `token=${req.cookies.token}` } })
        .then((data) => {
            res.render("resource/resource-individual-page", { user: user, resource: data.data });
        })
        .catch((e) => {
            if (e.status === 404) {
                res.render("404", { user: user });
            } else if (e.status === 403) {
                res.render("403", { user: user });
            } else {
                res.render("error", { user: user, error: e });
            }
        });
});

router.get("/:id/edit", passport.authenticate("jwt", { session: false }), (req, res) => {
    var id = req.params.id;
    const { user } = req;

    axios
        .get("/resources/" + id, { headers: { Cookie: `token=${req.cookies.token}` } })
        .then((data) => {
            if (user.is_admin || data.data.author._id === user._id) {
                res.render("resource/resource-individual-page-edit", { user: user, resource: data.data });
            } else {
                res.render("403", { user: user });
            }
        })
        .catch((e) => {
            res.render("error", { user: user, error: e });
        });
});

module.exports = router;
