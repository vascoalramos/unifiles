const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const passport = require("passport");

const User = require("../../controllers/users");

router.post(
    "/login",
    [
        body("username").not().isEmpty().withMessage("Username field is required."), // Ex: AC
        body("password").not().isEmpty().withMessage("Password field is required."),
    ],
    (req, res) => {
        let data = req.body;
        var generalErrors = [];
        var errors = validationResult(req);

        errors.errors.forEach((element) => {
            generalErrors.push({ field: element.param, msg: element.msg });
        });

        if (generalErrors.length > 0) {
            return res.status(401).json({ generalErrors });
        }

        User.findByCredentials(data.username, data.password)
            .then((user) => {
                if (user.is_active) {
                    User.generateAuthToken(user)
                        .then((data) => {
                            res.status(201).jsonp(data);
                        })
                        .catch((error) => {
                            res.status(401).jsonp(error);
                        });
                } else {
                    generalErrors.push({ field: "password", msg: "User does not exist" });
                    res.status(401).jsonp({ generalErrors });
                }
            })
            .catch((error) => {
                generalErrors.push({ field: "password", msg: error.error });
                res.status(401).jsonp({ generalErrors });
            });
    },
);

router.put("/updateAccessToken", (req, res, next) => {
    let data = req.body;
    User.updateAccessToken(data)
        .then((user) => {
            if (user.is_active) {
                User.generateAuthToken(user)
                    .then((data) => {
                        res.status(200).jsonp(data);
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
});

router.put("/tokens", passport.authenticate("jwt", { session: false }), (req, res, next) => {
    let data = req.body;
    
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
