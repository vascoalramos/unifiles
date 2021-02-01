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
        .catch((e) => res.render("error", { error: e }));
});

// Router para script
module.exports = router;
