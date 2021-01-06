const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const User = require("../../controllers/users");

router.post(
    "/login",
    [
        body("username").isLength({ min: 1 }), // Need upgrade
        body("password").isLength({ min: 1 }), // Need upgrade
    ],
    (req, res) => {
        let data = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        User.findByCredentials(data.username, data.password)
            .then((user) => {
                if (user.is_active) {
                    User.generateAuthToken(user)
                        .then((data) => {
                            res.status(201).jsonp(data);
                        })
                        .catch((error) => {
                            console.log(error.toString());
                            res.status(401).jsonp(error);
                        });
                } else {
                    res.status(401).jsonp({ error: "User does not exist" });
                }
            })
            .catch((error) => {
                console.log(error.toString());
                res.status(401).jsonp(error);
            });
    },
);

router.put("/updateAccessToken", (req, res, next) => {
    let data = req.body;
    User.updateAccessToken(data)
        .then((user) => {
            res.status(200).jsonp(user);
        })
        .catch((error) => {
            console.log(error.toString());
            res.status(401).jsonp(error);
        });
});

router.put("/tokens", (req, res, next) => {
    let data = req.body;
    console.log(data);
    User.updateTokens(data)
        .then((user) => {
            res.status(200).jsonp(user);
        })
        .catch((error) => {
            console.log(error.toString());
            res.status(401).jsonp(error);
        });
});

module.exports = router;
