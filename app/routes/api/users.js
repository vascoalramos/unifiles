const express = require("express");
const passport = require("passport");
const path = require("path");
const { body, validationResult } = require("express-validator");
const passwordValidator = require("password-validator");
const multer = require("multer");
const fs = require("fs");

const { isSelf, isAdmin } = require("../../middleware/authorization");
const User = require("../../controllers/users");
const app = express();
const mailer = require("express-mailer");
const jwt = require("jsonwebtoken");

var schemaPassValidator = new passwordValidator();
var siteLink = process.env.API_URL.slice(0, -4);

app.set("views", path.join(__dirname, "../../views/emails"));
app.set("view engine", "pug");

mailer.extend(app, {
    from: process.env.FROM_EMAIL,
    host: process.env.HOST_EMAIL, // hostname
    secureConnection: false, // use SSL
    port: process.env.PORT_EMAIL, // port for secure SMTP
    transportMethod: "SMTP", // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
    },
});

const router = express.Router();

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dest = path.join(__dirname, "/../../imgs");

        fs.mkdir(dest, function (err) {
            if (err) {
                if (err.code == "EEXIST") cb(null, dest);
                else cb(err, dest);
            } else cb(null, dest);
        });
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
let upload = multer({ storage: diskStorage });

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
    "/",
    [
        body("first_name").not().isEmpty().withMessage("First Name field is required."),
        body("last_name").not().isEmpty().withMessage("Last Name field is required."),
        body("email").isEmail().withMessage("Email field must be an email."),
        body("institution").isLength({ min: 2 }).withMessage("Institution field must be at least 2 chars long."), // Ex: UM
        body("position").isLength({ min: 2 }).withMessage("Position field must be at least 2 chars long."), // Ex: student
        body("username").isLength({ min: 2 }).withMessage("Username field must be at least 2 chars long."), // Ex: AC
        body("confirm_password").not().isEmpty().withMessage("Confirm Password field is required."),
    ],
    (req, res) => {
        let data = req.body;
        var generalErrors = [];
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

        data.filiation = {
            institution: data.institution,
            position: data.position,
        };

        delete data.institution;
        delete data.position;

        User.insert(data)
            .then((user) => {
                res.status(201).jsonp(data);
            })
            .catch((err) => {
                if (err.name === "MongoError" && err.code === 11000) {
                    if (err.keyPattern.email != undefined)
                        generalErrors.push({ field: "email", msg: "Email already registed" });
                    if (err.keyPattern.username != undefined)
                        generalErrors.push({ field: "username", msg: "Username already registed" });
                }
                if (generalErrors.length > 0) {
                    return res.status(400).json({ generalErrors });
                } else {
                    res.status(400).jsonp(err);
                }
            });
    },
);
router.get("/getAllNotifications", (req, res) => {
    let data = req.query;
    User.getAllNotifications(data)
        .then((latestNotification) => {
            res.status(200).jsonp(latestNotification);
        })
        .catch((err) => {
            res.status(400).jsonp(err);
        });
});
router.put("/updateNotification", (req, res) => {
    let data = req.body;
    User.updateReadedNotifications(data)
        .then((user) => {
            res.status(200).jsonp(data);
        })
        .catch((err) => {
            res.status(400).jsonp(err);
        });
});
router.put(
    "/confirmRecoverPassword",
    [body("confirm_password").not().isEmpty().withMessage("Confirm Password field is required.")],
    (req, res) => {
        let data = req.body;
        var generalErrors = [];
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

        if (generalErrors.length > 0) return res.status(400).json({ generalErrors });

        User.updatePassword(data)
            .then((user) => {
                res.clearCookie("recover_token");
                res.status(201).jsonp("Password updated!");
            })
            .catch((error) => {
                res.status(400).jsonp(error);
            });
    },
);

router.put(
    "/:username",
    passport.authenticate("jwt", { session: false }),
    upload.single("avatar"),
    [
        body("first_name").not().isEmpty().withMessage("First Name field is required."),
        body("last_name").not().isEmpty().withMessage("Last Name field is required."),
        body("email").isEmail().withMessage("Email field must be an email."),
        body("institution").isLength({ min: 2 }).withMessage("Institution field must be at least 2 chars long."), // Ex: UM
        body("position").isLength({ min: 2 }).withMessage("Position field must be at least 2 chars long."), // Ex: student
    ],
    (req, res) => {
        let data = req.body;
        var generalErrors = [];

        var errors = validationResult(req);

        errors.errors.forEach((element) => {
            generalErrors.push({ field: element.param, msg: element.msg });
        });

        if (generalErrors.length > 0) {
            return res.status(400).json({ generalErrors });
        }

        data.filiation = {
            institution: data.institution,
            position: data.position,
        };

        if (req.file && req.file.filename) data.avatar = `imgs/${req.file.filename}`;

        delete data.institution;
        delete data.position;
        delete data.username;

        User.update(data)
            .then((user) => {
                res.status(200).jsonp(data);
            })
            .catch((err) => {
                generalErrors = [];
                if (err.name === "MongoError" && err.code === 11000) {
                    if (err.keyPattern.email != undefined)
                        generalErrors.push({ field: "email", msg: "Email already registed" });
                    if (err.keyPattern.username != undefined)
                        generalErrors.push({ field: "username", msg: "Username already registed" });
                }
                if (generalErrors.length > 0) {
                    return res.status(400).json({ generalErrors });
                } else {
                    res.status(400).jsonp(err);
                }
            });
    },
);

