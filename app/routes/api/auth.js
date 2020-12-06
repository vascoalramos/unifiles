const express = require("express");
const router = express.Router();

const User = require("../../controllers/users");

router.post("/login", (req, res) => {
    let data = req.body;

    if (!("username" in data && "password" in data)) {
        return res.status(400).jsonp({ error: "Missing credentials" });
    }

    User.findByCredentials(data.username, data.password)
        .then((user) => {
            User.generateAuthToken(user)
                .then((data) => {
                    res.status(200).jsonp(data);
                })
                .catch((error) => {
                    console.log(error.toString());
                    res.status(401).jsonp(error);
                });
        })
        .catch((error) => {
            console.log(error.toString());
            res.status(401).jsonp(error);
        });
});

module.exports = router;
