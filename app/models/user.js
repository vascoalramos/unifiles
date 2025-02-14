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
        default: false,
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true,
    },
    avatar: {
        type: String,
        required: true,
        default: "images/UserDefault.png",
    },
    filiation: {
        institution: {
            type: String,
            required: false,
        },
        position: {
            type: String,
            required: false,
        },
    },
    token: {
        type: String,
        default: null,
    },
    accessToken: {
        type: String,
        default: null,
    },
    notifications: [{
        text: {
            type: String
        },
        name: {
            type: String
        },
        date:{
            type: Date
        },
        read:{
            type: Boolean,
        },
        resourceId:{
            type: mongoose.Types.ObjectId
        },
    }]
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

userSchema.pre("findOneAndUpdate", function (next) {
    if (this._update.password) {
        // generate a salt
        bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
            if (err) {
                return next(err);
            }

            // hash the password along with our new salt
            bcrypt.hash(this._update.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }

                // override the cleartext password with the hashed one
                this._update.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model("users", userSchema, "users");

module.exports = User;
