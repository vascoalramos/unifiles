const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const passport = require("passport");

const User = require("../../controllers/users");

var passwordValidator = require("password-validator");
var schemaPassValidator = new passwordValidator();

// Strong password
schemaPassValidator
    .is()
    .min(8) // Minimum length 8
    .has()
    .lowercase() // Must have letters
    .has()
    .uppercase() // Must have letters
    .has()
    .digits() // Must have digits
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123"]); // Blacklist these values

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
    },
);

router.get("/user/:username", (req, res, next) => {
    let data = req.params;
    User.findByAuthUsername(data)
        .then((user) => {
            res.status(200).jsonp(user);
        })
        .catch((error) => {
            console.log(error.toString());
            res.status(401).jsonp(error);
        });
});

router.get("/email/:email", (req, res, next) => {
    let data = req.params;
    User.findByAuthEmail(data)
        .then((user) => {
            res.status(200).jsonp(user);
        })
        .catch((error) => {
            console.log(error.toString());
            res.status(401).jsonp(error);
        });
});

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
    User.updateTokens(data)
        .then((user) => {
            res.status(200).jsonp(user);
        })
        .catch((error) => {
            console.log(error.toString());
            res.status(401).jsonp(error);
        });
});

router.post(
    "/register",
    [
        body("first_name").not().isEmpty().withMessage("First Name field is required."),
        body("last_name").not().isEmpty().withMessage("Last Name field is required."),
        body("email").isEmail().withMessage("Email field must be an email."),
        body("institution").isLength({ min: 2 }).withMessage("Institution field must be at least 2 chars long."), // Ex: UM
        body("username").isLength({ min: 2 }).withMessage("Username field must be at least 2 chars long."), // Ex: AC
        body("confirm_password").not().isEmpty().withMessage("Confirm Password field is required."),
    ],
    (req, res) => {
        let data = req.body;
        var generalErrors = [];

        //AINDA FALTA VERIFICAR SE EXISTE EMAIL E USERNAME
        //https://express-validator.github.io/docs/custom-validators-sanitizers.html#example-checking-if-e-mail-is-in-use

        var errors = validationResult(req);

        errors.errors.forEach((element) => {
            generalErrors.push({ field: element.param, msg: element.msg });
        });

        if (!schemaPassValidator.validate(data.password)) {
            generalErrors.push({
                field: "password",
                msg: "Password must be complex! At least 8 characters with lowercase, uppercase and digits.",
            });
        } else if (data.confirm_password && data.password != data.confirm_password)
            generalErrors.push({ field: "confirm_password", msg: "Password confirmation does not match password." });

        if (generalErrors.length > 0) {
            return res.status(400).json({ generalErrors });
        }

        delete data.confirm_password;

        User.insert(data)
            .then((user) => {
                res.status(200).jsonp(data);
            })
            .catch((error) => {
                console.log(error);
                res.status(401).jsonp(error);
            });
    },
);

module.exports = router;
