const User = require("../models/user");
var sha1 = require('sha1');

module.exports = {

    lookUp (data) {
        return User
            .findOne({email: data.email, password: sha1(data.password)})
            .exec()
    }
}