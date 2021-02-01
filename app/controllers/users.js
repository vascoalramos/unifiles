const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

module.exports.listResources = (userId, skip = null, lim = null) => {
    let query = Resource.find({ "author._id": userId });

    if (skip) {
        query = query.skip(skip);
    }

    if (lim) {
        query = query.limit(lim);
    }

    return query.sort({ date_added: -1 });
};

module.exports.getTotalResources = (userId) => {
    return Resource.find({ "author._id": userId }).countDocuments();
};
