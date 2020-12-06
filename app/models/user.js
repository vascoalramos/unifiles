const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        auto: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 2,
        select: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    is_admin: {
        type: Boolean,
        required: true,
    },
    is_active: {
        type: Boolean,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
        default: "/images/UserDefault.png",
    },
    institution: {
        type: String,
        required: false,
    },
    token: {
        type: String,
    },
});

userSchema.pre("save", function (next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) {
        return next();
    }

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) {
            return next(err);
        }

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

/* Example
    "first_name": "Fábio",
    "last_name": "Gonçalves",
    "username": "fabiog",
    "email": "fabiog@gmail.com",
    "is_admin": "false",
    "password": "b6e318dabf42695e3943d896106c3e0cc5254866",
    "is_ctive": "true",
    "avatar": "xpto.png",
    "institution": "Uminho"
    */
const User = mongoose.model("users", userSchema, "users");

module.exports = User;