router.put("/:username/accessControl", passport.authenticate("jwt", { session: false }), isAdmin, (req, res) => {
    let data = req.body;
    User.update(data)
        .then((user) => {
            res.status(200).jsonp(user);
        })
        .catch((err) => {
            res.status(400).jsonp(err);
        });
});

router.put(
    "/editPassword/:password",
    passport.authenticate("jwt", { session: false }),
    [body("confirm_password").not().isEmpty().withMessage("Confirm Password field is required.")],
    (req, res) => {
        let data = req.body;
        var generalErrors = [];

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

        User.update(data)
            .then((user) => {
                res.status(200).jsonp(data);
            })
            .catch((err) => {
                res.status(400).jsonp(err);
            });
    },
);

router.delete("/:username", passport.authenticate("jwt", { session: false }), (req, res) => {
    User.delete(req.params.username)
        .then(() => {
            res.status(200).jsonp("Success");
        })
        .catch((error) => {
            console.log(error);
            res.status(400).jsonp(error);
        });
});

router.get("/byEmail", (req, res) => {
    let email = req.query.email;
    User.findByAuthEmail(email)
        .then((user) => {
            res.status(200).jsonp(user);
        })
        .catch((error) => {
            console.log(error.toString());
            res.status(400).jsonp(error);
        });
});

router.get("/", passport.authenticate("jwt", { session: false }), isAdmin, (req, res) => {
    User.list()
        .then((users) => {
            res.status(200).jsonp(users);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).jsonp(error);
        });
});

router.get("/:username", (req, res) => {
    let data = req.params;
    User.findByAuthUsername(data)
        .then((user) => {
            res.status(200).jsonp(user);
        })
        .catch((error) => {
            console.log(error.toString());
            res.status(400).jsonp(error);
        });
});

router.post("/recoverPassword", [body("email").isEmail().withMessage("Email field must be an email.")], (req, res) => {
    let data = req.body;
    var generalErrors = [];
    var errors = validationResult(req);

    errors.errors.forEach((element) => {
        generalErrors.push({ field: element.param, msg: element.msg });
    });

    if (generalErrors.length > 0) return res.status(400).json({ generalErrors });

    User.findByAuthEmail(data.email)
        .then((user) => {
            if (user == null) {
                generalErrors.push({ field: "email", msg: "No account found with that email address!" });

                return res.status(400).json({ generalErrors });
            }

            const token = jwt.sign({ email: data.email }, process.env.JWT_SECRET_KEY, {
                expiresIn: parseInt(process.env.JWT_SECRET_TIME_RECOVER_PASSWORD),
            });

            var mailOptions = {
                to: data.email,
                subject: "Recover Password",
                data: { link: siteLink + "/auth/recoverPassword/" + token },
            };

            // Send an email
            app.mailer.send("recover-password", mailOptions, function (err, message) {
                if (err) res.status(502).jsonp(err);
                else {
                    res.cookie("recover_token", token);

                    res.status(200).jsonp(user);
                }
            });
        })
        .catch((error) => {
            res.status(400).jsonp(error);
        });
});
router.get("/:id/avatar", (req, res) => {
    let id = req.params.id;
    User.getUserImage(id)
        .then((imagePath) => {
            res.sendFile(path.join(__dirname, "../../", imagePath));
        })
        .catch((error) => {
            console.log(error);
            res.status(400).jsonp(error);
        });
});

router.get("/:username/resources", passport.authenticate("jwt", { session: false }), isSelf, (req, res) => {
    let lim = req.query.lim;
    let skip = req.query.skip;
    let userId = req.user._id;
    let response = {};

    User.listResources(userId, Number(skip), Number(lim))
        .then((data) => {
            response["resources"] = data;
            User.getTotalResources(userId)
                .then((data) => {
                    response["total"] = data;
                    res.status(200).jsonp(response);
                })
                .catch((error) => {
                    res.status(400).jsonp(error);
                });
        })
        .catch((error) => {
            res.status(400).jsonp(error);
        });
});

module.exports = router;
