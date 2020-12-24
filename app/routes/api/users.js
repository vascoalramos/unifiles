const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../../controllers/users");

router.post(
    "/",
    [
        body("data.first_name").isLength({ min: 1 }),
        body("data.last_name").isLength({ min: 1 }),
        body("data.email").isEmail(),
        body("data.institution").isLength({ min: 2 }), // Ex: UM
        body("data.username").isLength({ min: 2 }), // Ex: AC
    ],
    (req, res) => {
        let data = req.body;
        var errors = null;

        errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        delete data.confirm_password;

        User.insert(data)
            .then((user) => {
                res.status(200).jsonp(user);
            })
            .catch((error) => {
                res.status(401).jsonp(error);
            });
    },
);
module.exports = router;
