const express = require("express");
const router = express.Router();
const passport = require("passport");
const axios = require("axios");

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

router.get("/", (req, res) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        tagsArray = new Array();
        if (err || !user) res.redirect("/auth/login");
        if (user) {
            axios
                .get("/resources", { headers: { Cookie: `token=${req.cookies.token}` } })
                .then((data) => {
                    data.data.resources.forEach((ele) => {
                        ele.tags.forEach((tag) => {
                            tagsArray.push(tag);
                        });
                    });
                    var unique = tagsArray.filter(onlyUnique);
                    res.render("index", { user: user, resources: data.data, tags: unique });
                })
                .catch((e) => res.render("error", { error: e }));
        }
    })(req, res);
});

router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { user } = req;

    res.render("profile", { title: "Edit Profile", user: user });
});

router.get("/myResources", (req, res) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err || !user) res.redirect("/auth/login");
        if (user) {
            res.render("myResources", { user: user });
        }
    })(req, res);
});

module.exports = router;
