var express = require("express");
var router = express.Router();
var passport = require("passport");
const axios = require("axios");


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

router.get("/", (req, res) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        tagsArray = new Array();
        if (err || !user) res.redirect("/auth/login");
        if (user){
            axios
            .get("http://localhost:3000/api/resources/tags")
            .then((tags) => {
                tags.data.forEach(element => {
                    element.tags.forEach(tag => {
                        tagsArray.push(tag)
                    });
                });
                var unique = tagsArray.filter(onlyUnique);
                res.render("index", { title: "Home", user: user , tags: unique});
            })
            .catch(() => res.render("index", { user: user }));
        }
    })(req, res);
});

router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { user } = req;

    res.render("profile", { title: "Edit Profile", user: user });
});

module.exports = router;
