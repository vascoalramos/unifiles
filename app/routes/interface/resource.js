var express = require("express");
var router = express.Router();
var passport = require("passport");
const axios = require("axios");

router.get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    var id = req.params.id;
    const { user } = req;

    axios
        .get("/resources/" + id)
        .then((data) => {
            if (data.data.comments.length > 0) workDate(data.data.comments);

            res.render("resource/resource-individual-page", { user: user, resource: data.data });
        })
        .catch((e) => res.render("error", { error: e }));
});

// Convert date in days
function workDate(comments) {
    var today = new Date();

    comments.forEach((element) => {
        var commentDate = new Date(element.date);
        var diffTime = today.getTime() - commentDate.getTime();
        var diffInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        element.date = diffInDays + " day(s)";

        element.comments.forEach((el) => {
            el.date = diffInDays + " day(s)";
        });
    });
}

module.exports = router;
