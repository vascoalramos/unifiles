const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

module.exports.generateAuthToken = async function (user) {
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_SECRET_TIME,
    });
    user.token = token;
    return user.save();
};

module.exports.findByCredentials = async function (username, password) {
    // Search for a user by username and password.
    const user = await User.findOne({ username }).select("password");

    if (!user) {
        throw { error: "Invalid login credentials" };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw { error: "Invalid login credentials" };
    }

    return await User.findOne({ username });
};
