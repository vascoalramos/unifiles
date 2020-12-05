const Role = require("../models/role");

// List Roles
module.exports.list = () => {
    return Role.find().exec();
};
