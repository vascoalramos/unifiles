const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../../controllers/users");

var passwordValidator = require('password-validator');
var schemaPassValidator = new passwordValidator();

// Strong password
schemaPassValidator
    .is().min(8)                                    // Minimum length 8
    .has().lowercase()                              // Must have letters
    .has().uppercase()                              // Must have letters
    .has().digits()                                 // Must have digits
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

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

router.get("/user/:token", (req, res, next) => {
    let data = req.params;

    User.findByAuthToken(data)
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
        body("data.first_name").isLength({ min: 1 }), 
        body("data.last_name").isLength({ min: 1 }), 
        body("data.email").isEmail(),
        body("data.institution").isLength({ min: 2 }),  // Ex: UM
        body("data.username").isLength({ min: 2 }),  // Ex: AC
    ],
    (req, res) => {
        let data = req.body;
        var errors = null;

        errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        // if(!schemaPassValidator.validate(data.password))
        // errors.strong_pass = '1...';
        // else 
        //     if (data.password != data.repeatPassword) 
        //     errors.diff_pass_error = "2..."
        
        delete data.confirm_password

        User.insert(data)
            .then((user) => {
                res.status(200).jsonp(data);
            })
            .catch((error) => {
                res.status(401).jsonp(error);
            });
    },
);

module.exports = router;
