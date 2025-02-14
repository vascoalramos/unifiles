const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user");
const Resource = require("../models/resource");

module.exports.generateAuthToken = async function (user) {
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET_KEY, {
        expiresIn: parseInt(process.env.JWT_SECRET_TIME),
    });
    user.token = token;
    return user.save();
};

module.exports.findByCredentials = async function (username, password) {
    // Search for a user by username and password.
    const user = await User.findOne({ username }).select("password");

    if (!user) {
        throw { error: "Invalid login credentials." };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw { error: "Invalid login credentials." };
    }

    return User.findOne({ username });
};

module.exports.findByAuthUsername = (data) => {
    let username = data.username;

    return User.findOne({ username: username });
};

module.exports.findByAuthEmail = (email) => {
    return User.findOne({ email: email });
};

module.exports.insert = (user) => {
    var newUser = new User(user);

    return newUser.save();
};

module.exports.update = (user) => {
    return User.findOneAndUpdate({ _id: user.id }, user, {
        new: true,
    });
};

module.exports.delete = (username) => {
    return User.findOneAndUpdate(
        { username: username },
        { is_active: false, token: null, accessToken: null },
        {
            new: true,
        },
    );
};

module.exports.updateAccessToken = (user) => {
    return User.findOneAndUpdate(
        { username: user.dados.username },
        { accessToken: user.dados.accessToken },
        {
            new: true,
        },
    );
};
module.exports.updateNotifications = (resourceauthorid, resourceNotification) => {
    return User.updateMany(
        { _id: { $ne: resourceauthorid } },
        { $push: { notifications: { $each: [resourceNotification], $position: 0, $slice: 50 } } },
        { new: true },
    );
};
module.exports.updateNotificationsRatingAndComments = (resourceauthorid, resourceNotification) => {
    return User.updateMany(
        { _id: { $eq: resourceauthorid } },
        { $push: { notifications: { $each: [resourceNotification], $position: 0, $slice: 50 } } },
        { new: true },
    );
};

module.exports.getAllNotifications = (dataNotifications) => {
    return User.aggregate([
        {
            $unwind: {
                path: "$notifications",
            },
        },
        {
            $match: {
                _id: new mongoose.mongo.ObjectId(dataNotifications.id),
                "notifications.date": {
                    $gt: new Date(dataNotifications.date),
                },
            },
        },
        {
            $project: {
                notifications: 1,
            },
        },
    ]);
};
module.exports.updateReadedNotifications = (id) => {
    return User.updateOne(
        {
            _id: new mongoose.mongo.ObjectId(id.userId),
            notifications: {
                $elemMatch: { _id: new mongoose.mongo.ObjectId(id.notificationId) },
            },
        },
        {
            $set: {
                "notifications.$.read": true,
            },
        },
    );
};

module.exports.updateTokens = (user) => {
    return User.findOneAndUpdate(
        { username: user.username },
        { accessToken: user.accessToken, token: user.token },
        {
            new: true,
        },
    );
};

module.exports.updatePassword = (data) => {
    return new Promise(function (resolve, reject) {
        User.findOne(
            {
                email: data.email,
            },
            function (error, item) {
                if (error) {
                    console.log(error);
                } else {
                    item.password = data.password;

                    item.save()
                        .then((result) => {
                            resolve(result);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            },
        );
    });
};

module.exports.listResources = (userId, skip = 0, lim = 5) => {
    return Resource.aggregate([
        {
            $match: {
                "author._id": new mongoose.mongo.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "author._id",
                foreignField: "_id",
                as: "author",
            },
        },
        {
            $unwind: {
                path: "$author",
            },
        },
        {
            $project: {
                "author.is_admin": 0,
                "author.is_active": 0,
                "author.token": 0,
                "author.accessToken": 0,
                "author.username": 0,
                "author.filiation": 0,
                "author.email": 0,
                "author.password": 0,
            },
        },
        {
            $sort: {
                date_added: -1,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: lim,
        },
    ]);
};

module.exports.getTotalResources = (userId) => {
    return Resource.find({ "author._id": userId }).countDocuments();
};

module.exports.getUserImage = async (id) => {
    let user = await User.findOne({ _id: id }, { avatar: 1 }).exec();
    let imagePath = user.avatar;
    if (imagePath === "images/UserDefault.png") {
        imagePath = `/public/${imagePath}`;
    }
    return imagePath;
};

module.exports.list = () => {
    return User.find();
};

module.exports.getTotalActiveUsers = () => {
    return User.find({ is_active: true }).countDocuments();
};
